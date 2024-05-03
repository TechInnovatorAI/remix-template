import { getOrder, getVariant } from '@lemonsqueezy/lemonsqueezy.js';

import {
  BillingConfig,
  BillingWebhookHandlerService,
  getLineItemTypeById,
} from '@kit/billing';
import { getLogger } from '@kit/shared/logger';
import { Database } from '@kit/supabase/database';

import { getLemonSqueezyEnv } from '../schema/lemon-squeezy-server-env.schema';
import { OrderWebhook } from '../types/order-webhook';
import { SubscriptionWebhook } from '../types/subscription-webhook';
import { initializeLemonSqueezyClient } from './lemon-squeezy-sdk';
import { createHmac } from './verify-hmac';

type UpsertSubscriptionParams =
  Database['public']['Functions']['upsert_subscription']['Args'];

type UpsertOrderParams =
  Database['public']['Functions']['upsert_order']['Args'];

type OrderStatus = 'pending' | 'failed' | 'paid' | 'refunded';

type SubscriptionStatus =
  | 'on_trial'
  | 'active'
  | 'cancelled'
  | 'paused'
  | 'expired'
  | 'unpaid'
  | 'past_due';

export class LemonSqueezyWebhookHandlerService
  implements BillingWebhookHandlerService
{
  private readonly provider: Database['public']['Enums']['billing_provider'] =
    'lemon-squeezy';

  private readonly namespace = 'billing.lemon-squeezy';

  constructor(private readonly config: BillingConfig) {}

  /**
   * @description Verifies the webhook signature - should throw an error if the signature is invalid
   */
  async verifyWebhookSignature(request: Request) {
    const logger = await getLogger();

    // get the event name and signature from the headers
    const eventName = request.headers.get('x-event-name');
    const signature = request.headers.get('x-signature') as string;

    // clone the request so we can read the body twice
    const reqClone = request.clone();
    const body = (await request.json()) as SubscriptionWebhook | OrderWebhook;
    const rawBody = await reqClone.text();

    // if no signature is found, throw an error
    if (!signature) {
      logger.error(
        {
          eventName,
        },
        `Signature header not found`,
      );

      throw new Error('Signature header not found');
    }

    const isValid = await isSigningSecretValid(rawBody, signature);

    // if the signature is invalid, throw an error
    if (!isValid) {
      logger.error(
        {
          eventName,
        },
        `Signing secret is invalid`,
      );

      throw new Error('Signing secret is invalid');
    }

    return body;
  }

  async handleWebhookEvent(
    event: OrderWebhook | SubscriptionWebhook,
    params: {
      onCheckoutSessionCompleted: (
        data: UpsertSubscriptionParams | UpsertOrderParams,
      ) => Promise<unknown>;
      onSubscriptionUpdated: (
        data: UpsertSubscriptionParams,
      ) => Promise<unknown>;
      onSubscriptionDeleted: (subscriptionId: string) => Promise<unknown>;
      onPaymentSucceeded: (sessionId: string) => Promise<unknown>;
      onPaymentFailed: (sessionId: string) => Promise<unknown>;
      onInvoicePaid: (data: UpsertSubscriptionParams) => Promise<unknown>;
      onEvent?: (event: string) => Promise<unknown>;
    },
  ) {
    const eventName = event.meta.event_name;

    switch (eventName) {
      case 'order_created': {
        return this.handleOrderCompleted(
          event as OrderWebhook,
          params.onCheckoutSessionCompleted,
        );
      }

      case 'subscription_created': {
        return this.handleSubscriptionCreatedEvent(
          event as SubscriptionWebhook,
          params.onSubscriptionUpdated,
        );
      }

      case 'subscription_updated': {
        return this.handleSubscriptionUpdatedEvent(
          event as SubscriptionWebhook,
          params.onSubscriptionUpdated,
        );
      }

      case 'subscription_expired': {
        return this.handleSubscriptionDeletedEvent(
          event as SubscriptionWebhook,
          params.onSubscriptionDeleted,
        );
      }

      case 'subscription_payment_success': {
        return this.handleInvoicePaid(
          event as SubscriptionWebhook,
          params.onInvoicePaid,
        );
      }

      default: {
        const logger = await getLogger();

        logger.info(
          {
            eventType: eventName,
            name: this.namespace,
          },
          `Unhandled Lemon Squeezy event type`,
        );

        return;
      }
    }
  }

  private async handleOrderCompleted(
    event: OrderWebhook,
    onCheckoutCompletedCallback: (
      data: UpsertSubscriptionParams | UpsertOrderParams,
    ) => Promise<unknown>,
  ) {
    await initializeLemonSqueezyClient();

    // we fetch the variant to check if the order is a subscription
    // if Lemon Squeezy was able to discriminate between orders and subscriptions
    // it would be better to use that information. But for now, we need to fetch the variant
    const variantId = event.data.attributes.first_order_item.variant_id;
    const { data } = await getVariant(variantId);

    // if the order is a subscription
    // we handle it in the subscription created event
    if (data?.data.attributes.is_subscription) {
      return;
    }

    const attrs = event.data.attributes;

    const orderId = attrs.first_order_item.order_id;
    const accountId = event.meta.custom_data.account_id.toString();
    const customerId = attrs.customer_id.toString();
    const status = this.getOrderStatus(attrs.status as OrderStatus);

    const payload: UpsertOrderParams = {
      target_account_id: accountId,
      target_customer_id: customerId,
      target_order_id: orderId.toString(),
      billing_provider: this.provider,
      status,
      currency: attrs.currency,
      total_amount: attrs.first_order_item.price,
      line_items: [
        {
          id: attrs.first_order_item.id.toString(),
          product_id: attrs.first_order_item.product_id.toString(),
          variant_id: attrs.first_order_item.variant_id.toString(),
          price_amount: attrs.first_order_item.price,
          quantity: 1,
        },
      ],
    };

    return onCheckoutCompletedCallback(payload);
  }

  private async handleSubscriptionCreatedEvent(
    event: SubscriptionWebhook,
    onSubscriptionCreatedEvent: (
      data: UpsertSubscriptionParams,
    ) => Promise<unknown>,
  ) {
    await initializeLemonSqueezyClient();

    const subscription = event.data.attributes;
    const orderId = subscription.order_id;
    const subscriptionId = event.data.id;
    const accountId = event.meta.custom_data.account_id;
    const customerId = subscription.customer_id.toString();
    const status = subscription.status;
    const variantId = subscription.variant_id;
    const productId = subscription.product_id;
    const createdAt = subscription.created_at;
    const endsAt = subscription.ends_at;
    const renewsAt = subscription.renews_at;
    const trialEndsAt = subscription.trial_ends_at;
    const intervalCount = subscription.billing_anchor;

    const { data: order, error } = await getOrder(orderId);

    if (error ?? !order) {
      const logger = await getLogger();

      logger.error(
        {
          orderId,
          subscriptionId,
          error,
          name: this.namespace,
        },
        'Failed to fetch order',
      );

      throw new Error('Failed to fetch order');
    }

    const lineItems = [
      {
        id: subscription.order_item_id.toString(),
        product: productId.toString(),
        variant: variantId.toString(),
        quantity: order.data.attributes.first_order_item.quantity,
        priceAmount: order.data.attributes.first_order_item.price,
      },
    ];

    const interval = intervalCount === 1 ? 'month' : 'year';

    const payload = this.buildSubscriptionPayload({
      customerId,
      id: subscriptionId,
      accountId,
      lineItems,
      status,
      interval,
      intervalCount,
      currency: order.data.attributes.currency,
      periodStartsAt: new Date(createdAt).getTime(),
      periodEndsAt: new Date(renewsAt ?? endsAt).getTime(),
      cancelAtPeriodEnd: subscription.cancelled,
      trialStartsAt: trialEndsAt ? new Date(createdAt).getTime() : null,
      trialEndsAt: trialEndsAt ? new Date(trialEndsAt).getTime() : null,
    });

    return onSubscriptionCreatedEvent(payload);
  }

  private handleSubscriptionUpdatedEvent(
    event: SubscriptionWebhook,
    onSubscriptionUpdatedCallback: (
      subscription: UpsertSubscriptionParams,
    ) => Promise<unknown>,
  ) {
    return this.handleSubscriptionCreatedEvent(
      event,
      onSubscriptionUpdatedCallback,
    );
  }

  private handleInvoicePaid(
    subscription: SubscriptionWebhook,
    onInvoicePaidCallback: (
      subscription: UpsertSubscriptionParams,
    ) => Promise<unknown>,
  ) {
    return this.handleSubscriptionCreatedEvent(
      subscription,
      onInvoicePaidCallback,
    );
  }

  private handleSubscriptionDeletedEvent(
    subscription: SubscriptionWebhook,
    onSubscriptionDeletedCallback: (subscriptionId: string) => Promise<unknown>,
  ) {
    // Here we don't need to do anything, so we just return the callback

    return onSubscriptionDeletedCallback(subscription.data.id);
  }

  private buildSubscriptionPayload<
    LineItem extends {
      id: string;
      quantity: number;
      product: string;
      variant: string;
      priceAmount: number;
    },
  >(params: {
    id: string;
    accountId: string;
    customerId: string;
    lineItems: LineItem[];
    interval: string;
    intervalCount: number;
    status: string;
    currency: string;
    cancelAtPeriodEnd: boolean;
    periodStartsAt: number;
    periodEndsAt: number;
    trialStartsAt: number | null;
    trialEndsAt: number | null;
  }): UpsertSubscriptionParams {
    const active = params.status === 'active' || params.status === 'trialing';

    const lineItems = params.lineItems.map((item) => {
      const quantity = item.quantity ?? 1;

      return {
        id: item.id,
        quantity,
        interval: params.interval,
        interval_count: params.intervalCount,
        subscription_id: params.id,
        product_id: item.product,
        variant_id: item.variant,
        price_amount: item.priceAmount,
        type: getLineItemTypeById(this.config, item.id),
      };
    });

    // otherwise we are updating a subscription
    // and we only need to return the update payload
    return {
      target_subscription_id: params.id,
      target_account_id: params.accountId,
      target_customer_id: params.customerId,
      billing_provider: this.provider,
      status: this.getSubscriptionStatus(params.status as SubscriptionStatus),
      line_items: lineItems,
      active,
      currency: params.currency,
      cancel_at_period_end: params.cancelAtPeriodEnd ?? false,
      period_starts_at: getISOString(params.periodStartsAt) as string,
      period_ends_at: getISOString(params.periodEndsAt) as string,
      trial_starts_at: params.trialStartsAt
        ? getISOString(params.trialStartsAt)
        : undefined,
      trial_ends_at: params.trialEndsAt
        ? getISOString(params.trialEndsAt)
        : undefined,
    };
  }

  private getOrderStatus(status: OrderStatus) {
    switch (status) {
      case 'paid':
        return 'succeeded';
      case 'pending':
        return 'pending';
      case 'failed':
        return 'failed';
      case 'refunded':
        return 'failed';
      default:
        return 'pending';
    }
  }

  private getSubscriptionStatus(status: SubscriptionStatus) {
    switch (status) {
      case 'active':
        return 'active';
      case 'cancelled':
        return 'canceled';
      case 'paused':
        return 'paused';
      case 'on_trial':
        return 'trialing';
      case 'past_due':
        return 'past_due';
      case 'unpaid':
        return 'unpaid';
      case 'expired':
        return 'past_due';
      default:
        return 'active';
    }
  }
}

function getISOString(date: number | null) {
  return date ? new Date(date).toISOString() : undefined;
}

async function isSigningSecretValid(rawBody: string, signatureHeader: string) {
  const { webhooksSecret } = getLemonSqueezyEnv();

  const { hex: digest } = await createHmac({
    key: webhooksSecret,
    data: rawBody,
  });

  const signature = Buffer.from(signatureHeader, 'utf8');

  return timingSafeEqual(digest, signature);
}

function timingSafeEqual(digest: string, signature: Buffer) {
  return digest.toString() === signature.toString();
}

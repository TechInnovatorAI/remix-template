import Stripe from 'stripe';

import { BillingConfig, getLineItemTypeById } from '@kit/billing';
import { UpsertSubscriptionParams } from '@kit/billing/types';

/**
 * @name createStripeSubscriptionPayloadBuilderService
 * @description Create a new instance of the `StripeSubscriptionPayloadBuilderService` class
 */
export function createStripeSubscriptionPayloadBuilderService() {
  return new StripeSubscriptionPayloadBuilderService();
}

/**
 * @name StripeSubscriptionPayloadBuilderService
 * @description This class is used to build the subscription payload for Stripe
 */
class StripeSubscriptionPayloadBuilderService {
  private config?: BillingConfig;

  /**
   * @name withBillingConfig
   * @description Set the billing config for the subscription payload
   * @param config
   */
  withBillingConfig(config: BillingConfig) {
    this.config = config;

    return this;
  }

  /**
   * @name build
   * @description Build the subscription payload for Stripe
   * @param params
   */
  build<
    LineItem extends {
      id: string;
      quantity?: number;
      price?: Stripe.Price;
    },
  >(params: {
    id: string;
    accountId: string;
    customerId: string;
    lineItems: LineItem[];
    status: Stripe.Subscription.Status;
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
      const variantId = item.price?.id as string;

      return {
        id: item.id,
        quantity,
        subscription_id: params.id,
        subscription_item_id: item.id,
        product_id: item.price?.product as string,
        variant_id: variantId,
        price_amount: item.price?.unit_amount,
        interval: item.price?.recurring?.interval as string,
        interval_count: item.price?.recurring?.interval_count as number,
        type: this.config
          ? getLineItemTypeById(this.config, variantId)
          : undefined,
      };
    });

    // otherwise we are updating a subscription
    // and we only need to return the update payload
    return {
      target_subscription_id: params.id,
      target_account_id: params.accountId,
      target_customer_id: params.customerId,
      billing_provider: 'stripe',
      status: params.status,
      line_items: lineItems,
      active,
      currency: params.currency,
      cancel_at_period_end: params.cancelAtPeriodEnd ?? false,
      period_starts_at: getISOString(params.periodStartsAt) as string,
      period_ends_at: getISOString(params.periodEndsAt) as string,
      trial_starts_at: getISOString(params.trialStartsAt),
      trial_ends_at: getISOString(params.trialEndsAt),
    };
  }
}

function getISOString(date: number | null) {
  return date ? new Date(date * 1000).toISOString() : undefined;
}

import {
  cancelSubscription,
  createUsageRecord,
  getCheckout,
  getSubscription,
  getVariant,
  listUsageRecords,
  updateSubscriptionItem,
} from '@lemonsqueezy/lemonsqueezy.js';
import { z } from 'zod';

import { BillingStrategyProviderService } from '@kit/billing';
import type {
  CancelSubscriptionParamsSchema,
  CreateBillingCheckoutSchema,
  CreateBillingPortalSessionSchema,
  QueryBillingUsageSchema,
  ReportBillingUsageSchema,
  RetrieveCheckoutSessionSchema,
  UpdateSubscriptionParamsSchema,
} from '@kit/billing/schema';
import { getLogger } from '@kit/shared/logger';

import { createLemonSqueezyBillingPortalSession } from './create-lemon-squeezy-billing-portal-session';
import { createLemonSqueezyCheckout } from './create-lemon-squeezy-checkout';
import { createLemonSqueezySubscriptionPayloadBuilderService } from './lemon-squeezy-subscription-payload-builder.service';

export class LemonSqueezyBillingStrategyService
  implements BillingStrategyProviderService
{
  private readonly namespace = 'billing.lemon-squeezy';

  /**
   * @name createCheckoutSession
   * @description Creates a checkout session for a customer
   * @param params
   */
  async createCheckoutSession(
    params: z.infer<typeof CreateBillingCheckoutSchema>,
  ) {
    const logger = await getLogger();

    const ctx = {
      name: this.namespace,
      ...params,
    };

    logger.info(ctx, 'Creating checkout session...');

    const { data: response, error } = await createLemonSqueezyCheckout(params);

    if (error ?? !response?.data.id) {
      console.log(error);

      logger.error(
        {
          ...ctx,
          error: error?.message,
        },
        'Failed to create checkout session',
      );

      throw new Error('Failed to create checkout session');
    }

    logger.info(ctx, 'Checkout session created successfully');

    return {
      checkoutToken: response.data.attributes.url,
    };
  }

  /**
   * @name createBillingPortalSession
   * @description Creates a billing portal session for a customer
   * @param params
   */
  async createBillingPortalSession(
    params: z.infer<typeof CreateBillingPortalSessionSchema>,
  ) {
    const logger = await getLogger();

    const ctx = {
      name: this.namespace,
      ...params,
    };

    logger.info(ctx, 'Creating billing portal session...');

    const { data, error } =
      await createLemonSqueezyBillingPortalSession(params);

    if (error ?? !data) {
      logger.error(
        {
          ...ctx,
          error: error?.message,
        },
        'Failed to create billing portal session',
      );

      throw new Error('Failed to create billing portal session');
    }

    logger.info(ctx, 'Billing portal session created successfully');

    return { url: data };
  }

  /**
   * @name cancelSubscription
   * @description Cancels a subscription
   * @param params
   */
  async cancelSubscription(
    params: z.infer<typeof CancelSubscriptionParamsSchema>,
  ) {
    const logger = await getLogger();

    const ctx = {
      name: this.namespace,
      subscriptionId: params.subscriptionId,
    };

    logger.info(ctx, 'Cancelling subscription...');

    try {
      const { error } = await cancelSubscription(params.subscriptionId);

      if (error) {
        logger.error(
          {
            ...ctx,
            error: error.message,
          },
          'Failed to cancel subscription',
        );

        throw new Error('Failed to cancel subscription');
      }

      logger.info(ctx, 'Subscription cancelled successfully');

      return {
        success: true,
      };
    } catch (error) {
      logger.info(
        {
          ...ctx,
          error: (error as Error)?.message,
        },
        `Failed to cancel subscription. It may have already been cancelled on the user's end.`,
      );

      return {
        success: false,
      };
    }
  }

  /**
   * @name retrieveCheckoutSession
   * @description Retrieves a checkout session
   * @param params
   */
  async retrieveCheckoutSession(
    params: z.infer<typeof RetrieveCheckoutSessionSchema>,
  ) {
    const logger = await getLogger();

    const ctx = {
      name: this.namespace,
      sessionId: params.sessionId,
    };

    logger.info(ctx, 'Retrieving checkout session...');

    const { data: session, error } = await getCheckout(params.sessionId);

    if (error ?? !session?.data) {
      logger.error(
        {
          ...ctx,
          error: error?.message,
        },
        'Failed to retrieve checkout session',
      );

      throw new Error('Failed to retrieve checkout session');
    }

    logger.info(ctx, 'Checkout session retrieved successfully');

    const { id, attributes } = session.data;

    return {
      checkoutToken: id,
      isSessionOpen: false,
      status: 'complete' as const,
      customer: {
        email: attributes.checkout_data.email,
      },
    };
  }

  /**
   * @name reportUsage
   * @description Reports the usage of the billing
   * @param params
   */
  async reportUsage(params: z.infer<typeof ReportBillingUsageSchema>) {
    const logger = await getLogger();

    const ctx = {
      name: this.namespace,
      subscriptionItemId: params.id,
    };

    logger.info(ctx, 'Reporting usage...');

    const { error } = await createUsageRecord({
      quantity: params.usage.quantity,
      subscriptionItemId: params.id,
      action: params.usage.action,
    });

    if (error) {
      logger.error(
        {
          ...ctx,
          error,
        },
        'Failed to report usage',
      );

      throw new Error('Failed to report usage');
    }

    logger.info(ctx, 'Usage reported successfully');

    return { success: true };
  }

  /**
   * @name queryUsage
   * @description Queries the usage of the metered billing
   * @param params
   */
  async queryUsage(
    params: z.infer<typeof QueryBillingUsageSchema>,
  ): Promise<{ value: number }> {
    const logger = await getLogger();

    const ctx = {
      name: this.namespace,
      ...params,
    };

    if (!('page' in params.filter)) {
      logger.error(ctx, `Page parameters are required for Lemon Squeezy`);

      throw new Error('Page is required');
    }

    logger.info(ctx, 'Querying usage...');

    const records = await listUsageRecords({
      filter: {
        subscriptionItemId: params.id,
      },
      page: params.filter,
    });

    if (records.error) {
      logger.error(
        {
          ...ctx,
          error: records.error,
        },
        'Failed to query usage',
      );

      throw new Error('Failed to query usage');
    }

    if (!records.data) {
      return {
        value: 0,
      };
    }

    const value = records.data.data.reduce(
      (acc, record) => acc + record.attributes.quantity,
      0,
    );

    logger.info(
      {
        ...ctx,
        value,
      },
      'Usage queried successfully',
    );

    return { value };
  }

  /**
   * @name queryUsage
   * @description Queries the usage of the metered billing
   * @param params
   */
  async updateSubscriptionItem(
    params: z.infer<typeof UpdateSubscriptionParamsSchema>,
  ) {
    const logger = await getLogger();

    const ctx = {
      name: this.namespace,
      ...params,
    };

    logger.info(ctx, 'Updating subscription...');

    const { error } = await updateSubscriptionItem(params.subscriptionItemId, {
      quantity: params.quantity,
    });

    if (error) {
      logger.error(
        {
          ...ctx,
          error,
        },
        'Failed to update subscription',
      );

      throw new Error('Failed to update subscription');
    }

    logger.info(ctx, 'Subscription updated successfully');

    return { success: true };
  }

  async getSubscription(subscriptionId: string) {
    const logger = await getLogger();

    const ctx = {
      name: this.namespace,
      subscriptionId,
    };

    logger.info(ctx, 'Retrieving subscription...');

    const { error, data } = await getSubscription(subscriptionId);

    if (error) {
      logger.error(
        {
          ...ctx,
          error,
        },
        'Failed to retrieve subscription',
      );

      throw new Error('Failed to retrieve subscription');
    }

    if (!data) {
      logger.error(
        {
          ...ctx,
        },
        'Subscription not found',
      );

      throw new Error('Subscription not found');
    }

    logger.info(ctx, 'Subscription retrieved successfully');

    const payloadBuilderService =
      createLemonSqueezySubscriptionPayloadBuilderService();

    const subscription = data.data.attributes;
    const customerId = subscription.customer_id.toString();
    const status = subscription.status;
    const variantId = subscription.variant_id;
    const productId = subscription.product_id;
    const createdAt = subscription.created_at;
    const endsAt = subscription.ends_at;
    const renewsAt = subscription.renews_at;
    const trialEndsAt = subscription.trial_ends_at;
    const intervalCount = subscription.billing_anchor;
    const interval = intervalCount === 1 ? 'month' : 'year';

    const subscriptionItemId =
      data.data.attributes.first_subscription_item?.id.toString() as string;

    const lineItems = [
      {
        id: subscriptionItemId.toString(),
        product: productId.toString(),
        variant: variantId.toString(),
        quantity: subscription.first_subscription_item?.quantity ?? 1,
        // not anywhere in the API
        priceAmount: 0,
      },
    ];

    return payloadBuilderService.build({
      customerId,
      id: subscriptionId,
      // not in the API
      accountId: '',
      lineItems,
      status,
      interval,
      intervalCount,
      // not in the API
      currency: '',
      periodStartsAt: new Date(createdAt).getTime(),
      periodEndsAt: new Date(renewsAt ?? endsAt).getTime(),
      cancelAtPeriodEnd: subscription.cancelled,
      trialStartsAt: trialEndsAt ? new Date(createdAt).getTime() : null,
      trialEndsAt: trialEndsAt ? new Date(trialEndsAt).getTime() : null,
    });
  }

  /**
   * @name queryUsage
   * @description Queries the usage of the metered billing
   * @param planId
   */
  async getPlanById(planId: string) {
    const logger = await getLogger();

    const ctx = {
      name: this.namespace,
      planId,
    };

    logger.info(ctx, 'Retrieving plan by ID...');

    const { error, data } = await getVariant(planId);

    if (error) {
      logger.error(
        {
          ...ctx,
          error,
        },
        'Failed to retrieve plan by ID',
      );

      throw new Error('Failed to retrieve plan by ID');
    }

    if (!data) {
      logger.error(
        {
          ...ctx,
        },
        'Plan not found',
      );

      throw new Error('Plan not found');
    }

    logger.info(ctx, 'Plan retrieved successfully');

    const attrs = data.data.attributes;

    return {
      id: data.data.id,
      name: attrs.name,
      interval: attrs.interval ?? '',
      amount: attrs.price,
    };
  }
}

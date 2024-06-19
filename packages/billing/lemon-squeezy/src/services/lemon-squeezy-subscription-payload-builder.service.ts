import { BillingConfig, getLineItemTypeById } from '@kit/billing';
import { UpsertSubscriptionParams } from '@kit/billing/types';

type SubscriptionStatus =
  | 'on_trial'
  | 'active'
  | 'cancelled'
  | 'paused'
  | 'expired'
  | 'unpaid'
  | 'past_due';

/**
 * @name createLemonSqueezySubscriptionPayloadBuilderService
 * @description Create a new instance of the `LemonSqueezySubscriptionPayloadBuilderService` class
 */
export function createLemonSqueezySubscriptionPayloadBuilderService() {
  return new LemonSqueezySubscriptionPayloadBuilderService();
}

/**
 * @name LemonSqueezySubscriptionPayloadBuilderService
 * @description This class is used to build the subscription payload for Lemon Squeezy
 */
class LemonSqueezySubscriptionPayloadBuilderService {
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
   * @description Build the subscription payload for Lemon Squeezy
   * @param params
   */
  build<
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
    const canceledAtPeriodEnd =
      params.status === 'cancelled' && params.cancelAtPeriodEnd;

    const active =
      params.status === 'active' ||
      params.status === 'trialing' ||
      canceledAtPeriodEnd;

    const lineItems = params.lineItems.map((item) => {
      const quantity = item.quantity ?? 1;

      return {
        id: item.id,
        subscription_item_id: item.id,
        quantity,
        interval: params.interval,
        interval_count: params.intervalCount,
        subscription_id: params.id,
        product_id: item.product,
        variant_id: item.variant,
        price_amount: item.priceAmount,
        type: this.config
          ? getLineItemTypeById(this.config, item.variant)
          : undefined,
      };
    });

    // otherwise we are updating a subscription
    // and we only need to return the update payload
    return {
      target_subscription_id: params.id,
      target_account_id: params.accountId,
      target_customer_id: params.customerId,
      billing_provider: 'lemon-squeezy',
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

import { Tables } from '@kit/supabase/database';

import { createBillingGatewayService } from '../billing-gateway/billing-gateway.service';

type Subscription = Tables<'subscriptions'>;

export function createBillingWebhooksService() {
  return new BillingWebhooksService();
}

/**
 * @name BillingWebhooksService
 * @description Service for handling billing webhooks.
 */
class BillingWebhooksService {
  /**
   * @name handleSubscriptionDeletedWebhook
   * @description Handles the webhook for when a subscription is deleted.
   * @param subscription
   */
  async handleSubscriptionDeletedWebhook(subscription: Subscription) {
    const gateway = createBillingGatewayService(subscription.billing_provider);

    const subscriptionData = await gateway.getSubscription(subscription.id);
    const isCanceled = subscriptionData.status === 'canceled';

    if (isCanceled) {
      return;
    }

    return gateway.cancelSubscription({
      subscriptionId: subscription.id,
    });
  }
}

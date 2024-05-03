import { SupabaseClient } from '@supabase/supabase-js';

import { createBillingGatewayService } from '@kit/billing-gateway';
import { getLogger } from '@kit/shared/logger';
import { Database } from '@kit/supabase/database';

export function createAccountPerSeatBillingService(
  client: SupabaseClient<Database>,
) {
  return new AccountPerSeatBillingService(client);
}

/**
 * @name AccountPerSeatBillingService
 * @description Service for managing per-seat billing for accounts.
 */
class AccountPerSeatBillingService {
  private readonly namespace = 'accounts.per-seat-billing';

  constructor(private readonly client: SupabaseClient<Database>) {}

  /**
   * @name getPerSeatSubscriptionItem
   * @description Retrieves the per-seat subscription item for an account.
   * @param accountId
   */
  async getPerSeatSubscriptionItem(accountId: string) {
    const logger = await getLogger();
    const ctx = { accountId, name: this.namespace };

    logger.info(
      ctx,
      `Retrieving per-seat subscription item for account ${accountId}...`,
    );

    const { data, error } = await this.client
      .from('subscriptions')
      .select(
        `
          provider: billing_provider,
          id,
          subscription_items !inner (
            quantity,
            id,
            type
          )
        `,
      )
      .eq('account_id', accountId)
      .eq('subscription_items.type', 'per_seat')
      .maybeSingle();

    if (error) {
      logger.error(
        {
          ...ctx,
          error,
        },
        `Failed to get per-seat subscription item for account ${accountId}`,
      );

      throw error;
    }

    if (!data?.subscription_items) {
      logger.info(
        ctx,
        `Account is not subscribed to a per-seat subscription. Exiting...`,
      );

      return;
    }

    logger.info(
      ctx,
      `Per-seat subscription item found for account ${accountId}. Will update...`,
    );

    return data;
  }

  /**
   * @name increaseSeats
   * @description Increases the number of seats for an account.
   * @param accountId
   */
  async increaseSeats(accountId: string) {
    const logger = await getLogger();
    const subscription = await this.getPerSeatSubscriptionItem(accountId);

    if (!subscription) {
      return;
    }

    const subscriptionItems = subscription.subscription_items.filter((item) => {
      return item.type === 'per_seat';
    });

    if (!subscriptionItems.length) {
      return;
    }

    const billingGateway = createBillingGatewayService(subscription.provider);

    const ctx = {
      name: this.namespace,
      accountId,
      subscriptionItems,
    };

    logger.info(ctx, `Increasing seats for account ${accountId}...`);

    const promises = subscriptionItems.map(async (item) => {
      try {
        logger.info(
          {
            name: this.namespace,
            accountId,
            subscriptionItemId: item.id,
            quantity: item.quantity + 1,
          },
          `Updating subscription item...`,
        );

        await billingGateway.updateSubscriptionItem({
          subscriptionId: subscription.id,
          subscriptionItemId: item.id,
          quantity: item.quantity + 1,
        });

        logger.info(
          {
            name: this.namespace,
            accountId,
            subscriptionItemId: item.id,
            quantity: item.quantity + 1,
          },
          `Subscription item updated successfully`,
        );
      } catch (error) {
        logger.error(
          {
            ...ctx,
            error,
          },
          `Failed to increase seats for account ${accountId}`,
        );
      }
    });

    await Promise.all(promises);
  }

  /**
   * @name decreaseSeats
   * @description Decreases the number of seats for an account.
   * @param accountId
   */
  async decreaseSeats(accountId: string) {
    const logger = await getLogger();
    const subscription = await this.getPerSeatSubscriptionItem(accountId);

    if (!subscription) {
      return;
    }

    const subscriptionItems = subscription.subscription_items.filter((item) => {
      return item.type === 'per_seat';
    });

    if (!subscriptionItems.length) {
      return;
    }

    const ctx = {
      name: this.namespace,
      accountId,
      subscriptionItems,
    };

    logger.info(ctx, `Decreasing seats for account ${accountId}...`);

    const billingGateway = createBillingGatewayService(subscription.provider);

    const promises = subscriptionItems.map(async (item) => {
      try {
        logger.info(
          {
            name: this.namespace,
            accountId,
            subscriptionItemId: item.id,
            quantity: item.quantity - 1,
          },
          `Updating subscription item...`,
        );

        await billingGateway.updateSubscriptionItem({
          subscriptionId: subscription.id,
          subscriptionItemId: item.id,
          quantity: item.quantity - 1,
        });

        logger.info(
          {
            name: this.namespace,
            accountId,
            subscriptionItemId: item.id,
            quantity: item.quantity - 1,
          },
          `Subscription item updated successfully`,
        );
      } catch (error) {
        logger.error(
          {
            ...ctx,
            error,
          },
          `Failed to decrease seats for account ${accountId}`,
        );
      }
    });

    await Promise.all(promises);
  }
}

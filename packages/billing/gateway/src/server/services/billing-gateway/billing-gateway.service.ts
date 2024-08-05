import { z } from 'zod';

import type { BillingProviderSchema } from '@kit/billing';
import {
  CancelSubscriptionParamsSchema,
  CreateBillingCheckoutSchema,
  CreateBillingPortalSessionSchema,
  QueryBillingUsageSchema,
  ReportBillingUsageSchema,
  RetrieveCheckoutSessionSchema,
  UpdateSubscriptionParamsSchema,
} from '@kit/billing/schema';

import { BillingGatewayFactoryService } from './billing-gateway-factory.service';

export function createBillingGatewayService(
  provider: z.infer<typeof BillingProviderSchema>,
) {
  return new BillingGatewayService(provider);
}

/**
 * @description The billing gateway service to interact with the billing provider of choice (e.g. Stripe)
 * @class BillingGatewayService
 * @param {BillingProvider} provider - The billing provider to use
 * @example
 *
 * const provider = 'stripe';
 * const billingGatewayService = new BillingGatewayService(provider);
 */
class BillingGatewayService {
  constructor(
    private readonly provider: z.infer<typeof BillingProviderSchema>,
  ) {}

  /**
   * Creates a checkout session for billing.
   *
   * @param {CreateBillingCheckoutSchema} params - The parameters for creating the checkout session.
   *
   */
  async createCheckoutSession(
    params: z.infer<typeof CreateBillingCheckoutSchema>,
  ) {
    const strategy = await this.getStrategy();
    const payload = CreateBillingCheckoutSchema.parse(params);

    return strategy.createCheckoutSession(payload);
  }

  /**
   * Retrieves the checkout session from the specified provider.
   *
   * @param {RetrieveCheckoutSessionSchema} params - The parameters to retrieve the checkout session.
   */
  async retrieveCheckoutSession(
    params: z.infer<typeof RetrieveCheckoutSessionSchema>,
  ) {
    const strategy = await this.getStrategy();
    const payload = RetrieveCheckoutSessionSchema.parse(params);

    return strategy.retrieveCheckoutSession(payload);
  }

  /**
   * Creates a billing portal session for the specified parameters.
   *
   * @param {CreateBillingPortalSessionSchema} params - The parameters to create the billing portal session.
   */
  async createBillingPortalSession(
    params: z.infer<typeof CreateBillingPortalSessionSchema>,
  ) {
    const strategy = await this.getStrategy();
    const payload = CreateBillingPortalSessionSchema.parse(params);

    return strategy.createBillingPortalSession(payload);
  }

  /**
   * Cancels a subscription.
   *
   * @param {CancelSubscriptionParamsSchema} params - The parameters for cancelling the subscription.
   */
  async cancelSubscription(
    params: z.infer<typeof CancelSubscriptionParamsSchema>,
  ) {
    const strategy = await this.getStrategy();
    const payload = CancelSubscriptionParamsSchema.parse(params);

    return strategy.cancelSubscription(payload);
  }

  /**
   * Reports the usage of the billing.
   * @description This is used to report the usage of the billing to the provider.
   * @param params
   */
  async reportUsage(params: z.infer<typeof ReportBillingUsageSchema>) {
    const strategy = await this.getStrategy();
    const payload = ReportBillingUsageSchema.parse(params);

    return strategy.reportUsage(payload);
  }

  /**
   * @name queryUsage
   * @description Queries the usage of the metered billing.
   * @param params
   */
  async queryUsage(params: z.infer<typeof QueryBillingUsageSchema>) {
    const strategy = await this.getStrategy();
    const payload = QueryBillingUsageSchema.parse(params);

    return strategy.queryUsage(payload);
  }

  /**
   * Updates a subscription with the specified parameters.
   * @param params
   */
  async updateSubscriptionItem(
    params: z.infer<typeof UpdateSubscriptionParamsSchema>,
  ) {
    const strategy = await this.getStrategy();
    const payload = UpdateSubscriptionParamsSchema.parse(params);

    return strategy.updateSubscriptionItem(payload);
  }

  /**
   * Retrieves a subscription from the provider.
   * @param subscriptionId
   */
  async getSubscription(subscriptionId: string) {
    const strategy = await this.getStrategy();

    return strategy.getSubscription(subscriptionId);
  }

  private getStrategy() {
    return BillingGatewayFactoryService.GetProviderStrategy(this.provider);
  }
}

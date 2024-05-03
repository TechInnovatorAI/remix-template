import { z } from 'zod';

import {
  CancelSubscriptionParamsSchema,
  CreateBillingCheckoutSchema,
  CreateBillingPortalSessionSchema,
  QueryBillingUsageSchema,
  ReportBillingUsageSchema,
  RetrieveCheckoutSessionSchema,
  UpdateSubscriptionParamsSchema,
} from '../schema';

export abstract class BillingStrategyProviderService {
  abstract createBillingPortalSession(
    params: z.infer<typeof CreateBillingPortalSessionSchema>,
  ): Promise<{
    url: string;
  }>;

  abstract retrieveCheckoutSession(
    params: z.infer<typeof RetrieveCheckoutSessionSchema>,
  ): Promise<{
    checkoutToken: string | null;
    status: 'complete' | 'expired' | 'open';
    isSessionOpen: boolean;

    customer: {
      email: string | null;
    };
  }>;

  abstract createCheckoutSession(
    params: z.infer<typeof CreateBillingCheckoutSchema>,
  ): Promise<{
    checkoutToken: string;
  }>;

  abstract cancelSubscription(
    params: z.infer<typeof CancelSubscriptionParamsSchema>,
  ): Promise<{
    success: boolean;
  }>;

  abstract reportUsage(
    params: z.infer<typeof ReportBillingUsageSchema>,
  ): Promise<{
    success: boolean;
  }>;

  abstract queryUsage(
    params: z.infer<typeof QueryBillingUsageSchema>,
  ): Promise<{
    value: number;
  }>;

  abstract updateSubscriptionItem(
    params: z.infer<typeof UpdateSubscriptionParamsSchema>,
  ): Promise<{
    success: boolean;
  }>;

  abstract getPlanById(planId: string): Promise<{
    id: string;
    name: string;
    interval: string;
    amount: number;
  }>;
}

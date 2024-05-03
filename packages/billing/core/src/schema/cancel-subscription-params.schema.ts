import { z } from 'zod';

export const CancelSubscriptionParamsSchema = z.object({
  subscriptionId: z.string(),
  invoiceNow: z.boolean().optional(),
});

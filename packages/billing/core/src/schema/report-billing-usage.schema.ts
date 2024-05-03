import { z } from 'zod';

export const ReportBillingUsageSchema = z.object({
  id: z.string({
    description:
      'The id of the usage record. For Stripe a customer ID, for LS a subscription item ID.',
  }),
  eventName: z
    .string({
      description: 'The name of the event that triggered the usage',
    })
    .optional(),
  usage: z.object({
    quantity: z.number(),
    action: z.enum(['increment', 'set']).optional(),
  }),
});

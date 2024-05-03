import { z } from 'zod';

export const CreateBillingPortalSessionSchema = z.object({
  returnUrl: z.string().url(),
  customerId: z.string().min(1),
});

import { z } from 'zod';

export const PersonalAccountCheckoutSchema = z.object({
  planId: z.string().min(1),
  productId: z.string().min(1),
});

import { z } from 'zod';

export const StripeClientEnvSchema = z
  .object({
    publishableKey: z.string().min(1),
  })
  .refine(
    (schema) => {
      return schema.publishableKey.startsWith('pk_');
    },
    {
      path: ['publishableKey'],
      message: `Stripe publishable key must start with 'pk_'`,
    },
  );

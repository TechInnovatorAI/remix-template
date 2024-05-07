import { z } from 'zod';

import { CsrfTokenSchema } from '@kit/csrf/schema';

export const TeamBillingPortalSchema = CsrfTokenSchema.extend({
  accountId: z.string().uuid(),
  slug: z.string().min(1),
});

export const TeamCheckoutSchema = CsrfTokenSchema.extend({
  slug: z.string().min(1),
  productId: z.string().min(1),
  planId: z.string().min(1),
  accountId: z.string().uuid(),
});

import { z } from 'zod';

import { CsrfTokenSchema } from '@kit/csrf/schema';

export const PersonalAccountCheckoutSchema = CsrfTokenSchema.extend({
  planId: z.string().min(1),
  productId: z.string().min(1),
});

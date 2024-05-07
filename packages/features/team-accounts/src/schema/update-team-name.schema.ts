import { z } from 'zod';

import { CsrfTokenSchema } from '@kit/csrf/schema';

export const TeamNameFormSchema = CsrfTokenSchema.extend({
  name: z.string().min(1).max(255),
});

export const UpdateTeamNameSchema = z.object({
  intent: z.literal('update-team-name'),
  payload: CsrfTokenSchema.extend({
    slug: z.string().min(1).max(255),
    path: z.string().min(1).max(255),
    name: z.string().min(1).max(255),
  }),
});

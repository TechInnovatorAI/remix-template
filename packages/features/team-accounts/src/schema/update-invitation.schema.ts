import { z } from 'zod';

import { CsrfTokenSchema } from '@kit/csrf/schema';

export const UpdateInvitationSchema = z.object({
  payload: CsrfTokenSchema.extend({
    invitationId: z.number(),
    role: z.string().min(1),
  }),
  intent: z.literal('update-invitation'),
});

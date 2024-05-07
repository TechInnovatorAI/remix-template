import { z } from 'zod';

import { CsrfTokenSchema } from '@kit/csrf/schema';

export const DeleteInvitationSchema = z.object({
  intent: z.literal('delete-invitation'),
  payload: CsrfTokenSchema.extend({
    invitationId: z.number().int(),
  }),
});

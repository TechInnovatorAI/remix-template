import { z } from 'zod';

import { CsrfTokenSchema } from '@kit/csrf/schema';

export const AcceptInvitationSchema = CsrfTokenSchema.extend({
  inviteToken: z.string().uuid(),
  nextPath: z.string().min(1),
});

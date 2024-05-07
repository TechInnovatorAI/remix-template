import { z } from 'zod';

import { CsrfTokenSchema } from '@kit/csrf/schema';

export const LeaveTeamAccountSchema = z.object({
  intent: z.literal('leave-team'),
  payload: CsrfTokenSchema.extend({
    accountId: z.string().uuid(),
    confirmation: z.custom((value) => value === 'LEAVE'),
  }),
});

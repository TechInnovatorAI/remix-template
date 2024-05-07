import { z } from 'zod';

import { CsrfTokenSchema } from '@kit/csrf/schema';

export const DeleteTeamAccountSchema = z.object({
  payload: CsrfTokenSchema.extend({
    accountId: z.string().uuid(),
  }),
  intent: z.literal('delete-team-account'),
});

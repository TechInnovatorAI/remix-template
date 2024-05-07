import { z } from 'zod';

import { CsrfTokenSchema } from '@kit/csrf/schema';

export const CreateTeamSchema = CsrfTokenSchema.extend({
  name: z.string().min(2).max(50),
});

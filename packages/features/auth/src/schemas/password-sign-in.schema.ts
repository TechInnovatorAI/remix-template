import { z } from 'zod';

import { PasswordSchema } from './password.schema';

export const PasswordSignInSchema = z.object({
  email: z.string().email(),
  password: PasswordSchema,
});

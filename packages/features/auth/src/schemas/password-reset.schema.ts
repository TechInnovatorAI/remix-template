import { z } from 'zod';

import { RefinedPasswordSchema, refineRepeatPassword } from './password.schema';

export const PasswordResetSchema = z
  .object({
    password: RefinedPasswordSchema,
    repeatPassword: RefinedPasswordSchema,
  })
  .superRefine(refineRepeatPassword);

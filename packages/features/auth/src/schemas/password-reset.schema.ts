import { z } from 'zod';

import { PasswordSchema } from './password.schema';

export const PasswordResetSchema = z
  .object({
    password: PasswordSchema,
    repeatPassword: PasswordSchema,
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: 'auth:errors.passwordsDoNotMatch',
    path: ['repeatPassword'],
  });

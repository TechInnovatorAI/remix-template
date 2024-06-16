import { z } from 'zod';

import { PasswordSchema } from './password.schema';

export const PasswordSignUpSchema = z
  .object({
    email: z.string().email(),
    password: PasswordSchema,
    repeatPassword: PasswordSchema,
  })
  .refine(
    (schema) => {
      return schema.password === schema.repeatPassword;
    },
    {
      message: 'auth:errors.passwordsDoNotMatch',
      path: ['repeatPassword'],
    },
  );

import { z } from 'zod';

export const PasswordSignUpSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8).max(99),
    repeatPassword: z.string().min(8).max(99),
  })
  .refine(
    (schema) => {
      return schema.password === schema.repeatPassword;
    },
    {
      message: 'Passwords do not match',
      path: ['repeatPassword'],
    },
  );

import { z } from 'zod';

export const PasswordResetSchema = z
  .object({
    password: z.string().min(8).max(99),
    repeatPassword: z.string().min(8).max(99),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: 'Passwords do not match',
    path: ['repeatPassword'],
  });

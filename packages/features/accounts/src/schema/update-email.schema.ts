import { z } from 'zod';

export const UpdateEmailSchema = {
  withTranslation: (errorMessage: string) => {
    return z
      .object({
        email: z.string().email(),
        repeatEmail: z.string().email(),
      })
      .refine(
        (values) => {
          return values.email === values.repeatEmail;
        },
        {
          path: ['repeatEmail'],
          message: errorMessage,
        },
      );
  },
};

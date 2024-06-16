import { z } from 'zod';

/**
 * Password requirements
 */
const requirements = {
  minLength: 8,
  maxLength: 99,
  specialChars: false,
  numbers: false,
  uppercase: false,
};

export const PasswordSchema = z
  .string()
  .min(requirements.minLength)
  .max(requirements.maxLength)
  .superRefine((val, ctx) => validatePassword(val, ctx));

function validatePassword(password: string, ctx: z.RefinementCtx) {
  if (requirements.specialChars) {
    const specialCharsCount =
      password.match(/[!@#$%^&*(),.?":{}|<>]/g)?.length ?? 0;

    if (specialCharsCount < 1) {
      ctx.addIssue({
        message: 'auth:errors.minPasswordSpecialChars',
        code: 'custom',
      });
    }
  }

  if (requirements.numbers) {
    const numbersCount = password.match(/\d/g)?.length ?? 0;

    if (numbersCount < 1) {
      ctx.addIssue({
        message: 'auth:errors.minPasswordNumbers',
        code: 'custom',
      });
    }
  }

  if (requirements.uppercase) {
    if (!/[A-Z]/.test(password)) {
      ctx.addIssue({
        message: 'auth:errors.uppercasePassword',
        code: 'custom',
      });
    }
  }

  return true;
}

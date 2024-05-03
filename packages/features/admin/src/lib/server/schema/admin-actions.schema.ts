import { z } from 'zod';

const ConfirmationSchema = z.object({
  confirmation: z.custom<string>((value) => value === 'CONFIRM'),
});

const UserIdSchema = ConfirmationSchema.extend({
  userId: z.string().uuid(),
});

export const BanUserSchema = UserIdSchema;
export const ReactivateUserSchema = UserIdSchema;
export const ImpersonateUserSchema = UserIdSchema;
export const DeleteUserSchema = UserIdSchema;

export const DeleteAccountForm = ConfirmationSchema.extend({
  accountId: z.string().uuid(),
});

export const DeleteAccountSchema = z.object({
  intent: z.literal('delete-team-account'),
  payload: DeleteAccountForm,
});

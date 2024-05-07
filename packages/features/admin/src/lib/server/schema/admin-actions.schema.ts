import { z } from 'zod';

import { CsrfTokenSchema } from '@kit/csrf/schema';

const ConfirmationSchema = CsrfTokenSchema.extend({
  confirmation: z.custom<string>((value) => value === 'CONFIRM'),
});

const UserIdSchema = ConfirmationSchema.extend({
  userId: z.string().uuid(),
});

export const BanUserSchema = z.object({
  intent: z.literal('ban-user'),
  payload: UserIdSchema,
});

export const ReactivateUserSchema = z.object({
  intent: z.literal('reactivate-user'),
  payload: UserIdSchema,
});

export const ImpersonateUserSchema = z.object({
  intent: z.literal('impersonate-user'),
  payload: UserIdSchema,
});

export const DeleteUserSchema = z.object({
  intent: z.literal('delete-user'),
  payload: UserIdSchema,
});

export const DeleteAccountForm = ConfirmationSchema.extend({
  accountId: z.string().uuid(),
});

export const DeleteAccountSchema = z.object({
  intent: z.literal('delete-team-account'),
  payload: DeleteAccountForm,
});

export const AdminActionsSchema = z.union([
  BanUserSchema,
  ReactivateUserSchema,
  ImpersonateUserSchema,
  DeleteUserSchema,
  DeleteAccountSchema,
]);

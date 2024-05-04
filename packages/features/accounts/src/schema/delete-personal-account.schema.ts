import { z } from 'zod';

export const DeleteAccountFormSchema = z.object({
  confirmation: z.string().refine((value) => value === 'DELETE'),
});

export const DeletePersonalAccountSchema = z.object({
  payload: DeleteAccountFormSchema,
  intent: z.literal('delete-account'),
});

import { z } from 'zod';

export const DeletePersonalAccountSchema = z.object({
  confirmation: z.string().refine((value) => value === 'DELETE'),
  intent: z.literal('delete-account'),
});

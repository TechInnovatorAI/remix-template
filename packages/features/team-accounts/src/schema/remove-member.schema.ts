import { z } from 'zod';

export const RemoveMemberSchema = z.object({
  payload: z.object({
    accountId: z.string().uuid(),
    userId: z.string().uuid(),
  }),
  intent: z.literal('remove-member'),
});

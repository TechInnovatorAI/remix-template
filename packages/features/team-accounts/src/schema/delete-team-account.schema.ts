import { z } from 'zod';

export const DeleteTeamAccountSchema = z.object({
  payload: z.object({
    accountId: z.string().uuid(),
  }),
  intent: z.literal('delete-team-account'),
});

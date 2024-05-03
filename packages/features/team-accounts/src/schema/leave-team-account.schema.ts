import { z } from 'zod';

export const LeaveTeamAccountSchema = z.object({
  intent: z.literal('leave-team'),
  payload: z.object({
    accountId: z.string().uuid(),
    confirmation: z.custom((value) => value === 'LEAVE'),
  }),
});

import { z } from 'zod';

export const UpdateInvitationSchema = z.object({
  payload: z.object({
    invitationId: z.number(),
    role: z.string().min(1),
  }),
  intent: z.literal('update-invitation'),
});

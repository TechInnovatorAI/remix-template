import { z } from 'zod';

export const DeleteInvitationSchema = z.object({
  intent: z.literal('delete-invitation'),
  payload: z.object({
    invitationId: z.number().int(),
  })
});

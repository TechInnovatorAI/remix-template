import { z } from 'zod';

export const RenewInvitationSchema = z.object({
  intent: z.literal('renew-invitation'),
  payload: z.object({
    invitationId: z.number().positive(),
  })
});

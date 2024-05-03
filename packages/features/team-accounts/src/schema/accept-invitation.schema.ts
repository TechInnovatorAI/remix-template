import { z } from 'zod';

export const AcceptInvitationSchema = z.object({
  inviteToken: z.string().uuid(),
  nextPath: z.string().min(1),
});

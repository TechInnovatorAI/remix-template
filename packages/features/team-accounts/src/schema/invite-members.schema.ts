import { z } from 'zod';

import { CsrfTokenSchema } from '@kit/csrf/schema';

const InviteSchema = z.object({
  email: z.string().email(),
  role: z.string().min(1).max(100),
});

export const InvitationsSchema = CsrfTokenSchema.extend({
  invitations: InviteSchema.array().min(1).max(5),
  accountSlug: z.string().min(1).max(255),
}).refine(
  (data) => {
    const emails = data.invitations.map((member) => member.email.toLowerCase());

    const uniqueEmails = new Set(emails);

    return emails.length === uniqueEmails.size;
  },
  {
    message: 'Duplicate emails are not allowed',
    path: ['invitations'],
  },
);

export const InviteMembersSchema = z.object({
  intent: z.literal('create-invitations'),
  payload: InvitationsSchema,
});

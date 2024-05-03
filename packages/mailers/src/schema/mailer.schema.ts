import { z } from 'zod';

export const MailerSchema = z
  .object({
    to: z.string().email(),
    // this is not necessarily formatted
    // as an email so we type it loosely
    from: z.string().min(1),
    subject: z.string(),
  })
  .and(
    z.union([
      z.object({
        text: z.string(),
      }),
      z.object({
        html: z.string(),
      }),
    ]),
  );

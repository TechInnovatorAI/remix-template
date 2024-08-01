import Email from 'vercel-email';
import { z } from 'zod';

import { Mailer } from '../../mailer';
import type { MailerSchema } from '../../schema/mailer.schema';

type Config = z.infer<typeof MailerSchema>;

/**
 * A class representing a mailer using Cloudflare's Workers thanks to the 'vercel-email' package.
 * @implements {Mailer}
 */
export class CloudflareMailer implements Mailer {
  async sendEmail(config: Config) {
    const schema = {
      to: config.to,
      from: config.from,
      subject: config.subject,
    };

    const content =
      'text' in config ? { text: config.text } : { html: config.html };

    return Email.send({
      ...schema,
      ...content,
    });
  }
}

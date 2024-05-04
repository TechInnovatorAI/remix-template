import { z } from 'zod';

import { Mailer } from '../../mailer';
import { MailerSchema } from '../../schema/mailer.schema';

type Config = z.infer<typeof MailerSchema>;

const RESEND_API_KEY = z
  .string({
    description: 'The API key for the Resend API',
    required_error: 'Please provide the API key for the Resend API',
  })
  .parse(process.env.RESEND_API_KEY);

/**
 * A class representing a mailer using the Resend HTTP API.
 * @implements {Mailer}
 */
export class ResendMailer implements Mailer {
  async sendEmail(config: Config) {
    const contentObject =
      'text' in config
        ? {
            text: config.text,
          }
        : {
            html: config.html,
          };

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: config.from,
        to: [config.to],
        subject: config.subject,
        ...contentObject,
      }),
    });

    if (!res.ok) {
      throw new Error(`Failed to send email: ${res.statusText}`);
    }
  }
}

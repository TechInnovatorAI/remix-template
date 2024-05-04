import { z } from 'zod';

import { Mailer } from '../../mailer';
import { MailerSchema } from '../../schema/mailer.schema';
import { getSMTPConfiguration } from '../../smtp-configuration';

type Config = z.infer<typeof MailerSchema>;

/**
 * A class representing a mailer using Nodemailer library.
 * @implements {Mailer}
 */
export class Nodemailer implements Mailer {
  async sendEmail(config: Config) {
    const { createTransport } = await import('nodemailer');
    const transporter = createTransport(getSMTPConfiguration());

    return transporter.sendMail(config);
  }
}

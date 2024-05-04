import { z } from 'zod';

export const SmtpConfigSchema = z.object({
  user: z.string({
    description:
      'This is the email account to send emails from. This is specific to the email provider.',
    required_error: `Please provide the variable EMAIL_USER`,
  }),
  pass: z.string({
    description: 'This is the password for the email account',
    required_error: `Please provide the variable EMAIL_PASSWORD`,
  }),
  host: z.string({
    description: 'This is the SMTP host for the email provider',
    required_error: `Please provide the variable EMAIL_HOST`,
  }),
  port: z.number({
    description:
      'This is the port for the email provider. Normally 587 or 465.',
    required_error: `Please provide the variable EMAIL_PORT`,
  }),
  secure: z.boolean({
    description: 'This is whether the connection is secure or not',
    required_error: `Please provide the variable EMAIL_TLS`,
  }),
});

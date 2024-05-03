import { SmtpConfigSchema } from './schema/smtp-config.schema';

export function getSMTPConfiguration() {
  const data = SmtpConfigSchema.parse({
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: process.env.EMAIL_TLS !== 'false',
  });

  return {
    host: data.host,
    port: data.port,
    secure: data.secure,
    auth: {
      user: data.user,
      pass: data.pass,
    },
  };
}

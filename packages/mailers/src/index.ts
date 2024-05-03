import { z } from 'zod';

const MAILER_PROVIDER = z
  .enum(['nodemailer', 'cloudflare', 'resend'])
  .default('nodemailer')
  .parse(process.env.MAILER_PROVIDER);

/**
 * @description Get the mailer based on the environment variable.
 */
export async function getMailer() {
  switch (MAILER_PROVIDER) {
    case 'nodemailer':
      return getNodemailer();

    case 'cloudflare':
      return getCloudflareMailer();

    case 'resend':
      return getResendMailer();

    default:
      throw new Error(`Invalid mailer: ${MAILER_PROVIDER as string}`);
  }
}

async function getNodemailer() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { Nodemailer } = await import('./impl/nodemailer');

    return new Nodemailer();
  } else {
    throw new Error(
      'Nodemailer is not available on the edge runtime. Please use another mailer.',
    );
  }
}

async function getCloudflareMailer() {
  const { CloudflareMailer } = await import('./impl/cloudflare');

  return new CloudflareMailer();
}

async function getResendMailer() {
  const { ResendMailer } = await import('./impl/resend');

  return new ResendMailer();
}

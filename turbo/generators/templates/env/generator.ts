import type { PlopTypes } from '@turbo/gen';
import { writeFileSync } from 'node:fs';

export function createEnvironmentVariablesGenerator(
  plop: PlopTypes.NodePlopAPI,
) {
  return plop.setGenerator('env', {
    description: 'Generate the environment variables to be used in the app',
    actions: [
      async (answers) => {
        let env = '';

        for (const [key, value] of Object.entries(
          (
            answers as {
              values: Record<string, string>;
            }
          ).values,
        )) {
          env += `${key}=${value}\n`;
        }

        writeFileSync('turbo/generators/templates/env/.env', env);

        return 'Environment variables generated at /turbo/generators/templates/env/.env.\nPlease double check and use this file in your hosting provider to set the environment variables. \nNever commit this file, it contains secrets!';
      },
    ],
    prompts: [
      {
        type: 'input',
        name: 'values.VITE_SITE_URL',
        message:
          'What is the site URL of you website? (Ex. https://makerkit.dev)',
      },
      {
        type: 'input',
        name: 'values.VITE_PRODUCT_NAME',
        message: 'What is the name of your product? (Ex. MakerKit)',
      },
      {
        type: 'input',
        name: 'values.VITE_SITE_TITLE',
        message:
          'What is the title of your website? (Ex. MakerKit - The best way to make things)',
      },
      {
        type: 'input',
        name: 'values.VITE_SITE_DESCRIPTION',
        message:
          'What is the description of your website? (Ex. MakerKit is the best way to make things and stuff)',
      },
      {
        type: 'list',
        name: 'values.VITE_DEFAULT_THEME_MODE',
        message: 'What is the default theme mode of your website?',
        choices: ['light', 'dark', 'system'],
      },
      {
        type: 'input',
        name: 'values.VITE_DEFAULT_LOCALE',
        message: 'What is the default locale of your website?',
      },
      {
        type: 'confirm',
        name: 'values.VITE_AUTH_PASSWORD',
        message: 'Do you want to use email/password authentication?',
      },
      {
        type: 'confirm',
        name: 'values.VITE_AUTH_MAGIC_LINK',
        message: 'Do you want to use magic link authentication?',
      },
      {
        type: 'input',
        name: 'values.CONTACT_EMAIL',
        message: 'What is the contact email you want to receive emails to?',
      },
      {
        type: 'confirm',
        name: 'values.VITE_ENABLE_THEME_TOGGLE',
        message: 'Do you want to enable the theme toggle?',
      },
      {
        type: 'confirm',
        name: 'values.VITE_ENABLE_PERSONAL_ACCOUNT_DELETION',
        message: 'Do you want to enable personal account deletion?',
      },
      {
        type: 'confirm',
        name: 'values.VITE_ENABLE_PERSONAL_ACCOUNT_BILLING',
        message: 'Do you want to enable personal account billing?',
      },
      {
        type: 'confirm',
        name: 'values.VITE_ENABLE_TEAM_ACCOUNTS',
        message: 'Do you want to enable team accounts?',
      },
      {
        type: 'confirm',
        name: 'values.VITE_ENABLE_TEAM_ACCOUNT_DELETION',
        message: 'Do you want to enable team account deletion?',
      },
      {
        type: 'confirm',
        name: 'values.VITE_ENABLE_TEAM_ACCOUNTS_BILLING',
        message: 'Do you want to enable team account billing?',
      },
      {
        type: 'confirm',
        name: 'values.VITE_ENABLE_TEAM_ACCOUNTS_CREATION',
        message: 'Do you want to enable team account creation?',
      },
      {
        type: 'confirm',
        name: 'values.VITE_ENABLE_NOTIFICATIONS',
        message:
          'Do you want to enable notifications? If not - we will hide the notifications bell from the UI.',
      },
      {
        when: (answers) => answers.values.VITE_ENABLE_NOTIFICATIONS,
        type: 'confirm',
        name: 'values.VITE_REALTIME_NOTIFICATIONS',
        message:
          'Do you want to enable realtime notifications? If yes, we will enable the realtime notifications from Supabase. If not - updated will be fetched lazily.',
      },
      {
        type: 'input',
        name: 'values.VITE_SUPABASE_URL',
        message: 'What is the Supabase URL? (Ex. https://yourapp.supabase.co)',
      },
      {
        type: 'input',
        name: 'values.VITE_SUPABASE_ANON_KEY',
        message: 'What is the Supabase anon key?',
      },
      {
        type: 'input',
        name: 'values.SUPABASE_SERVICE_ROLE_KEY',
        message: 'What is the Supabase Service Role Key?',
      },
      {
        type: 'list',
        name: 'values.VITE_BILLING_PROVIDER',
        message: 'What is the billing provider you want to use?',
        choices: ['stripe', 'lemon-squeezy'],
      },
      {
        when: (answers) => answers.values.VITE_BILLING_PROVIDER === 'stripe',
        type: 'input',
        name: 'values.VITE_STRIPE_PUBLISHABLE_KEY',
        message: 'What is the Stripe publishable key?',
      },
      {
        when: (answers) => answers.values.VITE_BILLING_PROVIDER === 'stripe',
        type: 'input',
        name: 'values.STRIPE_SECRET_KEY',
        message: 'What is the Stripe secret key?',
      },
      {
        when: (answers) => answers.values.VITE_BILLING_PROVIDER === 'stripe',
        type: 'input',
        name: 'values.STRIPE_WEBHOOK_SECRET',
        message: 'What is the Stripe webhook secret?',
      },
      {
        when: (answers) =>
          answers.values.VITE_BILLING_PROVIDER === 'lemon-squeezy',
        type: 'input',
        name: 'values.LEMON_SQUEEZY_SECRET_KEY',
        message: 'What is the Lemon Squeezy secret key?',
      },
      {
        when: (answers) =>
          answers.values.VITE_BILLING_PROVIDER === 'lemon-squeezy',
        type: 'input',
        name: 'values.LEMON_SQUEEZY_STORE_ID',
        message: 'What is the Lemon Squeezy store ID?',
      },
      {
        when: (answers) =>
          answers.values.VITE_BILLING_PROVIDER === 'lemon-squeezy',
        type: 'input',
        name: 'values.LEMON_SQUEEZY_SIGNING_SECRET',
        message: 'What is the Lemon Squeezy signing secret?',
      },
      {
        type: 'input',
        name: 'values.SUPABASE_DB_WEBHOOK_SECRET',
        message: 'What is the Supabase DB webhook secret?',
      },
      {
        type: 'list',
        name: 'values.VITE_CMS_CLIENT',
        message: 'What is the CMS client you want to use?',
        choices: ['keystatic', 'wordpress'],
        default: 'keystatic',
      },
      {
        type: 'list',
        name: 'values.MAILER_PROVIDER',
        message: 'What is the mailer provider you want to use?',
        choices: ['nodemailer', 'resend'],
        default: 'nodemailer',
      },
      {
        when: (answers) => answers.values.MAILER_PROVIDER === 'resend',
        type: 'input',
        name: 'values.RESEND_API_KEY',
        message: 'What is the Resend API key?',
      },
      {
        when: (answers) => answers.values.MAILER_PROVIDER === 'nodemailer',
        type: 'input',
        name: 'values.EMAIL_SENDER',
        message: 'What is the email sender? (ex. info@makerkit.dev)',
      },
      {
        when: (answers) => answers.values.MAILER_PROVIDER === 'nodemailer',
        type: 'input',
        name: 'values.EMAIL_HOST',
        message: 'What is the email host?',
      },
      {
        when: (answers) => answers.values.MAILER_PROVIDER === 'nodemailer',
        type: 'input',
        name: 'values.EMAIL_PORT',
        message: 'What is the email port?',
      },
      {
        when: (answers) => answers.values.MAILER_PROVIDER === 'nodemailer',
        type: 'input',
        name: 'values.EMAIL_USER',
        message: 'What is the email username? (check your email provider)',
      },
      {
        when: (answers) => answers.values.MAILER_PROVIDER === 'nodemailer',
        type: 'input',
        name: 'values.EMAIL_PASSWORD',
        message: 'What is the email password? (check your email provider)',
      },
      {
        when: (answers) => answers.values.MAILER_PROVIDER === 'nodemailer',
        type: 'confirm',
        name: 'values.EMAIL_TLS',
        message: 'Do you want to enable TLS for your emails?',
      },
      {
        type: 'confirm',
        name: 'captcha',
        message:
          'Do you want to enable Cloudflare Captcha protection for the Auth endpoints?',
      },
      {
        when: (answers) => answers.captcha,
        type: 'input',
        name: 'values.VITE_CAPTCHA_SITE_KEY',
        message:
          'What is the Cloudflare Captcha site key? NB: this is the PUBLIC key!',
      },
      {
        when: (answers) => answers.captcha,
        type: 'input',
        name: 'values.CAPTCHA_SECRET_TOKEN',
        message:
          'What is the Cloudflare Captcha secret key? NB: this is the PRIVATE key!',
      },
    ],
  });
}

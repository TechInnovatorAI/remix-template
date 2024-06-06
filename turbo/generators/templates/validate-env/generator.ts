import type { PlopTypes } from '@turbo/gen';

// quick hack to avoid installing zod globally
import { z } from '../../../../apps/web/node_modules/zod';
import { generator } from '../../utils';

const BooleanStringEnum = z.enum(['true', 'false']);

const Schema: Record<string, z.ZodType> = {
  VITE_SITE_URL: z
    .string({
      description: `This is the URL of your website. It should start with https:// like https://makerkit.dev.`,
    })
    .url({
      message:
        'VITE_SITE_URL must be a valid URL. Please use HTTPS for production sites, otherwise it will fail.',
    })
    .refine(
      (url) => {
        return url.startsWith('https://');
      },
      {
        message: 'VITE_SITE_URL must start with https://',
        path: ['VITE_SITE_URL'],
      },
    ),
  VITE_PRODUCT_NAME: z
    .string({
      message: 'Product name must be a string',
      description: `This is the name of your product. It should be a short name like MakerKit.`,
    })
    .min(1),
  VITE_SITE_DESCRIPTION: z.string({
    message: 'Site description must be a string',
    description: `This is the description of your website. It should be a short sentence or two.`,
  }),
  VITE_DEFAULT_THEME_MODE: z.enum(['light', 'dark', 'system'], {
    message: 'Default theme mode must be light, dark or system',
    description: `This is the default theme mode for your website. It should be light, dark or system.`,
  }),
  VITE_DEFAULT_LOCALE: z.string({
    message: 'Default locale must be a string',
    description: `This is the default locale for your website. It should be a two-letter code like en or fr.`,
  }),
  CONTACT_EMAIL: z
    .string({
      message: 'Contact email must be a valid email',
      description: `This is the email address that will receive contact form submissions.`,
    })
    .email(),
  VITE_ENABLE_THEME_TOGGLE: BooleanStringEnum,
  VITE_AUTH_PASSWORD: BooleanStringEnum,
  VITE_AUTH_MAGIC_LINK: BooleanStringEnum,
  VITE_ENABLE_PERSONAL_ACCOUNT_DELETION: BooleanStringEnum,
  VITE_ENABLE_PERSONAL_ACCOUNT_BILLING: BooleanStringEnum,
  VITE_ENABLE_TEAM_ACCOUNTS: BooleanStringEnum,
  VITE_ENABLE_TEAM_ACCOUNT_DELETION: BooleanStringEnum,
  VITE_ENABLE_TEAM_ACCOUNTS_BILLING: BooleanStringEnum,
  VITE_ENABLE_TEAM_ACCOUNTS_CREATION: BooleanStringEnum,
  VITE_REALTIME_NOTIFICATIONS: BooleanStringEnum,
  VITE_ENABLE_NOTIFICATIONS: BooleanStringEnum,
  VITE_SUPABASE_URL: z
    .string({
      description: `This is the URL to your hosted Supabase instance.`,
    })
    .url({
      message: 'Supabase URL must be a valid URL',
    }),
  VITE_SUPABASE_ANON_KEY: z.string({
    message: 'Supabase anon key must be a string',
    description: `This is the key provided by Supabase. It is a public key used client-side.`,
  }),
  SUPABASE_SERVICE_ROLE_KEY: z.string({
    message: 'Supabase service role key must be a string',
    description: `This is the key provided by Supabase. It is a private key used server-side.`,
  }),
  VITE_BILLING_PROVIDER: z.enum(['stripe', 'lemon-squeezy'], {
    message: 'Billing provider must be stripe or lemon-squeezy',
    description: `This is the billing provider you want to use. It should be stripe or lemon-squeezy.`,
  }),
  VITE_STRIPE_PUBLISHABLE_KEY: z
    .string({
      message: 'Stripe publishable key must be a string',
      description: `This is the publishable key from your Stripe dashboard. It should start with pk_`,
    })
    .refine(
      (value) => {
        return value.startsWith('pk_');
      },
      {
        message: 'Stripe publishable key must start with pk_',
        path: ['VITE_STRIPE_PUBLISHABLE_KEY'],
      },
    ),
  STRIPE_SECRET_KEY: z
    .string({
      message: 'Stripe secret key must be a string',
      description: `This is the secret key from your Stripe dashboard. It should start with sk_`,
    })
    .refine(
      (value) => {
        return value.startsWith('sk_');
      },
      {
        message: 'Stripe secret key must start with sk_',
        path: ['STRIPE_SECRET_KEY'],
      },
    ),
  STRIPE_WEBHOOK_SECRET: z
    .string({
      message: 'Stripe webhook secret must be a string',
      description: `This is the signing secret you copy after creating a webhook in your Stripe dashboard.`,
    })
    .min(1)
    .refine(
      (value) => {
        return value.startsWith('whsec_');
      },
      {
        message: 'Stripe webhook secret must start with whsec_',
        path: ['STRIPE_WEBHOOK_SECRET'],
      },
    ),
  LEMON_SQUEEZY_SECRET_KEY: z
    .string({
      message: 'Lemon Squeezy API key must be a string',
      description: `This is the API key from your Lemon Squeezy account`,
    })
    .min(1),
  LEMON_SQUEEZY_STORE_ID: z
    .string({
      message: 'Lemon Squeezy store ID must be a string',
      description: `This is the store ID of your Lemon Squeezy account`,
    })
    .min(1),
  LEMON_SQUEEZY_SIGNING_SECRET: z
    .string({
      message: 'Lemon Squeezy signing secret must be a string',
      description: `This is a shared secret that you must set in your Lemon Squeezy account when you create an API Key`,
    })
    .min(1),
  MAILER_PROVIDER: z.enum(['nodemailer', 'resend'], {
    message: 'Mailer provider must be nodemailer or resend',
    description: `This is the mailer provider you want to use for sending emails. nodemailer is a generic SMTP mailer, resend is a service.`,
  }),
};

export function createEnvironmentVariablesValidatorGenerator(
  plop: PlopTypes.NodePlopAPI,
) {
  return plop.setGenerator('validate-env', {
    description: 'Validate the environment variables to be used in the app',
    actions: [
      async (answers) => {
        if (!('path' in answers) || !answers.path) {
          throw new Error('URL is required');
        }

        const env = generator.loadEnvironmentVariables(answers.path as string);

        for (const key of Object.keys(env)) {
          const property = Schema[key];
          const value = env[key];

          if (property) {
            // parse with Zod
            const { error } = property.safeParse(value);

            if (error) {
              throw new Error(
                `Encountered a validation error for key ${key}:${value} \n\n${JSON.stringify(error, null, 2)}`,
              );
            } else {
              console.log(`Key ${key} is valid!`);
            }
          }
        }

        return 'Environment variables are valid!';
      },
    ],
    prompts: [
      {
        type: 'input',
        name: 'path',
        message:
          'Where is the path to the environment variables file? Leave empty to use the generated turbo/generators/templates/env/.env.local',
        default: 'turbo/generators/templates/env/.env.local',
      },
    ],
  });
}

import type { Provider } from '@supabase/supabase-js';

import { z } from 'zod';

const providers: z.ZodType<Provider> = getProviders();

const AuthConfigSchema = z.object({
  captchaTokenSiteKey: z
    .string({
      description: 'The reCAPTCHA site key.',
    })
    .optional(),
  displayTermsCheckbox: z
    .boolean({
      description: 'Whether to display the terms checkbox during sign-up.',
    })
    .optional(),
  providers: z.object({
    password: z.boolean({
      description: 'Enable password authentication.',
    }),
    magicLink: z.boolean({
      description: 'Enable magic link authentication.',
    }),
    oAuth: providers.array(),
  }),
});

const authConfig = AuthConfigSchema.parse({
  // NB: This is a public key, so it's safe to expose.
  // Copy the value from the Supabase Dashboard.
  captchaTokenSiteKey: import.meta.env.VITE_CAPTCHA_SITE_KEY,

  // whether to display the terms checkbox during sign-up
  displayTermsCheckbox:
    import.meta.env.VITE_DISPLAY_TERMS_AND_CONDITIONS_CHECKBOX === 'true',

  // NB: Enable the providers below in the Supabase Console
  // in your production project
  providers: {
    password: import.meta.env.VITE_AUTH_PASSWORD === 'true',
    magicLink: import.meta.env.VITE_AUTH_MAGIC_LINK === 'true',
    oAuth: ['google'],
  },
} satisfies z.infer<typeof AuthConfigSchema>);

export default authConfig;

function getProviders() {
  return z.enum([
    'apple',
    'azure',
    'bitbucket',
    'discord',
    'facebook',
    'figma',
    'github',
    'gitlab',
    'google',
    'kakao',
    'keycloak',
    'linkedin',
    'linkedin_oidc',
    'notion',
    'slack',
    'spotify',
    'twitch',
    'twitter',
    'workos',
    'zoom',
    'fly',
  ]);
}

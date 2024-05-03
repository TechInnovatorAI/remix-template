import { z } from 'zod';

const production = process.env.NODE_ENV === 'production';

const AppConfigSchema = z
  .object({
    name: z
      .string({
        description: `This is the name of your SaaS. Ex. "Makerkit"`,
        required_error: `Please provide the variable REMIX_PUBLIC_PRODUCT_NAME`,
      })
      .min(1),
    title: z
      .string({
        description: `This is the default title tag of your SaaS.`,
        required_error: `Please provide the variable REMIX_PUBLIC_SITE_TITLE`,
      })
      .min(1),
    description: z.string({
      description: `This is the default description of your SaaS.`,
      required_error: `Please provide the variable REMIX_PUBLIC_SITE_DESCRIPTION`,
    }),
    url: z
      .string({
        required_error: `Please provide the variable REMIX_PUBLIC_SITE_URL`,
      })
      .url({
        message: `You are deploying a production build but have entered a REMIX_PUBLIC_SITE_URL variable using http instead of https. It is very likely that you have set the incorrect URL. The build will now fail to prevent you from from deploying a faulty configuration. Please provide the variable REMIX_PUBLIC_SITE_URL with a valid URL, such as: 'https://example.com'`,
      }),
    locale: z
      .string({
        description: `This is the default locale of your SaaS.`,
        required_error: `Please provide the variable REMIX_PUBLIC_DEFAULT_LOCALE`,
      })
      .default('en'),
    theme: z.enum(['light', 'dark', 'system']),
    production: z.boolean(),
    themeColor: z.string(),
    themeColorDark: z.string(),
  })
  .refine(
    (schema) => {
      const isCI = process.env.REMIX_PUBLIC_CI;

      if (isCI ?? !schema.production) {
        return true;
      }

      return !schema.url.startsWith('http:');
    },
    {
      message: `Please use a valid HTTPS URL in production.`,
      path: ['url'],
    },
  )
  .refine(
    (schema) => {
      return schema.themeColor !== schema.themeColorDark;
    },
    {
      message: `Please provide different theme colors for light and dark themes.`,
      path: ['themeColor'],
    },
  );

const appConfig = AppConfigSchema.parse({
  name: process.env.REMIX_PUBLIC_PRODUCT_NAME,
  title: process.env.REMIX_PUBLIC_SITE_TITLE,
  description: process.env.REMIX_PUBLIC_SITE_DESCRIPTION,
  url: process.env.REMIX_PUBLIC_SITE_URL,
  locale: process.env.REMIX_PUBLIC_DEFAULT_LOCALE,
  theme: process.env.REMIX_PUBLIC_DEFAULT_THEME_MODE,
  themeColor: process.env.REMIX_PUBLIC_THEME_COLOR,
  themeColorDark: process.env.REMIX_PUBLIC_THEME_COLOR_DARK,
  production,
});

export default appConfig;

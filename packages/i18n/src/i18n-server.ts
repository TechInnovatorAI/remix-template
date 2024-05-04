import { type InitOptions, createInstance } from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next/initReactI18next';

/**
 * Initialize the i18n instance on the server.
 * This is useful for RSC and SSR.
 * @param settings - the i18n settings
 * @param resolver - a function that resolves the i18n resources
 */
export async function initializeServerI18n(
  settings: InitOptions,
  resolver: (language: string, namespace: string) => Promise<object>,
) {
  const i18nInstance = createInstance();

  await i18nInstance
    .use(
      resourcesToBackend(async (language, namespace, callback) => {
        try {
          const data = await resolver(language, namespace);

          return callback(null, data);
        } catch (error) {
          console.log(
            `Error loading i18n file: locales/${language}/${namespace}.json`,
            error,
          );

          return {};
        }
      }),
    )
    .use(initReactI18next)
    .init(settings, (error) => {
      if (error) {
        console.error('Error initializing i18n server', error);
      }
    });

  return i18nInstance;
}

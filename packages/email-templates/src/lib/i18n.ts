import { initializeServerI18n } from '@kit/i18n/server';

export function initializeEmailI18n(params: {
  language: string | undefined;
  namespace: string;
}) {
  const language = params.language ?? 'en';

  return initializeServerI18n(
    {
      supportedLngs: [language],
      lng: language,
      ns: params.namespace,
    },
    async (language, namespace) => {
      try {
        const data = await import(`../locales/${language}/${namespace}.json`);

        return data as Record<string, string>;
      } catch (error) {
        console.log(
          `Error loading i18n file: locales/${language}/${namespace}.json`,
          error,
        );

        return {};
      }
    },
  );
}

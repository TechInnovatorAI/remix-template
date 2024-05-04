import { parseAcceptLanguageHeader } from '@kit/i18n';
import { initializeServerI18n } from '@kit/i18n/server';

import featuresFlagConfig from '~/config/feature-flags.config';
import { languageCookie } from '~/lib/cookies';
import { getI18nSettings, languages } from '~/lib/i18n/i18n.settings';

import { i18nResolver } from './i18n.resolver';

/**
 * @name priority
 * @description The language priority setting from the feature flag configuration.
 */
const priority = featuresFlagConfig.languagePriority;

/**
 * @name createI18nServerInstance
 * @description Creates an instance of the i18n server.
 * It uses the language from the cookie if it exists, otherwise it uses the language from the accept-language header.
 * If neither is available, it will default to the provided environment variable.
 *
 * Initialize the i18n instance for every RSC server request (eg. each page/layout)
 */
async function createInstance(request: Request) {
  let cookie = await languageCookie.parse(request.headers.get('Cookie'));

  if (Object.keys(cookie ?? {}).length === 0) {
    cookie = undefined;
  }

  let selectedLanguage: string | undefined = undefined;

  // if the cookie is set, use the language from the cookie
  if (cookie) {
    selectedLanguage = getLanguageOrFallback(cookie);
  }

  // if not, check if the language priority is set to user and
  // use the user's preferred language
  if (!selectedLanguage && priority === 'user') {
    const userPreferredLanguage = getPreferredLanguageFromBrowser(request);

    selectedLanguage = getLanguageOrFallback(userPreferredLanguage);
  }

  const settings = getI18nSettings(selectedLanguage);

  return initializeServerI18n(settings, i18nResolver);
}

export const createI18nServerInstance = createInstance;

function getPreferredLanguageFromBrowser(request: Request) {
  const acceptLanguage = request.headers.get('accept-language');

  if (!acceptLanguage) {
    return;
  }

  return parseAcceptLanguageHeader(acceptLanguage, languages)[0];
}

function getLanguageOrFallback(language: string | undefined) {
  let selectedLanguage = language;

  if (!languages.includes(language ?? '')) {
    console.warn(
      `Language "${language}" is not supported. Falling back to "${languages[0]}"`,
    );

    selectedLanguage = languages[0];
  }

  return selectedLanguage;
}

/**
 * By default, Remix will handle hydrating your app on the client for you.
 * You are free to delete this file if you'd like to, but if you ever want it revealed again, you can run `npx remix reveal` ✨
 * For more information, see https://remix.run/file-conventions/entry.client
 */
import { StrictMode, startTransition } from 'react';

import { RemixBrowser } from '@remix-run/react';
import { hydrateRoot } from 'react-dom/client';

import { I18nProvider } from '@kit/i18n/provider';

import { i18nResolver } from '~/lib/i18n/i18n.resolver';
import { getI18nSettings } from '~/lib/i18n/i18n.settings';

import '../styles/global.css';

startTransition(() => {
  const settings = getI18nSettings();

  hydrateRoot(
    document,
    <StrictMode>
      <I18nProvider settings={settings} resolver={i18nResolver}>
        <RemixBrowser />
      </I18nProvider>
    </StrictMode>,
  );
});

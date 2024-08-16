import { Suspense, useMemo } from 'react';

import { ThemeProvider } from 'next-themes';

import { CaptchaProvider, CaptchaTokenSetter } from '@kit/auth/captcha/client';
import { I18nProvider } from '@kit/i18n/provider';
import { MonitoringProvider } from '@kit/monitoring/components';
import { AppEventsProvider } from '@kit/shared/events';
import { ClientOnly } from '@kit/ui/client-only';
import { GlobalLoader } from '@kit/ui/global-loader';
import { If } from '@kit/ui/if';
import { Toaster } from '@kit/ui/sonner';
import { VersionUpdater } from '@kit/ui/version-updater';

import { AnalyticsProvider } from '~/components/analytics-provider';
import { AuthProvider } from '~/components/auth-provider';
import authConfig from '~/config/auth.config';
import featuresFlagConfig from '~/config/feature-flags.config';
import { i18nResolver } from '~/lib/i18n/i18n.resolver';
import { getI18nSettings } from '~/lib/i18n/i18n.settings';

import { ReactQueryProvider } from './react-query-provider';

const captchaSiteKey = authConfig.captchaTokenSiteKey;

export function RootProviders(
  props: React.PropsWithChildren<{
    theme: string;
    language: string;
  }>,
) {
  const settings = useMemo(
    () => getI18nSettings(props.language),
    [props.language],
  );

  return (
    <Suspense>
      <I18nProvider settings={settings} resolver={i18nResolver}>
        <Toaster richColors={false} />

        <ClientOnly>
          <GlobalLoader displaySpinner={false} />
        </ClientOnly>

        <ReactQueryProvider>
          <MonitoringProvider>
            <AppEventsProvider>
              <AnalyticsProvider>
                <CaptchaProvider>
                  <CaptchaTokenSetter siteKey={captchaSiteKey} />

                  <AuthProvider>
                    <ThemeProvider
                      attribute="class"
                      enableSystem
                      disableTransitionOnChange
                      defaultTheme={props.theme}
                      enableColorScheme={false}
                    >
                      {props.children}
                    </ThemeProvider>
                  </AuthProvider>

                  <If condition={featuresFlagConfig.enableVersionUpdater}>
                    <VersionUpdater />
                  </If>
                </CaptchaProvider>{' '}
              </AnalyticsProvider>
            </AppEventsProvider>
          </MonitoringProvider>
        </ReactQueryProvider>
      </I18nProvider>
    </Suspense>
  );
}

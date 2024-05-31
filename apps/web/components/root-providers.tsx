import { Suspense, useMemo } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';

import { CaptchaProvider, CaptchaTokenSetter } from '@kit/auth/captcha/client';
import { I18nProvider } from '@kit/i18n/provider';
import { MonitoringProvider } from '@kit/monitoring/components';
import { useAuthChangeListener } from '@kit/supabase/hooks/use-auth-change-listener';
import { GlobalLoader } from '@kit/ui/global-loader';

import authConfig from '~/config/auth.config';
import pathsConfig from '~/config/paths.config';
import { i18nResolver } from '~/lib/i18n/i18n.resolver';
import { getI18nSettings } from '~/lib/i18n/i18n.settings';
import {ClientOnly} from "@kit/ui/client-only";
import {Toaster} from "@kit/ui/sonner";

const queryClient = new QueryClient();
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

        <QueryClientProvider client={queryClient}>
          <MonitoringProvider>
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
            </CaptchaProvider>
          </MonitoringProvider>
        </QueryClientProvider>
      </I18nProvider>
    </Suspense>
  );
}

// we place this below React Query since it uses the QueryClient
function AuthProvider(props: React.PropsWithChildren) {
  useAuthChangeListener({
    appHomePath: pathsConfig.app.home,
  });

  return props.children;
}

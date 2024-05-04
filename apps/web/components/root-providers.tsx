import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';

import { CaptchaProvider, CaptchaTokenSetter } from '@kit/auth/captcha/client';
import { MonitoringProvider } from '@kit/monitoring/components';
import { useAuthChangeListener } from '@kit/supabase/hooks/use-auth-change-listener';

import authConfig from '~/config/auth.config';
import pathsConfig from '~/config/paths.config';

const queryClient = new QueryClient();
const captchaSiteKey = authConfig.captchaTokenSiteKey;

export function RootProviders(
  props: React.PropsWithChildren<{ theme: string }>,
) {
  return (
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
  );
}

// we place this below React Query since it uses the QueryClient
function AuthProvider(props: React.PropsWithChildren) {
  useAuthChangeListener({
    appHomePath: pathsConfig.app.home,
  });

  return props.children;
}

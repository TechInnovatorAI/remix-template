import { LoaderFunctionArgs } from '@remix-run/node';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';

import { CaptchaProvider, CaptchaTokenSetter } from '@kit/auth/captcha/client';
import { MonitoringProvider } from '@kit/monitoring/components';
import { useAuthChangeListener } from '@kit/supabase/hooks/use-auth-change-listener';
import { cn } from '@kit/ui/utils';

import { RootErrorBoundary } from '~/components/root-error-boundary';
import authConfig from '~/config/auth.config';
import pathsConfig from '~/config/paths.config';
import { themeCookie } from '~/lib/cookies';
import { createI18nServerInstance } from '~/lib/i18n/i18n.server';
import { PUBLIC_ENV } from '~/lib/public-env';

const captchaSiteKey = authConfig.captchaTokenSiteKey;

// error boundary
export const ErrorBoundary = RootErrorBoundary;

export async function loader({ request }: LoaderFunctionArgs) {
  const { language } = await createI18nServerInstance(request);
  const theme = await getTheme(request);
  const className = getClassName(theme);

  return {
    language,
    className,
    theme,
    env: PUBLIC_ENV,
  };
}

const queryClient = new QueryClient();

export function Layout(props: React.PropsWithChildren) {
  const data = useLoaderData<typeof loader>();
  const { language, className, theme, env } = data ?? {};

  return (
    <html lang={language} className={className}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <Meta />
        <Links />

        <script
          dangerouslySetInnerHTML={{
            __html: `window.process = {env: ${JSON.stringify(env)}}`,
          }}
        />
      </head>

      <body>
        <QueryClientProvider client={queryClient}>
          <MonitoringProvider>
            <CaptchaProvider>
              <CaptchaTokenSetter siteKey={captchaSiteKey} />

              <AuthProvider>
                <ThemeProvider
                  attribute="class"
                  enableSystem
                  disableTransitionOnChange
                  defaultTheme={theme}
                  enableColorScheme={false}
                >
                  {props.children}
                </ThemeProvider>
              </AuthProvider>
            </CaptchaProvider>
          </MonitoringProvider>
        </QueryClientProvider>

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

function getClassName(theme?: string) {
  const dark = theme === 'dark';
  const light = !dark;

  return cn('min-h-screen bg-background antialiased', {
    dark,
    light,
  });
}

async function getTheme(request: Request) {
  const cookie = request.headers.get('Cookie');
  const theme = await themeCookie.parse(cookie);

  if (Object.keys(theme ?? {}).length === 0) {
    return undefined;
  }

  return theme;
}

// we place this below React Query since it uses the QueryClient
function AuthProvider(props: React.PropsWithChildren) {
  useAuthChangeListener({
    appHomePath: pathsConfig.app.home,
  });

  return props.children;
}

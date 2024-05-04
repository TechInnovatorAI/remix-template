import { LoaderFunctionArgs } from '@remix-run/node';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react';

import { cn } from '@kit/ui/utils';

import { RootErrorBoundary } from '~/components/root-error-boundary';
import { RootHead } from '~/components/root-head';
import { RootProviders } from '~/components/root-providers';
import appConfig from '~/config/app.config';
import { themeCookie } from '~/lib/cookies';
import { createI18nServerInstance } from '~/lib/i18n/i18n.server';
import { PUBLIC_ENV } from '~/lib/public-env';

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

export default function App() {
  const data = useLoaderData<typeof loader>();
  const { language, className, theme, env } = data ?? {};

  return (
    <html lang={language} className={className}>
      <head>
        <RootHead />
        <Meta />
        <Links />

        <script
          dangerouslySetInnerHTML={{
            __html: `window.process = {env: ${JSON.stringify(env)}}`,
          }}
        />
      </head>

      <body>
        <RootProviders theme={theme} language={language}>
          <Outlet />
        </RootProviders>

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
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
    return appConfig.theme;
  }

  return theme;
}

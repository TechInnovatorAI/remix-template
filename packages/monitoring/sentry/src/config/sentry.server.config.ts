import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.REMIX_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
});

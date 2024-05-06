import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn:import.meta.env.VITE_SENTRY_DSN,
  tracesSampleRate: 1.0,
});

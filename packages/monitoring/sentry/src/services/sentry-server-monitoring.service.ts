import { useEffect } from 'react';

import { useLocation, useMatches } from '@remix-run/react';
import * as Sentry from '@sentry/remix';

import { MonitoringService } from '@kit/monitoring-core';

const DSN = process.env.VITE_SENTRY_DSN;

/**
 * @class
 * @implements {MonitoringService}
 * ServerSentryMonitoringService is responsible for capturing exceptions and identifying users using the Sentry monitoring service.
 */
export class SentryServerMonitoringService implements MonitoringService {
  constructor() {
    Sentry.init({
      dsn: DSN,
      integrations: [
        Sentry.browserTracingIntegration({
          useEffect,
          useLocation,
          useMatches,
        }),
        // Replay is only available in the client
        Sentry.replayIntegration(),
      ],

      // Set tracesSampleRate to 1.0 to capture 100%
      // of transactions for performance monitoring.
      // We recommend adjusting this value in production
      tracesSampleRate: 1.0,

      // Capture Replay for 10% of all sessions,
      // plus for 100% of sessions with an error
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
    });
  }

  captureException(error: Error | null) {
    return Sentry.captureException(error);
  }

  captureEvent<Extra extends Sentry.Event>(event: string, extra?: Extra) {
    return Sentry.captureEvent({
      message: event,
      ...(extra ?? {}),
    });
  }

  identifyUser(user: Sentry.User) {
    Sentry.setUser(user);
  }
}

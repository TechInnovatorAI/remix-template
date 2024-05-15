import { useEffect } from 'react';

import { useLocation, useMatches } from '@remix-run/react';
import type { Event, User } from '@sentry/remix';

import { MonitoringService } from '@kit/monitoring-core';

const DSN = import.meta.env.VITE_SENTRY_DSN;

/**
 * @class
 * @implements {MonitoringService}
 * ServerSentryMonitoringService is responsible for capturing exceptions and
 * identifying users using the Sentry monitoring service.
 */
export class SentryServerMonitoringService implements MonitoringService {
  private initialized = false;

  async initialize() {
    if (this.initialized) {
      return;
    }

    const { init, browserTracingIntegration, replayIntegration } = await import(
      '@sentry/remix'
    ).catch();

    init({
      dsn: DSN,
      integrations: [
        browserTracingIntegration({
          useEffect,
          useLocation,
          useMatches,
        }),
        // Replay is only available in the client
        replayIntegration(),
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

    this.initialized = true;
  }

  async captureException(error: Error | null) {
    await this.initialize();

    const { captureException } = await import('@sentry/remix').catch();

    return captureException(error);
  }

  async captureEvent<Extra extends Event>(event: string, extra?: Extra) {
    await this.initialize();

    const { captureEvent } = await import('@sentry/remix').catch();

    return captureEvent({
      message: event,
      ...(extra ?? {}),
    });
  }

  async identifyUser(user: User) {
    await this.initialize();

    const { setUser } = await import('@sentry/remix').catch();

    setUser(user);
  }
}

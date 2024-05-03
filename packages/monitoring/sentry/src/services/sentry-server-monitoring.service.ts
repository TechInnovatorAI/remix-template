import * as Sentry from '@sentry/nextjs';

import { MonitoringService } from '@kit/monitoring-core';

/**
 * @class
 * @implements {MonitoringService}
 * ServerSentryMonitoringService is responsible for capturing exceptions and identifying users using the Sentry monitoring service.
 */
export class SentryServerMonitoringService implements MonitoringService {
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

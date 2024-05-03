import { ConsoleMonitoringService } from '@kit/monitoring-core';

import { getMonitoringProvider } from '../get-monitoring-provider';
import { InstrumentationProvider } from '../monitoring-providers.enum';

const MONITORING_PROVIDER = getMonitoringProvider();

/**
 * @name getServerMonitoringService
 * @description Get the monitoring service based on the MONITORING_PROVIDER environment variable.
 */
export async function getServerMonitoringService() {
  if (!MONITORING_PROVIDER) {
    console.info(
      `No instrumentation provider specified. Returning console service...`,
    );

    return new ConsoleMonitoringService();
  }

  switch (MONITORING_PROVIDER) {
    case InstrumentationProvider.Baselime: {
      const { BaselimeServerMonitoringService } = await import(
        '@kit/baselime/server'
      );

      return new BaselimeServerMonitoringService();
    }

    case InstrumentationProvider.Sentry: {
      const { SentryServerMonitoringService } = await import(
        '@kit/sentry/server'
      );

      return new SentryServerMonitoringService();
    }

    default: {
      throw new Error(
        `Please set the MONITORING_PROVIDER environment variable to register the monitoring instrumentation provider.`,
      );
    }
  }
}

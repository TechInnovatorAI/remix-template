import { useContext } from 'react';

import { MonitoringContext } from '@kit/monitoring-core';

/**
 * @name useMonitoring
 * @description Asynchronously load the monitoring service based on the MONITORING_PROVIDER environment variable.
 * Use Suspense to suspend while loading the service.
 */
export function useMonitoring() {
  return useContext(MonitoringContext);
}

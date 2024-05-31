import { MonitoringContext } from '@kit/monitoring-core';

import { SentryServerMonitoringService } from '../services/sentry-server-monitoring.service';

const sentry = new SentryServerMonitoringService();

export function SentryProvider({ children }: React.PropsWithChildren) {
  return <MonitoringProvider>{children}</MonitoringProvider>;
}

function MonitoringProvider(props: React.PropsWithChildren) {
  return (
    <MonitoringContext.Provider value={sentry}>
      {props.children}
    </MonitoringContext.Provider>
  );
}

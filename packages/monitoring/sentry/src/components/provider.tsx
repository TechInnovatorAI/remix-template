import { useRef } from 'react';

import { MonitoringContext } from '@kit/monitoring-core';

import { SentryServerMonitoringService } from '../services/sentry-server-monitoring.service';

export function SentryProvider({ children }: React.PropsWithChildren) {
  return <MonitoringProvider>{children}</MonitoringProvider>;
}

function MonitoringProvider(props: React.PropsWithChildren) {
  const service = useRef(new SentryServerMonitoringService());

  return (
    <MonitoringContext.Provider value={service.current}>
      {props.children}
    </MonitoringContext.Provider>
  );
}

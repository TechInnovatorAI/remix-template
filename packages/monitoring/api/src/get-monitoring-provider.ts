import { InstrumentationProvider } from './monitoring-providers.enum';

export function getMonitoringProvider() {
  return process.env.REMIX_PUBLIC_MONITORING_PROVIDER as
    | InstrumentationProvider
    | undefined;
}

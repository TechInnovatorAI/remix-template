import { InstrumentationProvider } from './monitoring-providers.enum';

export function getMonitoringProvider() {
  return import.meta.env.VITE_MONITORING_PROVIDER as
    | InstrumentationProvider
    | undefined;
}

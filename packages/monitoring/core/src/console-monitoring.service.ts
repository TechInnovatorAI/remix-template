import { MonitoringService } from '@kit/monitoring-core';

export class ConsoleMonitoringService implements MonitoringService {
  identifyUser() {
    // noop
  }

  captureException(error: Error) {
    const message = error?.message || JSON.stringify(error);

    console.error(`[Console Monitoring] Caught exception: ${message}`);
  }

  captureEvent(event: string) {
    console.log(`[Console Monitoring] Captured event: ${event}`);
  }

  ready() {
    return Promise.resolve();
  }
}

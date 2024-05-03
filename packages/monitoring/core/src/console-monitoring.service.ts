import { MonitoringService } from '@kit/monitoring-core';

export class ConsoleMonitoringService implements MonitoringService {
  identifyUser() {
    // noop
  }

  captureException(error: Error) {
    console.error(
      `[Console Monitoring] Caught exception: ${JSON.stringify(error)}`,
    );
  }

  captureEvent(event: string) {
    console.log(`[Console Monitoring] Captured event: ${event}`);
  }
}

import { useMemo } from 'react';

import { useBaselimeRum } from '@baselime/react-rum';

import { MonitoringService } from '@kit/monitoring-core';

/**
 * @name useBaselime
 * @description Get the Baselime monitoring service for the browser.
 */
export function useBaselime(): MonitoringService {
  const { captureException, setUser, sendEvent } = useBaselimeRum();

  return useMemo(() => {
    return {
      captureException(error: Error, extra?: React.ErrorInfo | undefined) {
        void captureException(error, extra);
      },
      identifyUser(params) {
        setUser(params.id);
      },
      captureEvent<Extra extends object>(event: string, extra?: Extra) {
        return sendEvent(event, extra);
      },
      ready() {
        return Promise.resolve();
      }
    } satisfies MonitoringService;
  }, [captureException, sendEvent, setUser]);
}

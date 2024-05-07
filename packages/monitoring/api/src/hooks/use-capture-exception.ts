import { useEffect } from 'react';

import { useMonitoring } from './use-monitoring';

export function useCaptureException(
  error: Error,
  params: {
    reportError?: boolean;
  } = {
    reportError: true,
  },
) {
  const service = useMonitoring();

  useEffect(() => {
    if (!params.reportError) {
      return;
    }

    service.captureException(error);
  }, [error, service, params]);
}

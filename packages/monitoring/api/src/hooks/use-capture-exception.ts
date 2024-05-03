import { useMonitoring } from './use-monitoring';

export function useCaptureException(error: Error) {
  const service = useMonitoring();

  return service.captureException(error);
}

import { AnalyticsService } from './types';

const noop = (event: string) => {
  // do nothing - this is to prevent errors when the analytics service is not initialized

  // eslint-disable-next-line @typescript-eslint/require-await
  return async (...args: unknown[]) => {
    console.debug(
      `Noop analytics service called with event: ${event}`,
      ...args.filter(Boolean),
    );
  };
};

/**
 * Null analytics service that does nothing. It is initialized with a noop function. This is useful for testing or when
 * the user is calling analytics methods before the analytics service is initialized.
 */
export const NullAnalyticsService: AnalyticsService = {
  initialize: noop('initialize'),
  trackPageView: noop('trackPageView'),
  trackEvent: noop('trackEvent'),
  identify: noop('identify'),
};

import { useEffect } from 'react';

import { useLocation } from '@remix-run/react';

import { analytics } from '@kit/analytics';
import {
  AppEvent,
  AppEventType,
  ConsumerProvidedEventTypes,
  useAppEvents,
} from '@kit/shared/events';

type AnalyticsMapping<
  T extends ConsumerProvidedEventTypes = NonNullable<unknown>,
> = {
  [K in AppEventType<T>]?: (event: AppEvent<T, K>) => unknown;
};

/**
 * Hook to subscribe to app events and map them to analytics actions
 * @param mapping
 */
function useAnalyticsMapping<T extends ConsumerProvidedEventTypes>(
  mapping: AnalyticsMapping<T>,
) {
  const appEvents = useAppEvents<T>();

  useEffect(() => {
    const subscriptions = Object.entries(mapping).map(
      ([eventType, handler]) => {
        appEvents.on(eventType as AppEventType<T>, handler);

        return () => appEvents.off(eventType as AppEventType<T>, handler);
      },
    );

    return () => {
      subscriptions.forEach((unsubscribe) => unsubscribe());
    };
  }, [appEvents, mapping]);
}

/**
 * Define a mapping of app events to analytics actions
 * Add new mappings here to track new events in the analytics service from app events
 */
const analyticsMapping: AnalyticsMapping = {
  'user.signedIn': (event) => {
    const { userId, ...traits } = event.payload;

    if (userId) {
      return analytics.identify(userId, traits);
    }
  },
  'user.signedUp': (event) => {
    return analytics.trackEvent(event.type, event.payload);
  },
  'checkout.started': (event) => {
    return analytics.trackEvent(event.type, event.payload);
  },
  'user.updated': (event) => {
    return analytics.trackEvent(event.type, event.payload);
  },
};

/**
 * Provider for the analytics service
 */
export function AnalyticsProvider(props: React.PropsWithChildren) {
  // Subscribe to app events and map them to analytics actions
  useAnalyticsMapping(analyticsMapping);

  // Report page views to the analytics service
  useReportPageView((url) => analytics.trackPageView(url));

  // Render children
  return props.children;
}

/**
 * Hook to report page views to the analytics service
 * @param reportAnalyticsFn
 */
function useReportPageView(reportAnalyticsFn: (url: string) => unknown) {
  const location = useLocation();
  const url = [location.pathname, location.search].filter(Boolean).join('?');

  useEffect(() => {
    reportAnalyticsFn(url);
  }, [url, reportAnalyticsFn]);
}

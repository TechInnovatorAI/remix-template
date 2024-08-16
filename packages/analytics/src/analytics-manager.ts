import { NullAnalyticsService } from './null-analytics-service';
import type {
  AnalyticsManager,
  AnalyticsService,
  CreateAnalyticsManagerOptions,
} from './types';

export function createAnalyticsManager<T extends string, Config extends object>(
  options: CreateAnalyticsManagerOptions<T, Config>,
): AnalyticsManager {
  const activeServices = new Map<T, AnalyticsService>();

  const getActiveServices = (): AnalyticsService[] => {
    if (activeServices.size === 0) {
      console.debug(
        'No active analytics services. Using NullAnalyticsService.',
      );

      return [NullAnalyticsService];
    }

    return Array.from(activeServices.values());
  };

  const registerActiveServices = (
    options: CreateAnalyticsManagerOptions<T, Config>,
  ) => {
    Object.keys(options.providers).forEach((provider) => {
      const providerKey = provider as keyof typeof options.providers;
      const factory = options.providers[providerKey];

      if (!factory) {
        console.warn(
          `Analytics provider '${provider}' not registered. Skipping initialization.`,
        );

        return;
      }

      const service = factory();
      activeServices.set(provider as T, service);

      void service.initialize();
    });
  };

  registerActiveServices(options);

  return {
    addProvider: (provider: T, config: Config) => {
      const factory = options.providers[provider];

      if (!factory) {
        console.warn(
          `Analytics provider '${provider}' not registered. Skipping initialization.`,
        );

        return Promise.resolve();
      }

      const service = factory(config);
      activeServices.set(provider, service);

      return service.initialize();
    },

    removeProvider: (provider: T) => {
      activeServices.delete(provider);
    },

    identify: (userId: string, traits?: Record<string, string>) => {
      return Promise.all(
        getActiveServices().map((service) => service.identify(userId, traits)),
      );
    },

    trackPageView: (path: string) => {
      return Promise.all(
        getActiveServices().map((service) => service.trackPageView(path)),
      );
    },

    trackEvent: (
      eventName: string,
      eventProperties?: Record<string, string | string[]>,
    ) => {
      return Promise.all(
        getActiveServices().map((service) =>
          service.trackEvent(eventName, eventProperties),
        ),
      );
    },
  };
}

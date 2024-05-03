# Monitoring / @kit/monitoring

Please set the following environment variable to your preferred monitoring provider:

```
REMIX_PUBLIC_MONITORING_PROVIDER=
MONITORING_INSTRUMENTATION_ENABLED=true
```

## Available Providers

To use a specific provider, set the `REMIX_PUBLIC_MONITORING_PROVIDER` environment variable to one of the following values:

1. Baselime: `baselime`
2. Sentry: `sentry`

## Baselime

To use Baselime, set the `REMIX_PUBLIC_MONITORING_PROVIDER` environment variable to `baselime`.

```
REMIX_PUBLIC_MONITORING_PROVIDER=baselime
```

## Sentry

To use Sentry, set the `REMIX_PUBLIC_MONITORING_PROVIDER` environment variable to `sentry`.

```
REMIX_PUBLIC_MONITORING_PROVIDER=sentry
```

## Instrumentation

To enable instrumentation, set the `MONITORING_INSTRUMENTATION_ENABLED` environment variable to `true`.

```
MONITORING_INSTRUMENTATION_ENABLED=true
```
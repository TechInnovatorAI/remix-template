# Sentry Monitoring / @kit/sentry

Please set the following environment variable:

```bash
VITE_MONITORING_PROVIDER=sentry
VITE_SENTRY_DSN=your_dsn
```

Create the following file at the root of your project:

```tsx title="sentry.client.config.ts"
export * from '@kit/sentry/config/client';
```

Create the following file at the root of your project:

```tsx title="sentry.server.config.ts"
export * from '@kit/sentry/config/server';
```

Create the following file at the root of your project:

```tsx title="sentry.edge.config.ts"
export * from '@kit/sentry/config/edge';
```

Finally, update the Next.js configuration in your `next.config.js` file:

```tsx title="next.config.mjs"
import { withSentryConfig } from "@sentry/nextjs";

// wrap your Next.js configuration with the Sentry configuration
withSentryConfig(nextConfig);
```
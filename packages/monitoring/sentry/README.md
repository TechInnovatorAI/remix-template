# Sentry Monitoring / @kit/sentry

Please set the following environment variable:

```bash
VITE_MONITORING_PROVIDER=sentry
VITE_SENTRY_DSN=your_dsn
```

Update your root app at `apps/web/app/root.tsx` to include the following:

1. Install the Sentry SDK for Remix in your application project:

```bash
cd apps/web
pnpm i @sentry/remix
```

2. Update your root app to include the Sentry SDK:

```tsx
// import the Sentry SDK
import { withSentry } from '@sentry/remix';

// export your root app wrapped with Sentry
export default withSentry(App);
```

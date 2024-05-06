# Billing / Lemon Squeezy - @kit/lemon-squeezy

This package is responsible for handling all billing related operations using Lemon Squeezy.

Please add the following environment variables to your `.env.local` file during development:

```env
LEMON_SQUEEZY_SECRET_KEY=
LEMON_SQUEEZY_SIGNING_SECRET=
LEMON_SQUEEZY_STORE_ID=
```

Add the variables to your production environment as well using your CI.

### Webhooks

When testing locally, you are required to set up a proxy to your own local server, so you can receive the webhooks from Lemon Squeezy. You can use [ngrok](https://ngrok.com/) for this purpose, or any other similar service (LocalTunnel, Cloudflare Tunnel, Localcan, etc).

Once you have the proxy running, you can add the URL to your Lemon Squeezy account developer account as the Webhooks URL.

Please set your app configuration URL to the following:

```
VITE_SITE_URL=https://<your-proxy-url>
```

Replace `<your-proxy-url>` with the URL provided by the proxy service.

#### Webhook Events

You must point the webhook to the `/api/billing/webhook` endpoint in your local server.

Please subscribe to the following events:
- `order_created`
- `subscription_created`
- `subscription_updated`
- `subscription_expired`
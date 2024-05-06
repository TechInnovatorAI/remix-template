# Billing / Stripe - @kit/stripe

This package is responsible for handling all billing related operations using Stripe.

Please add the following environment variables to your `.env.local` file during development:

```env
STRIPE_SECRET_KEY=
STRIPE_WEBHOOKS_SECRET=
VITE_STRIPE_PUBLISHABLE_KEY=
```

Add the variables to your production environment as well using your CI.
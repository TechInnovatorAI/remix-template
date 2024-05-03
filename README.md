# Makerkit - Remix Supabase SaaS Starter Kit - Turbo Edition

This is a Starter Kit for building SaaS applications using Supabase, Remix, and Tailwind CSS.

This version uses Turborepo to manage multiple packages in a single repository.

**This project is currently under development. Please wait for the stable release before using it in production. It will undergo big changes and improvements.**

## Features

- **Authentication**: Sign up, sign in, sign out, forgot password, update profile, and more.
- **Billing**: Subscription management, one-off payments, flat subscriptions, per-seat subscriptions, and more.
- **Personal Account**: Manage your account, profile picture, and more.
- **Team Accounts**: Invite members, manage roles, and more. Manage resources within a team.
- **RBAC**: Simple-to-use role-based access control. Customize roles and permissions (coming soon).
- **Admin Dashboard**: Manage users, subscriptions, and more.
- **Pluggable**: Easily add new features and packages to your SaaS application.
- **Super UI**: Beautiful UI using Shadcn UI and Tailwind CSS.

The most notable difference between this version and the original version is the use of Turborepo to manage multiple packages in a single repository.

Thanks to Turborepo, we can manage and isolate different parts of the application in separate packages. This makes it easier to manage and scale the application as it grows.

Additionally, we can extend the codebase without it impacting your web application.

Let's get started!

## Quick Start

### 0. Prerequisites

- Node.js 18.x or later
- Docker
- Pnpm
- Supabase account (optional for local development)
- Payment Gateway account (Stripe/Lemon Squeezy)
- Email Service account (optional for local development)

Clone this repository with the command:

```bash
git clone git@github.com:makerkit/remix-supabase-saas-kit-turbo
```

If your SSH key isn't set - then use the HTTPS.

```bash
git clone https://github.com/makerkit/remix-supabase-saas-kit-turbo
```

Now, remove the original `origin`:

```bash
git remote rm origin
```

Add upstream pointing to this repository so you can pull updates

```bash
git remote add upstream git@github.com:makerkit/remix-supabase-saas-kit-turbo
```

Once you have your own repository, do the same but use `origin` instead of `upstream`

To pull updates (please do this daily with your morning coffee):

```bash
git pull upstream main
```

This will keep your repository up to date.

#### 0.1. Install Pnpm

```bash
# Install pnpm
npm i -g pnpm
```

### 1. Setup dependencies

```bash
# Install dependencies
pnpm i
```

### 2. Start the development server

```bash
# Start the development server
pnpm dev
```

This command will run the web application.

Please refer to `apps/web/README.md` for more information about the web application.

To get started right away, use the credentials below:

- **Email**: `test@makerkit.dev`
- **Password**: `testingpassword`

### 3. Start the Supabase server

To start the Supabase server, you can use the following command:

```bash
# Start the Supabase server
pnpm run supabase:web:start
```

This command runs the Supabase server locally for the app `web`.

Should you add more apps, you can run the following command:

```bash
# Start the Supabase server for the app `app-name`
pnpm run supabase:app-name:start
```

Instead, to stop the Supabase server, you can use the following command:

```bash
# Stop the Supabase server
pnpm run supabase:web:stop
```

To generate the Supabase schema, you can use the following command:

```bash
# Generate the Supabase schema
pnpm run supabase:web:typegen
```

## Architecture

This project uses Turborepo to manage multiple packages in a single repository.

### Apps

The core web application can be found in the `apps/web` package.

Here is where we add the skeleton of the application, including the routing, layout, and global styles.

The main application defines the following:

1. **Configuration**: Environment variables, feature flags, paths, and more. The configuration gets passed down to other packages
2. **Routing**: The main routing of the application. Since this is file-based routing, we define the routes here.
3. **Local components**: Shared components that are used across the application but not necessarily shared with other apps/packages.
4. **Global styles**: Global styles that are used across the application.

### Packages

Below are the reusable packages that can be shared across multiple applications (or packages).

- **`@kit/ui`**: Shared UI components and styles (using Shadcn UI and some custom components)
- **`@kit/shared`**: Shared code and utilities
- **`@kit/supabase`**: Supabase package that defines the schema and logic for managing Supabase
- **`@kit/i18n`**: Internationalization package that defines utilities for managing translations
- **`@kit/billing`**: Billing package that defines the schema and logic for managing subscriptions
- **`@kit/billing-gateway`**: Billing gateway package that defines the schema and logic for managing payment gateways
- **`@kit/email-templates`**: Here we define the email templates using the `react.email` package.
- **`@kit/mailers`**: Mailer package that abstracts the email service provider (e.g., Resend, Cloudflare, SendGrid, Mailgun, etc.)
- **`@kit/monitoring`**: A unified monitoring package that defines the schema and logic for monitoring the application with third party services (e.g., Sentry, Baselime, etc.)
- **`@kit/database-webhooks`**: Database webhooks package that defines the actions following database changes (e.g., sending an email, updating a record, etc.)
- **`@kit/cms`**: CMS package that defines the schema and logic for managing content

And features that can be added to the application:

- **`@kit/auth`**: Authentication package (using Supabase)
- **`@kit/accounts`**: Package that defines components and logic for managing personal accounts
- **`@kit/team-accounts`**: Package that defines components and logic for managing team
- **`@kit/admin`**: Admin package that defines the schema and logic for managing users, subscriptions, and more.

And billing packages that can be added to the application:

- **`@kit/stripe`**: Stripe package that defines the schema and logic for managing Stripe. This is used by the `@kit/billing-gateway` package and abstracts the Stripe API.
- **`@kit/lemon-squeezy`**: Lemon Squeezy package that defines the schema and logic for managing Lemon Squeezy. This is used by the `@kit/billing-gateway` package and abstracts the Lemon Squeezy API. (Coming soon)
- **`@kit/paddle`**: Paddle package that defines the schema and logic for managing Paddle. This is used by the `@kit/billing-gateway` package and abstracts the Paddle API. (Coming soon

The CMSs that can be added to the application:

- **`@kit/wordpress`**:  WordPress package that defines the schema and logic for managing WordPress. This is used by the `@kit/cms` package and abstracts the WordPress API.
- **`@kit/contentlayer`**: Contentlayer package that defines the schema and logic for managing Contentlayer. This is used by the `@kit/cms` package and abstracts the Contentlayer API. Set to be replaced.

Also planned (post-release):

- **`@kit/notifications`**: Notifications package that defines the schema and logic for managing notifications
- **`@kit/plugins`**: Move the existing plugins to a separate package here
- **`@kit/analytics`**: A unified analytics package to track user behavior

### Application Configuration

The configuration is defined in the `apps/web/config` folder. Here you can find the following configuration files:

- **`app.config.ts`**: Application configuration (e.g., name, description, etc.)
- **`auth.config.ts`**: Authentication configuration
- **`billing.config.ts`**: Billing configuration
- **`feature-flags.config.ts`**: Feature flags configuration
- **`paths.config.ts`**: Paths configuration (e.g., routes, API paths, etc.)
- **`personal-account-sidebar.config.ts`**: Personal account sidebar configuration (e.g., links, icons, etc.)
- **`team-account-sidebar.config.ts`**: Team account sidebar configuration (e.g., links, icons, etc.)

## Conventions

### 1. Packages vs Apps

In this project, we use packages to define reusable code that can be shared across multiple applications.

Apps are used to define the main application, including the routing, layout, and global styles.

Apps pass down the configuration to the packages - and the packages provide the corresponding logic and components.

#### Imports and Paths

When importing something from a package or an app, you will use the following paths:

- When you import something from a package, you will use `@kit/package-name` (e.g., `@kit/ui`, `@kit/shared`, etc.).
- When you import something from an app, you will use `~/` (e.g., `~/lib/components`, `~/config`, etc.).

#### Non-Route Folders

Non-route folders within `app` will be prefixed with an underscore (e.g., `_components`, `_lib`, etc.). This makes it obvious that these folders are not routes and are used for shared components, utilities, etc.

#### Server Code

The files localed in `server` folders are to be assumed as server-side code. They are not meant to be used in the client-side code. This helps everyone understanding where the code is meant to be run, since the lines are very blurry in Next.js.

### 2. Environment Variables

Environment variables are defined in the `.env` file in the root of the `apps/web` package.

1. **Shared Environment Variables**: Shared environment variables are defined in the `.env` file. These are the env variables shared between environments (e.g., development, staging, production).
2. **Environment Variables**: Environment variables for a specific environment are defined in the `.env.development` and `.env.production` files. These are the env variables specific to the development and production environments.
3. **Secret Keys**: Secret keys and sensitive information are not stored in the `.env` file. Instead, they are stored in the environment variables of the CI/CD system.
4. **Secret keys to be used locally**: If you need to use secret keys locally, you can store them in the `.env.local` file. This file is not committed to Git, therefore it is safe to store sensitive information in it.

### 3. Your app

Your application will be defined in the `apps/web` package. This is where you will define the main application, including the routing, layout, and global styles.

If you want - create a package for it - but it's not necessary. The `apps/web` package is the main application and you can place all your logic and files there.

### 4. Updating "packages"

The app is designed so that you should focus on what's in `apps/` and that's it. The packages are managed by the core team and are updated regularly.

So - should you update the packages? If you need to, then you need to.

Makerkit makes assumptions and as such - they may not apply to your specific use case. If you need to update the packages, you can and should do so - but it's worth noting that this will cause conflicts. That's fine, but you need to resolve them.

## Installing a Shadcn UI component

To install a Shadcn UI component, you can use the following commands:

```bash
cd packages/ui
npx shadcn-ui@latest add <component> --path=src/shadcn
```

For example, to install the `Button` component, you can use the following command:

```bash
cd packages/ui
npx shadcn-ui@latest add button --path=src/shadcn
```

We pass the `--path` flag to specify the path where the component should be installed. You may need to adjust the path based on your project structure.

**NB**: you may need to update the imports to the `cn` utility function to use the relative imports because it somehow breaks. Please do that.

### Database Webhooks

Finally, you need to set a secret `SUPABASE_DB_WEBHOOK_SECRET` that your server and your Supabase instance will share in order to authenticate the requests.

```bash
SUPABASE_DB_WEBHOOK_SECRET=**************************************************
```

Make it a strong secret key - and make sure to keep it secret!

Now, you need to deploy the Supabase DB webhooks to your Supabase instance.

Please copy the webhooks (written with Postgres SQL) from apps/web/supabase/seed.sql and make sure to replicate them to the Supabase instance.

Make sure to add the following header `X-Supabase-Event-Signature` with the value of the `SUPABASE_DB_WEBHOOK_SECRET` to the request.

In this way - you server will be able to authenticate the request and be sure it's coming from your Supabase instance.

As the endpoint, remember to use the `/api/db/webhook` endpoint. If your APP url is `https://myapp.vercel.app`, the endpoint will be `https://myapp.vercel.app/api/db/webhook`.

#### Adding Database Webhooks from Supabase Studio

The below is only needed when going to production. The local development seed.sql script will add the webhooks for you.

While you can create a migration to add the database webhooks, you can also add them from the Supabase Studio.

1. Go to the Supabase Studio
2. Go to Database->Webhooks
3. Click on "Enable Webhooks"
4. Click on "Create a new hook"

Now, replicate the webhooks at `apps/web/supabase/seed.sql` using the UI:

1. Please remember to set the `X-Supabase-Event-Signature` header with the value of the `SUPABASE_DB_WEBHOOK_SECRET` to the request.
2. Please remember to set the endpoint to `/api/db/webhook` using your real APP URL. If your APP URL is `https://myapp.vercel.app`, the endpoint will be `https://myapp.vercel.app/api/db/webhook`.
3. Use 5000 as the timeout.

## Authentication

From your Supabase dashboard, please visit Authentication->URL Configuration and set the following:

- **Site URL**: The URL of your application (e.g., `http://mypp.com`)
- **Redirect URLs**: The URL to redirect the user after signing in (e.g., `http://myapp.com/auth/callback`)

Remember to update the mailing sender in Supabase too, as the default sender is most likely going to spam and has very limited quota.

You can do so from Settings->Authentication->SMTP Settings.

## Development Gotchas

When you update the repository - I found it best to clear the workspaces and reinstall the dependencies.

```bash
pnpm run clean:workspaces
pnpm run clean
```

Then, reinstall the dependencies:

```bash
pnpm i
```

PNPM is so fast this won't take long.

Sometimes - you will see errors when running the Dev Server (sometimes it's Turbopack, and sometimes pnpm uses a different version of React).

While I figure this stuff out, in these cases, please re-run the Dev Server:

```bash
pnpm dev
```

If necessary, repeat the process above.

## Billing

The billing package is used to manage subscriptions, one-off payments, and more.

The billing package is abstracted from the billing gateway package, which is used to manage the payment gateway (e.g., Stripe, Lemon Squeezy, etc.).

To set up the billing package, you need to set the following environment variables:

```bash
NEXT_PUBLIC_BILLING_PROVIDER=stripe # or lemon-squeezy
```

Makerkit supports both one-off payments and subscriptions. You have the choice to use one or both. What Makerkit cannot assume with certainty is the billing mode you want to use. By default, we assume you want to use subscriptions, as this is the most common billing mode for SaaS applications.

This means that - by default - Makerkit will be looking for a subscription plan when visiting the billing section of the personal or team account. This means we fetch data from the tables `subscriptions` and `subscription_items`.

If you want to use one-off payments, you need to set the billing mode to `one-time`:

```bash
BILLING_MODE=one-time
```

By doing so, Makerkit will be looking for one-off payments when visiting the billing section of the personal or team account. This means we fetch data from the tables `orders` and `order_items`.

### But - I want to use both

Perfect - you can, but you need to customize the pages to display the correct data.

---

Depending on the service you use, you will need to set the environment variables accordingly. By default - the billing package uses Stripe. Alternatively, you can use Lemon Squeezy. In the future, we will also add Paddle.

### Stripe

For Stripe, you'll need to set the following environment variables:

```bash
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

To run the Stripe CLI - which allows you to listen to Stripe events straight to your own localhost - you can use the following command:

```bash
pnpm run stripe:listen
```

**The first time you set it up, you are required to sign in**. This is a one-time process. Once you sign in, you can use the CLI to listen to Stripe events.

Please sign in and re-run the command. Now, you can listen to Stripe events.

### Lemon Squeezy

For Lemon Squeezy, you'll need to set the following environment variables:

```bash
LEMON_SQUEEZY_SECRET_KEY=
LEMON_SQUEEZY_SIGNING_SECRET=
```

I am aware you know this, but never add these variables to the `.env` file. Instead, add them to the environment variables of your CI/CD system.

To test locally, you can add them to the `.env.local` file. This file is not committed to Git, therefore it is safe to store sensitive information in it.

### Billing Schema

The billing schema replicates your billing provider's schema, so that:

1. we can display the data in the UI (pricing table, billing section, etc.)
2. create the correct checkout session
3. make some features work correctly - such as per-seat billing

The billing schema is common to all billing providers. Some billing providers have some differences in what you can or cannot do. In these cases, the schema will try to validate and enforce the rules - but it's up to you to make sure the data is correct.

The schema is based on three main entities:

1. **Products**: The main product you are selling (e.g., "Pro Plan", "Starter Plan", etc.)
2. **Plans**: The pricing plan for the product (e.g., "Monthly", "Yearly", etc.)
3. **Line Items**: The line items for the plan (e.g., "flat subscription", "metered usage", "per seat", etc.)

#### Setting the Billing Provider

The billing provider is already set as `process.env.NEXT_PUBLIC_BILLING_PROVIDER` and defaults to `stripe`.

For clarity - this is set in the `apps/web/config/billing.config.ts` file:

```tsx
export default createBillingSchema({
  // also update config.billing_provider in the DB to match the selected
  provider,
  // products configuration
  products: []
});
```

We will now add the products to the configuration.

#### Products

Products are the main product you are selling. They are defined by the following fields:

```tsx
export default createBillingSchema({
  provider,
  products: [
    {
      id: 'starter',
      name: 'Starter',
      description: 'The perfect plan to get started',
      currency: 'USD',
      badge: `Value`,
      plans: [],
    }
  ]
});
```

Let's break down the fields:

1. **id**: The unique identifier for the product. **This is chosen by you, it doesn't need to be the same one as the one in the provider**.
2. **name**: The name of the product
3. **description**: The description of the product
4. **currency**: The currency of the product
5. **badge**: A badge to display on the product (e.g., "Value", "Popular", etc.)

The majority of these fields are going to populate the pricing table in the UI.

#### Plans

Plans are the pricing plans for the product. They are defined by the following fields:

```tsx
export default createBillingSchema({
  provider,
  products: [
    {
      id: 'starter',
      name: 'Starter',
      description: 'The perfect plan to get started',
      currency: 'USD',
      badge: `Value`,
      plans: [
        {
          name: 'Starter Monthly',
          id: 'starter-monthly',
          trialDays: 7,
          paymentType: 'recurring',
          interval: 'month',
          lineItems: [],
        }
      ],
    }
  ]
});
```

Let's break down the fields:
- **name**: The name of the plan
- **id**: The unique identifier for the plan. **This is chosen by you, it doesn't need to be the same one as the one in the provider**.
- **trialDays**: The number of days for the trial period
- **paymentType**: The payment type (e.g., `recurring`, `one-time`)
- **interval**: The interval of the payment (e.g., `month`, `year`)
- **lineItems**: The line items for the plan

Now, we will be looking at the line items. The line items are the items that make up the plan, and can be of different types:
1. **Flat Subscription**: A flat subscription (e.g., $10/month) - specified as `flat`
2. **Metered Billing**: Metered billing (e.g., $0.10 per 1,000 requests) - specified as `metered`
3. **Per-Seat Billing**: Per-seat billing (e.g., $10 per seat) - specified as `per-seat`

You can add one or more line items to the plan when using Stripe. When using Lemon Squeezy, you can only add one line item - but you can decorate it with the necessary metadata to achieve a similar result.

#### Flat Subscriptions

Flat subscriptions are defined by the following fields:

```tsx

export default createBillingSchema({
  provider,
  products: [
    {
      id: 'starter',
      name: 'Starter',
      description: 'The perfect plan to get started',
      currency: 'USD',
      badge: `Value`,
      plans: [
        {
          name: 'Starter Monthly',
          id: 'starter-monthly',
          trialDays: 7,
          paymentType: 'recurring',
          interval: 'month',
          lineItems: [
            {
              id: 'price_1NNwYHI1i3VnbZTqI2UzaHIe',
              name: 'Addon 2',
              cost: 9.99,
              type: 'flat',
            },
          ],
        }
      ],
    }
  ]
});
```

Let's break down the fields:
- **id**: The unique identifier for the line item. **This must match the price ID in the billing provider**. The schema will validate this, but please remember to set it correctly.
- **name**: The name of the line item
- **cost**: The cost of the line item
- **type**: The type of the line item (e.g., `flat`, `metered`, `per-seat`). In this case, it's `flat`.

The cost is set for UI purposes. **The billing provider will handle the actual billing** - therefore, **please make sure the cost is correctly set in the billing provider**.

#### Metered Billing

Metered billing is defined by the following fields:

```tsx

export default createBillingSchema({
  provider,
  products: [
    {
      id: 'starter',
      name: 'Starter',
      description: 'The perfect plan to get started',
      currency: 'USD',
      badge: `Value`,
      plans: [
        {
          name: 'Starter Monthly',
          id: 'starter-monthly',
          trialDays: 7,
          paymentType: 'recurring',
          interval: 'month',
          lineItems: [
            {
              id: 'price_1NNwYHI1i3VnbZTqI2UzaHIe',
              name: 'Addon 2',
              cost: 0,
              type: 'metered',
              unit: 'GBs',
              tiers: [
                {
                    upTo: 10,
                    cost: 0.1,
                },
                {
                    upTo: 100,
                    cost: 0.05,
                },
                {
                    upTo: 'unlimited',
                    cost: 0.01,
                }
              ]
            },
          ],
        }
      ],
    }
  ]
});
```

Let's break down the fields:
- **id**: The unique identifier for the line item. **This must match the price ID in the billing provider**. The schema will validate this, but please remember to set it correctly.
- **name**: The name of the line item
- **cost**: The cost of the line item. This can be set to `0` as the cost is calculated based on the tiers.
- **type**: The type of the line item (e.g., `flat`, `metered`, `per-seat`). In this case, it's `metered`.
- **unit**: The unit of the line item (e.g., `GBs`, `requests`, etc.). You can use a translation key here.
- **tiers**: The tiers of the line item. Each tier is defined by the following fields:
  - **upTo**: The upper limit of the tier. If the usage is below this limit, the cost is calculated based on this tier.
  - **cost**: The cost of the tier. This is the cost per unit.
  
The tiers data is used exclusively for UI purposes. **The billing provider will handle the actual billing** - therefore, **please make sure the tiers are correctly set in the billing provider**.

#### Per-Seat Billing

Per-seat billing is defined by the following fields:

```tsx
export default createBillingSchema({
  provider,
  products: [
    {
      id: 'starter',
      name: 'Starter',
      description: 'The perfect plan to get started',
      currency: 'USD',
      badge: `Value`,
      plans: [
        {
          name: 'Starter Monthly',
          id: 'starter-monthly',
          trialDays: 7,
          paymentType: 'recurring',
          interval: 'month',
          lineItems: [
            {
              id: 'price_1NNwYHI1i3VnbZTqI2UzaHIe',
              name: 'Addon 2',
              cost: 0,
              type: 'per_seat',
              tiers: [
                {
                    upTo: 3,
                    cost: 0,
                },
                {
                    upTo: 5,
                    cost: 7.99,
                },
                {
                    upTo: 'unlimited',
                    cost: 5.99,
                }
              ]
            },
          ],
        }
      ],
    }
  ]
});
```

Let's break down the fields:
- **id**: The unique identifier for the line item. **This must match the price ID in the billing provider**. The schema will validate this, but please remember to set it correctly.
- **name**: The name of the line item
- **cost**: The cost of the line item. This can be set to `0` as the cost is calculated based on the tiers.
- **type**: The type of the line item (e.g., `flat`, `metered`, `per-seat`). In this case, it's `per-seat`.
- **tiers**: The tiers of the line item. Each tier is defined by the following fields:
  - **upTo**: The upper limit of the tier. If the usage is below this limit, the cost is calculated based on this tier.
  - **cost**: The cost of the tier. This is the cost per unit.

If you set the first tier to `0`, it basically means that the first `n` seats are free. This is a common practice in per-seat billing.

Please remember that the cost is set for UI purposes. **The billing provider will handle the actual billing** - therefore, **please make sure the cost is correctly set in the billing provider**.

#### One-Off Payments

One-off payments are defined by the following fields:

```tsx
export default createBillingSchema({
  provider,
  products: [
    {
      id: 'starter',
      name: 'Starter',
      description: 'The perfect plan to get started',
      currency: 'USD',
      badge: `Value`,
      plans: [
        {
          name: 'Starter Monthly',
          id: 'starter-monthly',
          paymentType: 'one-time',
          lineItems: [
            {
              id: 'price_1NNwYHI1i3VnbZTqI2UzaHIe',
              name: 'Addon 2',
              cost: 9.99,
              type: 'flat',
            },
          ],
        }
      ],
    }
  ]
});
```

Let's break down the fields:
- **name**: The name of the plan
- **id**: The unique identifier for the line item. **This must match the price ID in the billing provider**. The schema will validate this, but please remember to set it correctly.
- **paymentType**: The payment type (e.g., `recurring`, `one-time`). In this case, it's `one-time`.
- **lineItems**: The line items for the plan
  - **id**: The unique identifier for the line item. **This must match the price ID in the billing provider**. The schema will validate this, but please remember to set it correctly.
  - **name**: The name of the line item
  - **cost**: The cost of the line item
  - **type**: The type of the line item (e.g., `flat`). It can only be `flat` for one-off payments.

### Adding more Products, Plans, and Line Items

Simply add more products, plans, and line items to the arrays. The UI **should** be able to handle it in most traditional cases. If you have a more complex billing schema, you may need to adjust the UI accordingly.

## Deploying to Vercel

Deploying to Vercel is straightforward. You can deploy the application using the Vercel CLI or the Vercel dashboard.

No additional configuration is needed to deploy the application to Vercel. If you want to opt-in to the Edge Runtime, please follow the instructions below (except for the Cloudflare CLI installation).

Since Vercel Edge runtime uses Cloudflare, the steps are similar to deploying to Cloudflare.

## Deploying to Cloudflare 🔥

To deploy the application to Cloudflare, you need to do the following:

1. Opt-in to the Edge runtime
2. Using the Cloudflare Mailer
3. Install the Cloudflare CLI
4. Switching CMS
5. Setting Node.js Compatibility Flags

### 0. Limitations

Before you continue, **please evaluate the limitations of the Edge runtime**. The Edge runtime does not support all Node.js features, so you may need to adjust your application accordingly.

Cloudflare is cheaper and faster than many other providers, but running your application on Cloudflare Workers means not having access to the vast Node.js ecosystem.

Makerkit uses Cloudflare as a baseline, so you can deploy it to Cloudflare Workers without any issues. However, you will need to keep in mind the limitations of the Edge runtime when adding new features.

One more thing to consider is that the Edge runtime does run close to your users, but may run far from your database. Consider read replicas or other strategies to reduce latency in all situations.

If your mind is set on using Cloudflare, please follow the instructions below.

### 1. Opting into the Edge runtime

To opt-in to the Edge runtime, you need to do the following: open the root layout file of your app `apps/web/app/layout.tsx` and export the const runtime as `edge`:

```tsx
export const runtime = 'edge';
```

This will enable the Edge runtime for your application.

### 2. Using the Cloudflare Mailer

Since the default library `nodemailer` relies on Node.js, we cannot use it in the Edge runtime. Instead, we will use the Cloudflare Mailer or the Resend Mailer.

To use the Cloudflare Mailer, you need to do the following. Set the `MAILER_PROVIDER` environment variable to `cloudflare` in the `apps/web/.env` file:

```bash
MAILER_PROVIDER=cloudflare
```

Setup SPF and DKIM records in your DNS settings.

Please follow [the Vercel Email documentation](https://github.com/Sh4yy/vercel-email?tab=readme-ov-file#setup-spf) to set up the SPF and DKIM records.

Alternatively, you can use the Resend Mailer. Set the `MAILER_PROVIDER` environment variable to `resend` in the `apps/web/.env` file:

```bash
MAILER_PROVIDER=resend
```

And provide the Resend API key:

```bash
RESEND_API_KEY=your-api-key
```

### 3. Switching CMS

By default, Makerkit uses Keystatic as a CMS. Keystatic's local mode (which relies on the file system) is not supported in the Edge runtime. Therefore, you will need to switch to another CMS.

At this time, the other CMS supported is WordPress. Set `CMS_CLIENT` to `wordpress` in the `apps/web/.env` file:

```bash
CMS_CLIENT=wordpress
```

More alternative CMS implementations will be added in the future.

If you leave Keystatic (or any unsupported CMSs) - it'll deploy, but it won't be able to fetch the content so you'll see a 500 error.

### 4. Setting Node.js Compatibility Flags

Cloudflare requires you to set the Node.js compatibility flags. Please follow the instructions on the [Cloudflare documentation](https://developers.cloudflare.com/workers/runtime-apis/nodejs).

Please don't miss this step, as it's crucial for the application to work in the Edge runtime.

## Super Admin

The Super Admin panel allows you to manage users and accounts.

To access the super admin panel at `/admin`, you will need to assign a user as a super admin.

To do so, pick the user ID of the user you want to assign as a super admin and run the following SQL query:

```sql
UPDATE auth.users SET raw_app_meta_data = raw_app_meta_data || '{"role": "super-admin"}' WHERE id='<user_id>';
```

Please replace `<user_id>` with the user ID you want to assign as a super admin.

## How to approach Local Development

Supabase's hosted Studio is pretty great - but I don't think it should be used to perform schema changes. Instead, I recommend using your local Supabase Studio to make the changes and then generate the migration file. Then, you can push the migration to the remote Supabase instance.

At this point, you have two options:

1. create a migration with `pnpm --filter web supabase migration new <name>` and update the code manually
2. or, use the local Supabase Studio to make the changes and then run `pnpm --filter web supabase db diff -f <name>` which will generate the migration file for you. DOUBLY CHECK THE FILE!

Once you've tested it all and are happy with your local changes, push the migration to the remote Supabase instance with `pnpm --filter web supabase db push`.

Doing the opposite is also okay - but:
1. You're making changes against the production database - which is risky
2. You're not testing the changes locally - which is risky
3. You need to pull the changes from the remote Supabase instance to your local instance so they are in sync

My two cents - but you do you - anything that works for you is good.

## Monitoring

Monitoring is crucial for any application. Makerkit uses Sentry or Baselime for error tracking. Additionally, Makerkit makes use of Next.js experimental instrumentation for performance monitoring.

### Sentry

To use Sentry, you need to set the following environment variables:

```bash
NEXT_PUBLIC_SENTRY_DSN=
NEXT_PUBLIC_MONITORING_PROVIDER=sentry
```

### Baselime

To use Baselime, you need to set the following environment variables:

```bash
NEXT_PUBLIC_BASELIME_KEY=your_key
NEXT_PUBLIC_MONITORING_PROVIDER=baselime
```

### Next.js Instrumentation

To enable instrumentation, you need to set the following environment variables:

```bash
MONITORING_INSTRUMENTATION_ENABLED=true
```

That's it! Makerkit will take care of the rest.

### Capturing Errors

By default, Makerkit captures errors that are caught when rendering the upper `error.tsx` component. This is a good place to catch errors that are not caught by the error boundary.

If you want to capture errors manually, you have two ways

#### Capturing Errors using a hook

```tsx
import { useMonitoring } from '@kit/monitoring/client';

function Component() {
  const { captureException } = useMonitoring();

  const onClick = () => {
    try {
      throw new Error('An error occurred');
    } catch (error) {
      captureException(error);
    }
  };

  return (
    <button onClick={onClick}>Throw an error</button>
  );
}
```

Alternatively, directly use `useCaptureException`:

```tsx
import { useCaptureException } from '@kit/monitoring/client';

function Component() {
  const captureException = useCaptureException();

  const onClick = () => {
    try {
      throw new Error('An error occurred');
    } catch (error) {
      captureException(error);
    }
  };

  return (
    <button onClick={onClick}>Throw an error</button>
  );
}
```

### Server Errors

To capture server errors, you can use the `captureException` function from the `monitoring` package:

```tsx
import { getMonitoringService } from '@kit/monitoring/server';

async function serverSideFunction() {
  try {
    await someAsyncFunction();
  } catch (error) {
    const monitoring = await getMonitoringService();
    
    await monitoring.captureException(error);
  }
}
```

In the future - this will be automatically captured by the `enhanceAction` and `enhanceRouteHandler` functions - so you won't need to do this manually unless you're swallowing the errors in the inner function (in which case, you should rethrow the error or capture manually).

## Merging Conflicts

It is very likely that you will encounter merging conflicts when working with the repository.

Generally speaking, when encountering conflicts on the following files, you need to accept *any of them* but make sure to re-generate them:
1. pnpm-lock.yaml
2. database.types.ts

### pnpm-lock.yaml
To fix the conflicts, you can run the following command:

```bash
pnpm i
```

1. The lock file will be regenerated according to the changes in the repository and your local changes.

### Database Types
For the database types, reset the supabase local state and run the following command:

```bash
pnpm run supabase:web:typegen
```

This will regenerate the types according to the changes in the repository and your local changes.

For the rest of the files, you need to resolve the conflicts manually.

## Going to Production

When you are ready to go to production, please follow the checklist below. This is an overview, a more detailed guide will be provided in the future.

This could take a couple of hours, so buckle up!

1. **Create a Supabase project**. Link the project locally using the Supabase CLI (`supabase link`).
2. **Migrations**: Push the migrations to the remote Supabase project (`supabase db push`).
3. **Auth**: Set your APP URL in the Supabase project settings. This is required for the OAuth flow. Make sure to add the path `/auth/callback` to the allowed URLs. If you don't have it yet, wait.
4. **Auth Providers**: Set the OAuth providers in the Supabase project settings. If you use Google Auth, make sure to set it up. This requires creating a Google Cloud project and setting up the OAuth credentials.
5. **Auth Emails**: It is very much recommended to update the auth emails using the [following documentation](https://supabase.com/docs/guides/auth/server-side/email-based-auth-with-pkce-flow-for-ssr#update-email-templates-with-url-for-api-endpoint). The kit already implements the `confirm` route, but you need to update the emails in your Supabase settings.
6. **Deploy Next.js**: Deploy the Next.js app to Vercel or any another hosting provider. Copy the URL and set it in the Supabase project settings.
7. **Environment Variables**: The initial deploy **will likely fail** because you may not yet have a URL to set in your environment variables. This is normal. Once you have the URL, set the URL in the environment variables and redeploy.
8. **Webhooks**: Set the DB Webhooks in Supabase pointing against your Next.js app at `/api/db/webhooks`.
9. **Emails**: Get some SMTP details from an email service provider like SendGrid or Mailgun or Resend and configure the emails in both the Environment Variables and the Supabase project settings.
10. **Billing**: Create a Stripe/Lemon Squeezy account, make sure to update the environment variables with the correct values. Point webhooks from these to `/api/billing/webhook`.
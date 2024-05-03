# Database Webhooks - @kit/database-webhooks

This package is responsible for handling webhooks from database changes.

For example:
1. when an account is deleted, we handle the cleanup of all related data in the third-party services.
2. when a user is invited, we send an email to the user.
3. when an account member is added, we update the subscription in the third-party services

The default sender provider is directly from the Postgres database.

```
WEBHOOK_SENDER_PROVIDER=postgres
```

Should you add a middleware to the webhook sender provider, you can do so by adding the following to the `WEBHOOK_SENDER_PROVIDER` environment variable.

```
WEBHOOK_SENDER_PROVIDER=svix
```

For example, you can add [https://docs.svix.com/quickstart]](Swix) as a webhook sender provider that receives webhooks from the database changes and forwards them to your application.

Svix is not implemented yet.
import { SupabaseClient } from '@supabase/supabase-js';

import { Database } from '@kit/supabase/database';

import { RecordChange, Tables } from '../record-change.type';

export function createDatabaseWebhookRouterService(
  adminClient: SupabaseClient<Database>,
) {
  return new DatabaseWebhookRouterService(adminClient);
}

/**
 * @name DatabaseWebhookRouterService
 * @description Service that routes the webhook event to the appropriate service
 */
class DatabaseWebhookRouterService {
  constructor(private readonly adminClient: SupabaseClient<Database>) {}

  /**
   * @name handleWebhook
   * @description Handle the webhook event
   * @param body
   */
  async handleWebhook(body: RecordChange<keyof Tables>) {
    switch (body.table) {
      case 'invitations': {
        const payload = body as RecordChange<typeof body.table>;

        return this.handleInvitationsWebhook(payload);
      }

      case 'subscriptions': {
        const payload = body as RecordChange<typeof body.table>;

        return this.handleSubscriptionsWebhook(payload);
      }

      case 'accounts': {
        const payload = body as RecordChange<typeof body.table>;

        return this.handleAccountsWebhook(payload);
      }

      default: {
        return;
      }
    }
  }

  private async handleInvitationsWebhook(body: RecordChange<'invitations'>) {
    const { createAccountInvitationsWebhookService } = await import(
      '@kit/team-accounts/webhooks'
    );

    const service = createAccountInvitationsWebhookService(this.adminClient);

    return service.handleInvitationWebhook(body.record);
  }

  private async handleSubscriptionsWebhook(
    body: RecordChange<'subscriptions'>,
  ) {
    if (body.type === 'DELETE' && body.old_record) {
      const { createBillingWebhooksService } = await import(
        '@kit/billing-gateway'
      );

      const service = createBillingWebhooksService();

      return service.handleSubscriptionDeletedWebhook(body.old_record);
    }
  }

  private async handleAccountsWebhook(body: RecordChange<'accounts'>) {
    if (body.type === 'DELETE' && body.old_record) {
      const { createAccountWebhooksService } = await import(
        '@kit/team-accounts/webhooks'
      );

      const service = createAccountWebhooksService();

      return service.handleAccountDeletedWebhook(body.old_record);
    }
  }
}

import { getLogger } from '@kit/shared/logger';
import { getSupabaseServerAdminClient } from '@kit/supabase/server-admin-client';

import { RecordChange, Tables } from '../record-change.type';
import { createDatabaseWebhookRouterService } from './database-webhook-router.service';
import { getDatabaseWebhookVerifier } from './verifier';

/**
 * @name DatabaseChangePayload
 * @description Payload for the database change event. Useful for handling custom webhooks.
 */
export type DatabaseChangePayload<Table extends keyof Tables> =
  RecordChange<Table>;

export function getDatabaseWebhookHandlerService() {
  return new DatabaseWebhookHandlerService();
}

/**
 * @name getDatabaseWebhookHandlerService
 * @description Get the database webhook handler service
 */
class DatabaseWebhookHandlerService {
  private readonly namespace = 'database-webhook-handler';

  /**
   * @name handleWebhook
   * @description Handle the webhook event
   * @param request
   * @param params
   */
  async handleWebhook(
    request: Request,
    params?: {
      handleEvent<Table extends keyof Tables>(
        payload: Table extends keyof Tables
          ? DatabaseChangePayload<Table>
          : never,
      ): unknown;
    },
  ) {
    const logger = await getLogger();

    const json = await request.clone().json();
    const { table, type } = json as RecordChange<keyof Tables>;

    const ctx = {
      name: this.namespace,
      table,
      type,
    };

    logger.info(ctx, 'Received webhook from DB. Processing...');

    // check if the signature is valid
    const verifier = await getDatabaseWebhookVerifier();

    await verifier.verifySignatureOrThrow(request);

    // all good, handle the webhook

    // create a client with admin access since we are handling webhooks
    // and no user is authenticated
    const client = getSupabaseServerAdminClient();

    // handle the webhook
    const service = createDatabaseWebhookRouterService(client);

    try {
      // handle the webhook event based on the table
      await service.handleWebhook(json);

      // if a custom handler is provided, call it
      if (params?.handleEvent) {
        await params.handleEvent(json);
      }

      logger.info(ctx, 'Webhook processed successfully');
    } catch (error) {
      logger.error(
        {
          ...ctx,
          error,
        },
        'Failed to process webhook',
      );

      throw error;
    }
  }
}

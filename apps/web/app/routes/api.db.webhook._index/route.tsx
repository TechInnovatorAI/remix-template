import { LoaderFunctionArgs } from '@remix-run/node';

import { getDatabaseWebhookHandlerService } from '@kit/database-webhooks';

/**
 * @description POST handler for the webhook route that handles the webhook event
 */
export const action = async ({ request }: LoaderFunctionArgs) => {
  const service = getDatabaseWebhookHandlerService();

  try {
    // handle the webhook event
    await service.handleWebhook(request);

    // return a successful response
    return new Response(null, { status: 200 });
  } catch (error) {
    // return an error response
    return new Response(null, { status: 500 });
  }
};

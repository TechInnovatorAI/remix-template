import { UpsertOrderParams, UpsertSubscriptionParams } from '../types';

/**
 * @name BillingWebhookHandlerService
 * @description Represents an abstract class for handling billing webhook events.
 */
export abstract class BillingWebhookHandlerService {
  /**
   * @name verifyWebhookSignature
   * @description Verify the webhook signature
   * @param request
   */
  abstract verifyWebhookSignature(request: Request): Promise<unknown>;

  /**
   * @name handleWebhookEvent
   * @description Handle the webhook event from the billing provider
   * @param event
   * @param params
   */
  abstract handleWebhookEvent(
    event: unknown,
    params: {
      // this method is called when a checkout session is completed
      onCheckoutSessionCompleted: (
        subscription: UpsertSubscriptionParams | UpsertOrderParams,
      ) => Promise<unknown>;

      // this method is called when a subscription is updated
      onSubscriptionUpdated: (
        subscription: UpsertSubscriptionParams,
      ) => Promise<unknown>;

      // this method is called when a subscription is deleted
      onSubscriptionDeleted: (subscriptionId: string) => Promise<unknown>;

      // this method is called when a payment is succeeded. This is used for
      // one-time payments
      onPaymentSucceeded: (sessionId: string) => Promise<unknown>;

      // this method is called when a payment is failed. This is used for
      // one-time payments
      onPaymentFailed: (sessionId: string) => Promise<unknown>;

      // this method is called when an invoice is paid. We don't have a specific use case for this
      // but it's extremely common for credit-based systems
      onInvoicePaid: (
        subscription: UpsertSubscriptionParams,
      ) => Promise<unknown>;

      // generic handler for any event
      onEvent?: (data: unknown) => Promise<unknown>;
    },
  ): Promise<unknown>;
}

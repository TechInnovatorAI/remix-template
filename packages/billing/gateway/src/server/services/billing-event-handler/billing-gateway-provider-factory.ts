import { SupabaseClient } from '@supabase/supabase-js';

import { BillingConfig } from '@kit/billing';
import { Database } from '@kit/supabase/database';

import { createBillingEventHandlerService } from './billing-event-handler.service';
import { BillingEventHandlerFactoryService } from './billing-gateway-factory.service';

/**
 * @description This function retrieves the billing provider from the database and returns a
 * new instance of the `BillingGatewayService` class. This class is used to interact with the server actions
 * defined in the host application.
 */
export async function getBillingEventHandlerService(
  clientProvider: () => SupabaseClient<Database>,
  provider: Database['public']['Enums']['billing_provider'],
  config: BillingConfig,
) {
  const strategy = await BillingEventHandlerFactoryService.GetProviderStrategy(
    provider,
    config,
  );

  return createBillingEventHandlerService(clientProvider, strategy);
}

import { SupabaseClient } from '@supabase/supabase-js';

import { Database } from '@kit/supabase/database';

import { createBillingGatewayService } from './billing-gateway.service';

/**
 * @description This function retrieves the billing provider from the database and returns a
 * new instance of the `BillingGatewayService` class. This class is used to interact with the server actions
 * defined in the host application.
 */
export async function getBillingGatewayProvider(
  client: SupabaseClient<Database>,
) {
  const provider = await getBillingProvider(client);

  return createBillingGatewayService(provider);
}

async function getBillingProvider(client: SupabaseClient<Database>) {
  const { data, error } = await client
    .from('config')
    .select('billing_provider')
    .single();

  if (error ?? !data.billing_provider) {
    throw error;
  }

  return data.billing_provider;
}

import { SupabaseClient } from '@supabase/supabase-js';

import { z } from 'zod';

import { createAccountsApi } from '@kit/accounts/api';

import { Database } from '~/lib/database.types';

/**
 * The variable BILLING_MODE represents the billing mode for a service. It can
 * have either the value 'subscription' or 'one-time'. If not provided, the default
 * value is 'subscription'. The value can be overridden by the environment variable
 * BILLING_MODE.
 *
 * If the value is 'subscription', we fetch the subscription data for the user.
 * If the value is 'one-time', we fetch the orders data for the user.
 * if none of these suits your needs, please override the below function.
 */
const BILLING_MODE = z
  .enum(['subscription', 'one-time'])
  .default('subscription')
  .parse(process.env.BILLING_MODE);

export const loadTeamAccountBillingPage = (params: {
  client: SupabaseClient<Database>;
  accountId: string;
}) => {
  const { client, accountId } = params;

  const api = createAccountsApi(client);

  const data =
    BILLING_MODE === 'subscription'
      ? api.getSubscription(accountId)
      : api.getOrder(accountId);

  const customerId = api.getCustomerId(accountId);

  return Promise.all([data, customerId]);
};

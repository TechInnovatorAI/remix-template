import { getCustomer } from '@lemonsqueezy/lemonsqueezy.js';
import { z } from 'zod';

import type { CreateBillingPortalSessionSchema } from '@kit/billing/schema';

import { initializeLemonSqueezyClient } from './lemon-squeezy-sdk';

/**
 * Creates a LemonSqueezy billing portal session for the given parameters.
 *
 * @param {object} params - The parameters required to create the billing portal session.
 */
export async function createLemonSqueezyBillingPortalSession(
  params: z.infer<typeof CreateBillingPortalSessionSchema>,
) {
  await initializeLemonSqueezyClient();

  const { data, error } = await getCustomer(params.customerId);

  return {
    data: data?.data.attributes.urls.customer_portal,
    error,
  };
}

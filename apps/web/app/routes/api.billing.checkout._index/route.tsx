import { ActionFunctionArgs } from '@remix-run/node';
import { z } from 'zod';

import { verifyCsrfToken } from '@kit/csrf/server';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

import { PersonalAccountCheckoutSchema } from '~/lib/billing/schema/personal-account-checkout.schema';
import { TeamCheckoutSchema } from '~/lib/billing/schema/team-billing.schema';

const Schema = z.union([
  z.object({
    intent: z.literal('account-checkout'),
    payload: TeamCheckoutSchema,
  }),
  z.object({
    intent: z.literal('personal-checkout'),
    payload: PersonalAccountCheckoutSchema,
  }),
]);

/**
 * @name action
 * @description The action for the billing checkout API route
 * @param args
 */
export async function action(args: ActionFunctionArgs) {
  const json = await args.request.json();
  const data = Schema.parse(json);

  await verifyCsrfToken(args.request, data.payload.csrfToken);

  const client = getSupabaseServerClient(args.request);

  try {
    switch (data.intent) {
      case 'account-checkout': {
        const { createTeamBillingService } = await import(
          '~/lib/billing/.server/team-billing-service.server'
        );

        const service = createTeamBillingService(client);

        return service.createCheckout(data.payload);
      }

      case 'personal-checkout': {
        const { createUserBillingService } = await import(
          '~/lib/billing/.server/user-billing-service.server'
        );

        const service = createUserBillingService(client);

        return service.createCheckoutSession(data.payload);
      }
    }
  } catch (e) {
    return json({
      error: true,
    });
  }
}

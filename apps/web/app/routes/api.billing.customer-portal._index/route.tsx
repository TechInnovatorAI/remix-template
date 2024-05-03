import { ActionFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/react';
import { z } from 'zod';

import { getSupabaseServerClient } from '@kit/supabase/server-client';

import { TeamBillingPortalSchema } from '~/lib/billing/schema/team-billing.schema';

const Schema = z.union([
  z.object({
    intent: z.literal('account-billing-portal'),
    payload: TeamBillingPortalSchema,
  }),
  z.object({
    intent: z.literal('personal-account-billing-portal'),
  }),
]);

/**
 * @name action
 * @description The action for the billing customer portal API route
 * @param args
 */
export async function action(args: ActionFunctionArgs) {
  const formData = await args.request.formData();
  const data = Schema.parse(Object.fromEntries(formData));

  const client = getSupabaseServerClient(args.request);

  try {
    switch (data.intent) {
      case 'account-billing-portal': {
        const { createTeamBillingService } = await import(
          '~/lib/billing/.server/team-billing-service.server'
        );

        const service = createTeamBillingService(client);

        return service.createBillingPortalSession(data.payload);
      }

      case 'personal-account-billing-portal': {
        const { createUserBillingService } = await import(
          '~/lib/billing/.server/user-billing-service.server'
        );

        const service = createUserBillingService(client);

        return service.createBillingPortalSession();
      }
    }
  } catch (e) {
    return json({
      error: true,
    });
  }
}

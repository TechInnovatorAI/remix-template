import { ActionFunctionArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/react';
import { z } from 'zod';

import { getSupabaseServerClient } from '@kit/supabase/server-client';

import { TeamBillingPortalSchema } from '~/lib/billing/schema/team-billing.schema';

/**
 * @name action
 * @description The action for the billing customer portal API route
 * @param args
 */
export async function action(args: ActionFunctionArgs) {
  let data;

  if (args.request.headers.get('Content-Type')?.includes('application/json')) {
    data = z
      .object({
        intent: z.literal('account-billing-portal'),
        payload: TeamBillingPortalSchema,
      })
      .parse(await args.request.json());
  } else {
    data = z
      .object({
        intent: z.literal('personal-account-billing-portal'),
      })
      .parse(Object.fromEntries(await args.request.formData()));
  }

  const client = getSupabaseServerClient(args.request);

  try {
    switch (data.intent) {
      case 'account-billing-portal': {
        const { createTeamBillingService } = await import(
          '~/lib/billing/.server/team-billing-service.server'
        );

        const service = createTeamBillingService(client);
        const url = await service.createBillingPortalSession(data.payload);

        return redirect(url);
      }

      case 'personal-account-billing-portal': {
        const { createUserBillingService } = await import(
          '~/lib/billing/.server/user-billing-service.server'
        );

        const service = createUserBillingService(client);
        const url = await service.createBillingPortalSession();

        return redirect(url);
      }
    }
  } catch (e) {
    return json({
      error: true,
    });
  }
}

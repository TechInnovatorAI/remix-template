import { json, redirect } from '@remix-run/react';
import { ActionFunctionArgs } from '@remix-run/server-runtime';
import { z } from 'zod';

import { verifyCsrfToken } from '@kit/csrf/server';
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

    await verifyCsrfToken(args.request, data.payload.csrfToken);
  } else {
    data = z
      .object({
        intent: z.literal('personal-account-billing-portal'),
        csrfToken: z.string(),
      })
      .parse(Object.fromEntries(await args.request.formData()));

    await verifyCsrfToken(args.request, data.csrfToken);
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
  } catch {
    return json({
      error: true,
    });
  }
}

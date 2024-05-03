import { ActionFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/react';
import { z } from 'zod';

import { getSupabaseServerClient } from '@kit/supabase/server-client';

const Schema = z.object({
  payload: z.object({
    name: z.string(),
  }),
  intent: z.literal('create-account'),
});

export async function action({ request }: ActionFunctionArgs) {
  const body = Schema.parse(await request.json());
  const client = getSupabaseServerClient(request);

  try {
    switch (body.intent) {
      case 'create-account': {
        const { createTeamAccountAction } = await import(
          '@kit/team-accounts/actions'
        );

        return createTeamAccountAction({
          client,
          data: body.payload,
        });
      }

      default: {
        throw new Error(`Invalid intent: ${body.intent}`);
      }
    }
  } catch (error) {
    return json({
      success: false,
    });
  }
}

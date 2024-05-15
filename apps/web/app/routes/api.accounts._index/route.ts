import { json } from '@remix-run/react';
import { ActionFunctionArgs } from '@remix-run/server-runtime';
import { z } from 'zod';

import { CsrfTokenSchema } from '@kit/csrf/schema';
import { verifyCsrfToken } from '@kit/csrf/server';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

const Schema = z.object({
  payload: CsrfTokenSchema.extend({
    name: z.string(),
  }),
  intent: z.literal('create-account'),
});

export async function action({ request }: ActionFunctionArgs) {
  const body = Schema.parse(await request.json());
  const client = getSupabaseServerClient(request);

  await verifyCsrfToken(request, body.payload.csrfToken);

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

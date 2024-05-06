'use server';

import { SupabaseClient } from '@supabase/supabase-js';

import { redirectDocument } from '@remix-run/react';
import { z } from 'zod';

import { Database } from '@kit/supabase/database';
import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerAdminClient } from '@kit/supabase/server-admin-client';

import { createDeletePersonalAccountService } from './services/delete-personal-account.service';

const emailSettings = getEmailSettingsFromEnvironment();

export const deletePersonalAccountAction = async ({
  client,
}: {
  client: SupabaseClient<Database>;
}) => {
  const auth = await requireUser(client);

  if (!auth.data) {
    return redirectDocument(auth.redirectTo);
  }

  const user = auth.data;

  // create a new instance of the personal accounts service
  const service = createDeletePersonalAccountService();

  // sign out the user before deleting their account
  await client.auth.signOut();

  // delete the user's account and cancel all subscriptions
  await service.deletePersonalAccount({
    adminClient: getSupabaseServerAdminClient(),
    userId: user.id,
    userEmail: user.email ?? null,
    emailSettings,
  });

  // redirect to the home page
  return redirectDocument('/');
};

function getEmailSettingsFromEnvironment() {
  return z
    .object({
      fromEmail: z
        .string({
          required_error: 'Provide the variable EMAIL_SENDER',
        })
        .email(),
      productName: z
        .string({
          required_error: 'Provide the variable VITE_PRODUCT_NAME',
        })
        .min(1),
    })
    .parse({
      fromEmail: process.env.EMAIL_SENDER,
      productName: import.meta.env.VITE_PRODUCT_NAME,
    });
}

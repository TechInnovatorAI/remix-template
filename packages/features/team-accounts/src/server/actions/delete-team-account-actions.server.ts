import { SupabaseClient } from '@supabase/supabase-js';

import { redirectDocument, redirect } from '@remix-run/react';
import { z } from 'zod';

import { Database } from '@kit/supabase/database';
import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerAdminClient } from '@kit/supabase/server-admin-client';

import { DeleteTeamAccountSchema } from '../../schema';
import { createDeleteTeamAccountService } from '../services/delete-team-account.service';

export const deleteTeamAccountAction = async (params: {
  client: SupabaseClient<Database>;
  data: z.infer<typeof DeleteTeamAccountSchema>;
}) => {
  const { payload } = DeleteTeamAccountSchema.parse(params.data);
  const accountId = payload.accountId;
  const auth = await requireUser(params.client);

  if (!auth.data) {
    return redirect(auth.redirectTo);
  }

  const userId = auth.data.id;

  // Check if the user has the necessary permissions to delete the team account
  await assertUserPermissionsToDeleteTeamAccount(params.client, {
    accountId,
    userId,
  });

  // Get the Supabase client and create a new service instance.
  const service = createDeleteTeamAccountService();

  // Delete the team account and all associated data.
  await service.deleteTeamAccount(getSupabaseServerAdminClient(), {
    accountId,
    userId,
  });

  return redirectDocument('/home');
};

async function assertUserPermissionsToDeleteTeamAccount(
  client: SupabaseClient<Database>,
  params: {
    accountId: string;
    userId: string;
  },
) {
  const { data, error } = await client
    .from('accounts')
    .select('id')
    .eq('primary_owner_user_id', params.userId)
    .eq('is_personal_account', false)
    .eq('id', params.accountId);

  if (error ?? !data) {
    throw new Error('Account not found');
  }
}

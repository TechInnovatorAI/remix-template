import { SupabaseClient } from '@supabase/supabase-js';

import { redirect } from '@remix-run/react';

import { createTeamAccountsApi } from '@kit/team-accounts/api';

import pathsConfig from '~/config/paths.config';
import { Database } from '~/lib/database.types';

export type TeamAccountWorkspace = Awaited<
  ReturnType<typeof loadTeamWorkspace>
>;

export const loadTeamWorkspace = async (params: {
  accountSlug: string;
  client: SupabaseClient<Database>;
}) => {
  const api = createTeamAccountsApi(params.client);

  const workspace = await api.getAccountWorkspace(params.accountSlug);

  if (workspace.error) {
    throw workspace.error;
  }

  const account = workspace.data.account;

  // we cannot find any record for the selected account
  // so we redirect the user to the home page
  if (!account) {
    throw redirect(pathsConfig.app.home);
  }

  return workspace.data;
};

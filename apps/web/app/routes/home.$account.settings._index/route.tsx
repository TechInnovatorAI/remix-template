import type { ActionFunctionArgs, SerializeFrom } from '@remix-run/node';
import { useRouteLoaderData } from '@remix-run/react';
import { z } from 'zod';

import { getSupabaseServerClient } from '@kit/supabase/server-client';
import {
  deleteTeamAccountAction,
  leaveTeamAccountAction,
  updateTeamAccountName,
} from '@kit/team-accounts/actions';
import { TeamAccountSettingsContainer } from '@kit/team-accounts/components';
import {
  DeleteTeamAccountSchema,
  LeaveTeamAccountSchema,
  UpdateTeamNameSchema,
} from '@kit/team-accounts/schema';
import { PageBody } from '@kit/ui/page';
import { Trans } from '@kit/ui/trans';

import pathsConfig from '~/config/paths.config';
import { TeamAccountLayoutPageHeader } from '~/routes/home.$account/_components/team-account-layout-page-header';
import { loader as accountWorkspaceLoader } from '~/routes/home.$account/route';

const paths = {
  teamAccountSettings: pathsConfig.app.accountSettings,
};

const ActionSchema = z.union([
  LeaveTeamAccountSchema,
  DeleteTeamAccountSchema,
  UpdateTeamNameSchema,
]);

export default function TeamAccountSettingsPage() {
  const data = useRouteLoaderData('routes/home.$account') as SerializeFrom<
    typeof accountWorkspaceLoader
  >;

  const workspace = data.workspace;

  const account = {
    id: workspace.account.id,
    name: workspace.account.name,
    pictureUrl: workspace.account.picture_url,
    slug: workspace.account.slug,
    primaryOwnerUserId: workspace.account.primary_owner_user_id,
  };

  return (
    <>
      <TeamAccountLayoutPageHeader
        account={account.slug}
        title={<Trans i18nKey={'teams:settings.pageTitle'} />}
        description={<Trans i18nKey={'teams:settings.pageDescription'} />}
      />

      <PageBody>
        <div className={'flex max-w-2xl flex-1 flex-col'}>
          <TeamAccountSettingsContainer account={account} paths={paths} />
        </div>
      </PageBody>
    </>
  );
}

export const action = async (args: ActionFunctionArgs) => {
  const data = ActionSchema.parse(await args.request.json());
  const client = getSupabaseServerClient(args.request);

  switch (data.intent) {
    case 'leave-team':
      return leaveTeamAccountAction({
        data,
        client,
      });

    case 'update-team-name':
      return updateTeamAccountName({
        client,
        data,
      });

    case 'delete-team-account':
      return deleteTeamAccountAction({
        data,
        client,
      });
  }
};

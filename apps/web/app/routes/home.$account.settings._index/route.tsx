import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
  SerializeFrom,
} from '@remix-run/node';
import { useRouteLoaderData } from '@remix-run/react';
import { z } from 'zod';

import { verifyCsrfToken } from '@kit/csrf/server';
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
import { createI18nServerInstance } from '~/lib/i18n/i18n.server';
import { requireUserLoader } from '~/lib/require-user-loader';
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

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    {
      title: data?.title,
    },
  ];
};

export async function loader(args: LoaderFunctionArgs) {
  // require user
  await requireUserLoader(args.request);

  const i18n = await createI18nServerInstance(args.request);
  const title = i18n.t('teams:settings.pageTitle');

  return {
    title,
  };
}

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
  const json = await args.request.json();
  const data = ActionSchema.parse(json);

  await verifyCsrfToken(args.request, data.payload.csrfToken);

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

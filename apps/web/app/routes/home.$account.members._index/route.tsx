import { useMemo } from 'react';

import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
  SerializeFrom,
} from '@remix-run/node';
import { json, useLoaderData, useRouteLoaderData } from '@remix-run/react';
import { PlusCircle } from 'lucide-react';
import { z } from 'zod';

import { getSupabaseServerClient } from '@kit/supabase/server-client';
import {
  AccountInvitationsTable,
  AccountMembersTable,
  InviteMembersDialogContainer,
} from '@kit/team-accounts/components';
import {
  DeleteInvitationSchema,
  InviteMembersSchema,
  RemoveMemberSchema,
  RenewInvitationSchema,
  TransferOwnershipSchema,
  UpdateInvitationSchema,
  UpdateMemberRoleSchema,
} from '@kit/team-accounts/schema';
import { Button } from '@kit/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@kit/ui/card';
import { If } from '@kit/ui/if';
import { PageBody } from '@kit/ui/page';
import { Trans } from '@kit/ui/trans';

import { createI18nServerInstance } from '~/lib/i18n/i18n.server';
import { TeamAccountLayoutPageHeader } from '~/routes/home.$account/_components/team-account-layout-page-header';
import { loader as accountWorkspaceLoader } from '~/routes/home.$account/route';

import { loadMembersPageData } from './_lib/members-page-loader.server';

const MembersActionsSchema = z.union([
  InviteMembersSchema,
  RenewInvitationSchema,
  UpdateMemberRoleSchema,
  DeleteInvitationSchema,
  UpdateInvitationSchema,
  RemoveMemberSchema,
  TransferOwnershipSchema,
]);

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    {
      title: data?.title,
    },
  ];
};

export async function loader(args: LoaderFunctionArgs) {
  const client = getSupabaseServerClient(args.request);
  const i18n = await createI18nServerInstance(args.request);
  const title = i18n.t('teams:members.pageTitle');

  const accountSlug = args.params.account as string;

  const [members, invitations, user, canAddMember] = await loadMembersPageData(
    client,
    accountSlug,
  );

  return json({
    title,
    accountSlug,
    members,
    invitations,
    user,
    canAddMember,
  });
}

export default function TeamAccountMembersPage() {
  const data = useLoaderData<typeof loader>();

  const { workspace } = useRouteLoaderData(
    'routes/home.$account',
  ) as SerializeFrom<typeof accountWorkspaceLoader>;

  const account = workspace.account;

  const canManageRoles = account.permissions.includes('roles.manage');
  const canManageInvitations = account.permissions.includes('invites.manage');

  const isPrimaryOwner = account.primary_owner_user_id === data.user.id;
  const currentUserRoleHierarchy = account.role_hierarchy_level;

  const permissions = useMemo(() => {
    return {
      canUpdateInvitation: canManageRoles,
      canRemoveInvitation: canManageRoles,
      currentUserRoleHierarchy,
    };
  }, [canManageRoles, currentUserRoleHierarchy]);

  return (
    <>
      <TeamAccountLayoutPageHeader
        title={<Trans i18nKey={'common:membersTabLabel'} />}
        description={<Trans i18nKey={'common:membersTabDescription'} />}
        account={data.accountSlug}
      />

      <PageBody>
        <div className={'flex w-full max-w-4xl flex-col space-y-6 pb-32'}>
          <Card>
            <CardHeader className={'flex flex-row justify-between'}>
              <div className={'flex flex-col space-y-1.5'}>
                <CardTitle>
                  <Trans i18nKey={'common:membersTabLabel'} />
                </CardTitle>

                <CardDescription>
                  <Trans i18nKey={'common:membersTabDescription'} />
                </CardDescription>
              </div>

              <If condition={canManageInvitations && data.canAddMember}>
                <InviteMembersDialogContainer
                  userRoleHierarchy={currentUserRoleHierarchy}
                  accountSlug={data.accountSlug}
                >
                  <Button size={'sm'} data-test={'invite-members-form-trigger'}>
                    <PlusCircle className={'mr-2 w-4'} />

                    <span>
                      <Trans i18nKey={'teams:inviteMembersButton'} />
                    </span>
                  </Button>
                </InviteMembersDialogContainer>
              </If>
            </CardHeader>

            <CardContent>
              <AccountMembersTable
                userRoleHierarchy={currentUserRoleHierarchy}
                currentUserId={data.user.id}
                currentAccountId={account.id}
                members={data.members}
                isPrimaryOwner={isPrimaryOwner}
                canManageRoles={canManageRoles}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className={'flex flex-row justify-between'}>
              <div className={'flex flex-col space-y-1.5'}>
                <CardTitle>
                  <Trans i18nKey={'teams:pendingInvitesHeading'} />
                </CardTitle>

                <CardDescription>
                  <Trans i18nKey={'teams:pendingInvitesDescription'} />
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent>
              <AccountInvitationsTable
                permissions={permissions}
                invitations={data.invitations}
              />
            </CardContent>
          </Card>
        </div>
      </PageBody>
    </>
  );
}

export const action = async function (args: ActionFunctionArgs) {
  const client = getSupabaseServerClient(args.request);
  const json = await args.request.json();
  const data = await MembersActionsSchema.parseAsync(json);

  switch (data.intent) {
    case 'create-invitations': {
      const { createInvitationsAction } = await import(
        '@kit/team-accounts/actions'
      );

      return createInvitationsAction({ client, data });
    }

    case 'update-member-role': {
      const { updateMemberRoleAction } = await import(
        '@kit/team-accounts/actions'
      );

      return updateMemberRoleAction({
        client,
        data,
      });
    }

    case 'renew-invitation': {
      const { renewInvitationAction } = await import(
        '@kit/team-accounts/actions'
      );

      return renewInvitationAction({
        client,
        data,
      });
    }

    case 'delete-invitation': {
      const { deleteInvitationAction } = await import(
        '@kit/team-accounts/actions'
      );

      return deleteInvitationAction({
        client,
        data,
      });
    }

    case 'update-invitation': {
      const { updateInvitationAction } = await import(
        '@kit/team-accounts/actions'
      );

      return updateInvitationAction({
        client,
        data,
      });
    }

    case 'remove-member': {
      const { removeMemberFromAccountAction } = await import(
        '@kit/team-accounts/actions'
      );

      return removeMemberFromAccountAction({
        client,
        data,
      });
    }

    case 'transfer-ownership': {
      const { transferOwnershipAction } = await import(
        '@kit/team-accounts/actions'
      );

      return transferOwnershipAction({
        client,
        data,
      });
    }
  }
};

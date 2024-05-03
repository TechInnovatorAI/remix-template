import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { json, useLoaderData } from '@remix-run/react';
import { z } from 'zod';

import { getSuperAdminUser } from '@kit/admin';
import {
  banUserAction,
  deleteAccountAction,
  deleteUserAction,
  impersonateUserAction,
  reactivateUserAction,
} from '@kit/admin/actions';
import { loadAdminAccountPage } from '@kit/admin/api';
import { AdminPersonalAccountPage } from '@kit/admin/components/admin-personal-account-page';
import { AdminTeamAccountPage } from '@kit/admin/components/admin-team-account-page';
import {
  BanUserSchema,
  DeleteAccountSchema,
  DeleteUserSchema,
  ImpersonateUserSchema,
  ReactivateUserSchema,
} from '@kit/admin/schema';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

export const meta = [
  {
    title: 'Admin | Account',
  },
];

export const loader = async function (args: LoaderFunctionArgs) {
  const client = getSupabaseServerClient(args.request);
  const user = await getSuperAdminUser(client);

  const account = args.params.account as string;

  const data = await loadAdminAccountPage(account);

  return json({
    ...data,
    user,
  });
};

export default function AdminPage() {
  const data = useLoaderData<typeof loader>();

  return data.is_personal_account ? (
    <AdminPersonalAccountPage
      user={data.user}
      account={{
        picture_url: data.account.picture_url ?? '',
        name: data.account.name ?? '',
        id: data.account.id ?? '',
      }}
      memberships={data.memberships}
      subscription={data.subscription}
    />
  ) : (
    <AdminTeamAccountPage
      account={data.account}
      subscription={data.subscription}
      members={data.members}
    />
  );
}

const AdminAccountActions = z.union([
  BanUserSchema,
  ImpersonateUserSchema,
  DeleteAccountSchema,
  ReactivateUserSchema,
  DeleteUserSchema,
]);

export const action = async function (args: ActionFunctionArgs) {
  const data = AdminAccountActions.parse(await args.request.json());
  const client = getSupabaseServerClient(args.request);

  await getSuperAdminUser(client);

  switch (data.intent) {
    case 'ban-user':
      return banUserAction({ data, client });
    case 'impersonate-user':
      return impersonateUserAction({ data, client });
    case 'delete-team-account':
      return deleteAccountAction(data);
    case 'delete-user':
      return deleteUserAction({ data, client });
    case 'reactivate-user':
      return reactivateUserAction({ data, client });
    default:
      throw new Error('Invalid intent');
  }
};

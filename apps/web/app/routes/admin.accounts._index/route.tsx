import { json, useLoaderData } from '@remix-run/react';
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from '@remix-run/server-runtime';

import { getSuperAdminUser } from '@kit/admin';
import {
  banUserAction,
  deleteAccountAction,
  deleteUserAction,
  impersonateUserAction,
  reactivateUserAction,
} from '@kit/admin/actions';
import { AdminAccountsTable } from '@kit/admin/components/admin-accounts-table';
import { AdminActionsSchema } from '@kit/admin/schema';
import { verifyCsrfToken } from '@kit/csrf/server';
import { getSupabaseServerAdminClient } from '@kit/supabase/server-admin-client';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

export const meta = [
  {
    title: 'Admin | Accounts',
  },
];

export const loader = async function (args: LoaderFunctionArgs) {
  const client = getSupabaseServerClient(args.request);

  // admin protected route
  await getSuperAdminUser(client);

  const params = new URL(args.request.url).searchParams;

  const page = Number(params.get('page') || '1');
  const perPage = Number(params.get('perPage') || '10');
  const query = params.get('query') ?? '';

  const type = (params.get('account_type') ?? 'all') as
    | 'all'
    | 'team'
    | 'personal';

  const startOffset = (page - 1) * perPage;
  const endOffset = page * perPage;

  const adminClient = getSupabaseServerAdminClient();

  let filter = adminClient
    .from('accounts')
    .select('*', {
      count: 'estimated',
    })
    .range(startOffset, endOffset)
    .limit(perPage)
    .order('created_at', { ascending: false });

  if (query) {
    filter = filter.textSearch('name', `%${query}%`);
  }

  if (type && type !== 'all') {
    const onlyPersonal = type === 'personal';

    filter = filter.eq('is_personal_account', onlyPersonal);
  }

  const { data, error, count } = await filter;

  if (error) {
    throw error;
  }

  return json({
    data,
    pageSize: perPage,
    pageCount: Math.ceil((count ?? 0) / perPage),
    page,
    total: count,
    filters: {
      type,
    },
  });
};

export default function AdminAccountsPage() {
  const data = useLoaderData<typeof loader>();

  return <AdminAccountsTable {...data} />;
}

export const action = async function (args: ActionFunctionArgs) {
  const json = await args.request.json();
  const data = AdminActionsSchema.parse(json);

  // verify csrf token
  await verifyCsrfToken(args.request, data.payload.csrfToken);

  const client = getSupabaseServerClient(args.request);

  // admin protected route
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
  }
};

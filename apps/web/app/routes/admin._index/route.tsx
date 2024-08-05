import { json, useLoaderData } from '@remix-run/react';
import type { LoaderFunctionArgs } from '@remix-run/server-runtime';

import { getSuperAdminUser } from '@kit/admin';
import { loadAdminDashboard } from '@kit/admin/api';
import { AdminDashboard } from '@kit/admin/components/admin-dashboard';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { AppBreadcrumbs } from '@kit/ui/app-breadcrumbs';
import { PageBody, PageHeader } from '@kit/ui/page';

export const meta = [
  {
    title: 'Admin | Dashboard',
  },
];

export const loader = async function (args: LoaderFunctionArgs) {
  const client = getSupabaseServerClient(args.request);

  // admin protected route
  await getSuperAdminUser(client);

  const data = await loadAdminDashboard();

  return json(data);
};

export default function AdminPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <>
      <PageHeader title={'Super Admin'} description={<AppBreadcrumbs />} />

      <PageBody>
        <AdminDashboard data={data} />
      </PageBody>
    </>
  );
}

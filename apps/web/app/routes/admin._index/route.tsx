import { LoaderFunctionArgs } from '@remix-run/node';
import { json, useLoaderData } from '@remix-run/react';

import { getSuperAdminUser } from '@kit/admin';
import { loadAdminDashboard } from '@kit/admin/api';
import { AdminDashboard } from '@kit/admin/components/admin-dashboard';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
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
      <PageHeader
        title={'Super Admin'}
        description={`Your SaaS stats at a glance`}
      />

      <PageBody>
        <AdminDashboard data={data} />
      </PageBody>
    </>
  );
}

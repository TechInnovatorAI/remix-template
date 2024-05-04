import { LoaderFunctionArgs } from '@remix-run/node';
import {json, Outlet, useLoaderData} from '@remix-run/react';

import { getSuperAdminUser } from '@kit/admin';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { Page, PageMobileNavigation, PageNavigation } from '@kit/ui/page';

import { AdminSidebar } from './_components/admin-sidebar';
import { AdminMobileNavigation } from './_components/mobile-navigation';

export const meta = [
  {
    title: `Super Admin`,
  },
];

export const loader = async function ({ request }: LoaderFunctionArgs) {
  const client = getSupabaseServerClient(request);

  // admin protected route
  const user = await getSuperAdminUser(client);

  return json({
    user,
  });
};

export default function AdminLayout() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <Page style={'sidebar'}>
      <PageNavigation>
        <AdminSidebar user={user} />
      </PageNavigation>

      <PageMobileNavigation>
        <AdminMobileNavigation />
      </PageMobileNavigation>

      <Outlet />
    </Page>
  );
}

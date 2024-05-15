import { Outlet, json, useLoaderData } from '@remix-run/react';
import type { LoaderFunctionArgs } from '@remix-run/server-runtime';

import { getSupabaseServerClient } from '@kit/supabase/server-client';

// local imports
import { SiteFooter } from './_components/site-footer';
import { SiteHeader } from './_components/site-header';

export async function loader({ request }: LoaderFunctionArgs) {
  const client = getSupabaseServerClient(request);
  const session = await client.auth.getSession();
  const user = session?.data.session?.user;

  return json({
    user,
  });
}

export default function MarketingLayout() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className={'flex min-h-[100vh] flex-col'}>
      <SiteHeader user={data.user} />
      <Outlet />
      <SiteFooter />
    </div>
  );
}

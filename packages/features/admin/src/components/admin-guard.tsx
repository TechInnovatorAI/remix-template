import { notFound } from 'next/navigation';

import { getSupabaseServerComponentClient } from '@kit/supabase/server-client';

import { isSuperAdmin } from '../lib/server/utils/is-super-admin';

type LayoutOrPageComponent<Params> = React.ComponentType<Params>;

/**
 * AdminGuard is a server component wrapper that checks if the user is a super-admin before rendering the component.
 * If the user is not a super-admin, we redirect to a 404.
 * @param Component - The Page or Layout component to wrap
 */
export function AdminGuard<Params extends object>(
  Component: LayoutOrPageComponent<Params>,
) {
  return async function AdminGuardServerComponentWrapper(params: Params) {
    const client = getSupabaseServerComponentClient();
    const isUserSuperAdmin = await isSuperAdmin(client);

    // if the user is not a super-admin, we redirect to a 404
    if (!isUserSuperAdmin) {
      notFound();
    }

    return <Component {...params} />;
  };
}

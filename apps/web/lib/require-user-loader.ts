import { SupabaseClient } from '@supabase/supabase-js';

import { redirect } from '@remix-run/react';

import { requireUser } from '@kit/supabase/require-user';

/**
 * @name requireUserLoader
 * @description Shortcut to require a user and redirect if not authenticated. To be used mostly in loaders or actions.
 * @param client
 */
export async function requireUserLoader(client: SupabaseClient) {
  const auth = await requireUser(client);

  if (!auth.data) {
    throw redirect(auth.redirectTo);
  }

  return auth.data;
}

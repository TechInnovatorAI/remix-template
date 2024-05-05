import { SupabaseClient } from '@supabase/supabase-js';

import { redirect } from '@remix-run/react';

import { Database } from '@kit/supabase/database';

/**
 * @name getSuperAdminUser
 * @description Check if the current user is a super admin and return the user.
 * @param client
 */
export async function getSuperAdminUser(client: SupabaseClient<Database>) {
  const { data, error } = await client.auth.getUser();

  if (error) {
    throw redirectToSignIn();
  }

  if (!data.user) {
    throw redirectToSignIn();
  }

  const appMetadata = data.user.app_metadata;

  const isSuperAdmin = appMetadata?.role === 'super-admin';

  if (!isSuperAdmin) {
    throw redirectToSignIn();
  }

  return data.user;
}

function redirectToSignIn() {
  return redirect('/auth/sign-in');
}

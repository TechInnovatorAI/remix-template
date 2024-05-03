import { SupabaseClient } from '@supabase/supabase-js';

import { Database } from '@kit/supabase/database';

/**
 * @name getSuperAdminUser
 * @description Check if the current user is a super admin and return the user.
 * @param client
 */
export async function getSuperAdminUser(client: SupabaseClient<Database>) {
  const { data, error } = await client.auth.getUser();

  if (error) {
    throw error;
  }

  if (!data.user) {
    throw new Error('User not found');
  }

  const appMetadata = data.user.app_metadata;

  const isSuperAdmin = appMetadata?.role === 'super-admin';

  if (!isSuperAdmin) {
    throw new Error('User is not a super admin');
  }

  return data.user;
}

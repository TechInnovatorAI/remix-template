import { createClient } from '@supabase/supabase-js';

import { Database } from '../database.types';
import {
  getServiceRoleKey,
  warnServiceRoleKeyUsage,
} from '../get-service-role-key';
import { getSupabaseClientKeys } from '../get-supabase-client-keys';

const serviceRoleKey = getServiceRoleKey();
const keys = getSupabaseClientKeys();

/**
 * @name getSupabaseServerClient
 * @description Get a Supabase client for use in server-side functions as an admin.
 */
export function getSupabaseServerAdminClient<GenericSchema = Database>() {
  warnServiceRoleKeyUsage();

  return createClient<GenericSchema>(keys.url, serviceRoleKey, {
    auth: {
      persistSession: false,
      detectSessionInUrl: false,
      autoRefreshToken: false,
    },
  });
}

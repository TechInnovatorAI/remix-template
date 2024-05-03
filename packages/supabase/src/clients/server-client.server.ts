

import {
  CookieOptions,
  createServerClient,
  parse,
  serialize,
} from '@supabase/ssr';

import { Database } from '../database.types';

import { getSupabaseClientKeys } from '../get-supabase-client-keys';

const keys = getSupabaseClientKeys();

/**
 * @name getSupabaseServerClient
 * @description Get a Supabase client for use in server-side functions.
 */
export function getSupabaseServerClient<
  GenericSchema = Database,
>(request: Request) {
  const headers = request.headers || new Headers();

  const setCookieHeader = (
    key: string,
    value: string,
    options: CookieOptions,
  ) => {
    headers.append('Set-Cookie', serialize(key, value, options));
  };

  const cookies = parse(request.headers.get('Cookie') ?? '');

  const cookiesAdapter = {
    get(key: string) {
      return cookies[key];
    },
    set: setCookieHeader,
    remove(key: string, options: CookieOptions) {
      setCookieHeader(key, '', options);
    },
  };

  return createServerClient<GenericSchema>(keys.url, keys.anonKey, {
    cookies: cookiesAdapter,
  });
}

'use client';

import { useEffect } from 'react';

import type { AuthChangeEvent, Session } from '@supabase/supabase-js';

import { useLocation } from '@remix-run/react';

import { useSupabase } from './use-supabase';

/**
 * @name PRIVATE_PATH_PREFIXES
 * @description A list of private path prefixes
 */
const PRIVATE_PATH_PREFIXES = ['/home', '/admin', '/join', '/update-password'];

/**
 * @name useAuthChangeListener
 * @param privatePathPrefixes
 * @param appHomePath
 * @param onEvent
 */
export function useAuthChangeListener({
  privatePathPrefixes = PRIVATE_PATH_PREFIXES,
  appHomePath,
  onEvent,
}: {
  appHomePath: string;
  privatePathPrefixes?: string[];
  onEvent?: (event: AuthChangeEvent, user: Session | null) => void;
}) {
  const client = useSupabase();
  const pathName = useLocation().pathname;

  useEffect(() => {
    // keep this running for the whole session unless the component was unmounted
    const listener = client.auth.onAuthStateChange((event, user) => {
      if (onEvent) {
        onEvent(event, user);
      }

      // log user out if user is falsy
      // and if the current path is a private route
      const shouldRedirectUser =
        !user && isPrivateRoute(pathName, privatePathPrefixes);

      if (shouldRedirectUser) {
        // send user away when signed out
        window.location.assign('/');

        return;
      }

      // revalidate user session when user signs in or out
      if (event === 'SIGNED_OUT') {
        window.location.reload();
      }
    });

    // destroy listener on un-mounts
    return () => listener.data.subscription.unsubscribe();
  }, [client.auth, pathName, appHomePath, privatePathPrefixes, onEvent]);
}

/**
 * Determines if a given path is a private route.
 */
function isPrivateRoute(path: string, privatePathPrefixes: string[]) {
  return privatePathPrefixes.some((prefix) => path.startsWith(prefix));
}

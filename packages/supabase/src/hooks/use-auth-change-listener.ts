'use client';

import { useEffect } from 'react';

import { useLocation, useNavigate } from '@remix-run/react';
import { useQueryClient } from '@tanstack/react-query';

import { useSupabase } from './use-supabase';
import { useRevalidateUserSession, useUserSession } from './use-user-session';

/**
 * @name PRIVATE_PATH_PREFIXES
 * @description A list of private path prefixes
 */
const PRIVATE_PATH_PREFIXES = ['/home', '/admin', '/join', '/update-password'];

/**
 * @name useAuthChangeListener
 * @param privatePathPrefixes
 * @param appHomePath
 */
export function useAuthChangeListener({
  privatePathPrefixes = PRIVATE_PATH_PREFIXES,
  appHomePath,
}: {
  appHomePath: string;
  privatePathPrefixes?: string[];
}) {
  const client = useSupabase();
  const navigate = useNavigate();
  const pathName = useLocation().pathname;

  const revalidateUserSession = useRevalidateUserSession();
  const session = useUserSession();
  const queryClient = useQueryClient();
  const accessToken = session.data?.access_token;

  useEffect(() => {
    // keep this running for the whole session unless the component was unmounted
    const listener = client.auth.onAuthStateChange(async (event, user) => {
      // log user out if user is falsy
      // and if the current path is a private route
      const shouldRedirectUser =
        !user && isPrivateRoute(pathName, privatePathPrefixes);

      if (shouldRedirectUser) {
        // send user away when signed out
        window.location.assign('/');

        return;
      }

      const refresh = () => navigate('.', { replace: true });

      // revalidate user session when user signs in or out
      if (event === 'SIGNED_OUT') {
        queryClient.invalidateQueries();

        return refresh();
      }

      // revalidate user session when access token is out of sync
      if (accessToken) {
        const isOutOfSync = user?.access_token !== accessToken;

        if (isOutOfSync) {
          void refresh();
        }
      }
    });

    // destroy listener on un-mounts
    return () => listener.data.subscription.unsubscribe();
  }, [
    queryClient,
    client.auth,
    accessToken,
    revalidateUserSession,
    pathName,
    appHomePath,
    privatePathPrefixes,
    navigate,
  ]);
}

/**
 * Determines if a given path is a private route.
 */
function isPrivateRoute(path: string, privatePathPrefixes: string[]) {
  return privatePathPrefixes.some((prefix) => path.startsWith(prefix));
}

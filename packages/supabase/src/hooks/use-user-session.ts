import { useCallback } from 'react';

import type { Session } from '@supabase/supabase-js';

import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';

import { useSupabase } from './use-supabase';

const queryKey = ['supabase:session'];

export function useUserSession(initialSession?: Session | null) {
  const supabase = useSupabase();

  const queryFn = async () => {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      throw error;
    }

    return data.session;
  };

  return useSuspenseQuery({
    queryKey,
    queryFn,
    initialData: initialSession,
  });
}

export function useRevalidateUserSession() {
  const client = useQueryClient();

  return useCallback(
    () =>
      client.invalidateQueries({
        queryKey,
      }),
    [client],
  );
}

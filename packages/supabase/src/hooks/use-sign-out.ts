import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useSupabase } from './use-supabase';

export function useSignOut() {
  const client = useSupabase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await client.auth.signOut();
      await queryClient.invalidateQueries();
    },
  });
}

import { useQuery } from '@tanstack/react-query';

import { useSupabase } from './use-supabase';
import { useFactorsMutationKey } from './use-user-factors-mutation-key';

function useFetchAuthFactors() {
  const client = useSupabase();
  const queryKey = useFactorsMutationKey();

  const queryFn = async () => {
    const { data, error } = await client.auth.mfa.listFactors();

    if (error) {
      throw error;
    }

    return data;
  };

  return useQuery({
    queryKey,
    queryFn,
  });
}

export default useFetchAuthFactors;

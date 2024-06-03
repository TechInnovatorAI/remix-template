import { useCallback, useEffect } from 'react';

import { useQuery, useQueryClient } from '@tanstack/react-query';

import { useSupabase } from '@kit/supabase/hooks/use-supabase';

interface PartialAccount {
  id: string | null;
  name: string | null;
  picture_url: string | null;
}

const createQueryKey = (userId: string) => ['account:data', userId];

export function usePreloadPersonalAccountDataQuery(
  userId: string,
  account: PartialAccount | undefined,
) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!account) {
      return;
    }

    queryClient.setQueryData(createQueryKey(userId), account);
  }, [account, queryClient, userId]);
}

export function usePersonalAccountData(
  userId: string,
  partialAccount?:
    | {
        id: string | null;
        name: string | null;
        picture_url: string | null;
      }
    | undefined,
) {
  const client = useSupabase();
  const queryKey = createQueryKey(userId);

  const queryFn = async () => {
    if (!userId) {
      return null;
    }

    const response = await client
      .from('accounts')
      .select(
        `
        id,
        name,
        picture_url
    `,
      )
      .eq('primary_owner_user_id', userId)
      .eq('is_personal_account', true)
      .single();

    if (response.error) {
      throw response.error;
    }

    return response.data;
  };

  return useQuery({
    queryKey,
    queryFn,
    enabled: !!userId,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    initialData: partialAccount?.id
      ? {
          id: partialAccount.id,
          name: partialAccount.name,
          picture_url: partialAccount.picture_url,
        }
      : undefined,
  });
}

export function useRevalidatePersonalAccountDataQuery() {
  const queryClient = useQueryClient();

  return useCallback(
    (userId: string) =>
      queryClient.invalidateQueries({
        queryKey: createQueryKey(userId)
      }),
    [queryClient],
  );
}

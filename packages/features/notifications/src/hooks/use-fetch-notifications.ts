import { useEffect } from 'react';

import { useQuery } from '@tanstack/react-query';

import { useSupabase } from '@kit/supabase/hooks/use-supabase';

import { useNotificationsStream } from './use-notifications-stream';

type Notification = {
  id: number;
  body: string;
  dismissed: boolean;
  type: 'info' | 'warning' | 'error';
  created_at: string;
  link: string | null;
};

export function useFetchNotifications({
  onNotifications,
  accountIds,
  realtime,
}: {
  onNotifications: (notifications: Notification[]) => unknown;
  accountIds: string[];
  realtime: boolean;
}) {
  const { data: initialNotifications } = useFetchInitialNotifications({
    accountIds,
  });

  useNotificationsStream({
    onNotifications,
    accountIds,
    enabled: realtime,
  });

  useEffect(() => {
    if (initialNotifications) {
      onNotifications(initialNotifications);
    }
  }, [initialNotifications, onNotifications]);
}

function useFetchInitialNotifications(props: { accountIds: string[] }) {
  const client = useSupabase();
  const now = new Date().toISOString();

  return useQuery({
    queryKey: ['notifications', ...props.accountIds],
    queryFn: async () => {
      const { data } = await client
        .from('notifications')
        .select(
          `id, 
           body, 
           dismissed, 
           type, 
           created_at, 
           link
           `,
        )
        .in('account_id', props.accountIds)
        .eq('dismissed', false)
        .gt('expires_at', now)
        .order('created_at', { ascending: false })
        .limit(10);

      return data;
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}

'use client';

import { useCallback } from 'react';

import { useMonitoring } from '@kit/monitoring/hooks';
import { useAppEvents } from '@kit/shared/events';
import { useAuthChangeListener } from '@kit/supabase/hooks/use-auth-change-listener';

import pathsConfig from '~/config/paths.config';

export function AuthProvider(props: React.PropsWithChildren) {
  const dispatchEvent = useDispatchAppEventFromAuthEvent();

  useAuthChangeListener({
    appHomePath: pathsConfig.app.home,
    onEvent: (event, session) => {
      dispatchEvent(event, session?.user.id, {
        email: session?.user.email ?? '',
      });
    },
  });

  return props.children;
}

function useDispatchAppEventFromAuthEvent() {
  const { emit } = useAppEvents();
  const monitoring = useMonitoring();

  return useCallback(
    (
      type: string,
      userId: string | undefined,
      traits: Record<string, string> = {},
    ) => {
      switch (type) {
        case 'SIGNED_IN':
          if (userId) {
            emit({
              type: 'user.signedIn',
              payload: { userId, ...traits },
            });

            monitoring.identifyUser({ id: userId, ...traits });
          }

          break;

        case 'USER_UPDATED':
          emit({
            type: 'user.updated',
            payload: { userId: userId!, ...traits },
          });

          break;
      }
    },
    [emit, monitoring],
  );
}

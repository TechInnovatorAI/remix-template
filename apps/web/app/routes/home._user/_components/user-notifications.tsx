import { NotificationsPopover } from '@kit/notifications/components';

import featuresFlagConfig from '~/config/feature-flags.config';

export function UserNotifications(props: { userId: string }) {
  if (!featuresFlagConfig.enableNotifications) {
    return null;
  }

  return (
    <NotificationsPopover
      accountIds={[props.userId]}
      realtime={featuresFlagConfig.realtimeNotifications}
    />
  );
}

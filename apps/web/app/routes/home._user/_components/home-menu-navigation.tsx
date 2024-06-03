import {
  BorderedNavigationMenu,
  BorderedNavigationMenuItem,
} from '@kit/ui/bordered-navigation-menu';

import { AppLogo } from '~/components/app-logo';
import { ProfileAccountDropdownContainer } from '~/components/personal-account-dropdown-container';
import pathsConfig from '~/config/paths.config';
import { personalAccountNavigationConfig } from '~/config/personal-account-navigation.config';
import { UserWorkspace } from '~/routes/home._user/_lib/load-user-workspace.server';

// home imports
import { HomeAccountSelector } from '../_components/home-account-selector';
import { UserNotifications } from '../_components/user-notifications';

export function HomeMenuNavigation(props: { workspace: UserWorkspace }) {
  const { workspace, user, accounts } = props.workspace;

  const routes = personalAccountNavigationConfig.routes.reduce<
    Array<{
      path: string;
      label: string;
      Icon?: React.ReactNode;
      end?: boolean | ((path: string) => boolean);
    }>
  >((acc, item) => {
    if ('children' in item) {
      return [...acc, ...item.children];
    }

    if ('divider' in item) {
      return acc;
    }

    return [...acc, item];
  }, []);

  return (
    <div className={'flex w-full flex-1 justify-between'}>
      <div className={'flex items-center space-x-8'}>
        <AppLogo href={pathsConfig.app.home} />

        <BorderedNavigationMenu>
          {routes.map((route) => (
            <BorderedNavigationMenuItem {...route} key={route.path} />
          ))}
        </BorderedNavigationMenu>
      </div>

      <div className={'flex justify-end space-x-2.5'}>
        <HomeAccountSelector
          userId={user.id}
          accounts={accounts}
          collapsed={false}
        />

        <UserNotifications userId={user.id} />

        <ProfileAccountDropdownContainer
          collapsed={true}
          user={user}
          account={workspace}
        />
      </div>
    </div>
  );
}

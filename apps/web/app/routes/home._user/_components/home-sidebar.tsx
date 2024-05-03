import { If } from '@kit/ui/if';
import { Sidebar, SidebarContent, SidebarNavigation } from '@kit/ui/sidebar';

import { AppLogo } from '~/components/app-logo';
import { ProfileAccountDropdownContainer } from '~/components/personal-account-dropdown-container';
import featuresFlagConfig from '~/config/feature-flags.config';
import { personalAccountNavigationConfig } from '~/config/personal-account-navigation.config';

// home imports
import { HomeAccountSelector } from './home-account-selector';
import {UserNotifications} from "~/routes/home._user/_components/user-notifications";
import {UserWorkspace} from "~/routes/home._user/_lib/load-user-workspace.server";

export function HomeSidebar(props: { workspace: UserWorkspace }) {
  const { workspace, user, accounts } = props.workspace;

  return (
    <Sidebar>
      <SidebarContent className={'h-16 justify-center'}>
        <div className={'flex items-center justify-between space-x-2'}>
          <If
            condition={featuresFlagConfig.enableTeamAccounts}
            fallback={<AppLogo className={'py-2'} />}
          >
            <HomeAccountSelector collapsed={false} accounts={accounts} />
          </If>

          <UserNotifications userId={user.id} />
        </div>
      </SidebarContent>

      <SidebarContent className={`mt-5 h-[calc(100%-160px)] overflow-y-auto`}>
        <SidebarNavigation config={personalAccountNavigationConfig} />
      </SidebarContent>

      <div className={'absolute bottom-4 left-0 w-full'}>
        <SidebarContent>
          <ProfileAccountDropdownContainer
            collapsed={false}
            user={user}
            account={workspace}
          />
        </SidebarContent>
      </div>
    </Sidebar>
  );
}

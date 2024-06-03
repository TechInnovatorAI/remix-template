import { User } from '@supabase/supabase-js';

import { ArrowLeftCircle, ArrowRightCircle } from 'lucide-react';

import { If } from '@kit/ui/if';
import { Sidebar, SidebarContent } from '@kit/ui/sidebar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@kit/ui/tooltip';
import { Trans } from '@kit/ui/trans';
import { cn } from '@kit/ui/utils';

import { ProfileAccountDropdownContainer } from '~/components//personal-account-dropdown-container';
import { TeamAccountNotifications } from '~/routes/home.$account/_components/team-account-notifications';

import { TeamAccountAccountsSelector } from '../_components/team-account-accounts-selector';
import { TeamAccountLayoutSidebarNavigation } from './team-account-layout-sidebar-navigation';

type AccountModel = {
  label: string | null;
  value: string | null;
  image: string | null;
};

export function TeamAccountLayoutSidebar(props: {
  account: string;
  accountId: string;
  accounts: AccountModel[];
  collapsed: boolean;
  user: User;
}) {
  return (
    <Sidebar collapsed={props.collapsed}>
      {({ collapsed, setCollapsed }) => (
        <SidebarContainer
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          account={props.account}
          accountId={props.accountId}
          accounts={props.accounts}
          user={props.user}
        />
      )}
    </Sidebar>
  );
}

function SidebarContainer(props: {
  account: string;
  accountId: string;
  accounts: AccountModel[];
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  collapsible?: boolean;
  user: User;
}) {
  const { account, accounts } = props;

  return (
    <>
      <SidebarContent className={'h-16 justify-center'}>
        <div
          className={'flex max-w-full items-center justify-between space-x-4'}
        >
          <TeamAccountAccountsSelector
            userId={props.user.id}
            selectedAccount={account}
            accounts={accounts}
          />

          <TeamAccountNotifications
            userId={props.user.id}
            accountId={props.accountId}
          />
        </div>
      </SidebarContent>

      <SidebarContent className={`mt-5 h-[calc(100%-160px)] overflow-y-auto`}>
        <TeamAccountLayoutSidebarNavigation account={account} />
      </SidebarContent>

      <div className={'absolute bottom-4 left-0 w-full'}>
        <SidebarContent>
          <ProfileAccountDropdownContainer
            user={props.user}
            collapsed={props.collapsed}
          />

          <If condition={props.collapsible}>
            <AppSidebarFooterMenu
              collapsed={props.collapsed}
              setCollapsed={props.setCollapsed}
            />
          </If>
        </SidebarContent>
      </div>
    </>
  );
}

function AppSidebarFooterMenu(props: {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}) {
  return (
    <CollapsibleButton
      collapsed={props.collapsed}
      onClick={props.setCollapsed}
    />
  );
}

function CollapsibleButton({
  collapsed,
  onClick,
}: React.PropsWithChildren<{
  collapsed: boolean;
  onClick: (collapsed: boolean) => void;
}>) {
  const className = cn(
    `bg-background absolute -right-[10.5px] bottom-4 cursor-pointer block`,
  );

  const iconClassName = 'bg-background text-muted-foreground h-5 w-5';

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          className={className}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          onClick={() => onClick(!collapsed)}
        >
          <ArrowRightCircle
            className={cn(iconClassName, {
              hidden: !collapsed,
            })}
          />

          <ArrowLeftCircle
            className={cn(iconClassName, {
              hidden: collapsed,
            })}
          />
        </TooltipTrigger>

        <TooltipContent sideOffset={20}>
          <Trans
            i18nKey={
              collapsed ? 'common:expandSidebar' : 'common:collapseSidebar'
            }
          />
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

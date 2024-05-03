import { Link, useNavigate } from '@remix-run/react';
import { Home, LogOut, Menu } from 'lucide-react';

import { AccountSelector } from '@kit/accounts/account-selector';
import { useSignOut } from '@kit/supabase/hooks/use-sign-out';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@kit/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@kit/ui/dropdown-menu';
import { Trans } from '@kit/ui/trans';

import featureFlagsConfig from '~/config/feature-flags.config';
import pathsConfig from '~/config/paths.config';
import { getTeamAccountSidebarConfig } from '~/config/team-account-navigation.config';

type Accounts = Array<{
  label: string | null;
  value: string | null;
  image: string | null;
}>;

const features = {
  enableTeamAccounts: featureFlagsConfig.enableTeamAccounts,
  enableTeamCreation: featureFlagsConfig.enableTeamCreation,
};

export const TeamAccountLayoutMobileNavigation = (
  props: React.PropsWithChildren<{
    account: string;
    accounts: Accounts;
  }>,
) => {
  const signOut = useSignOut();

  const Links = getTeamAccountSidebarConfig(props.account).routes.map(
    (item, index) => {
      if ('children' in item) {
        return item.children.map((child) => {
          return (
            <DropdownLink
              key={child.path}
              Icon={child.Icon}
              path={child.path}
              label={child.label}
            />
          );
        });
      }

      if ('divider' in item) {
        return <DropdownMenuSeparator key={index} />;
      }

      return (
        <DropdownLink
          key={item.path}
          Icon={item.Icon}
          path={item.path}
          label={item.label}
        />
      );
    },
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Menu className={'h-9'} />
      </DropdownMenuTrigger>

      <DropdownMenuContent sideOffset={10} className={'w-screen rounded-none'}>
        <TeamAccountsModal accounts={props.accounts} />

        {Links}

        <DropdownMenuSeparator />

        <SignOutDropdownItem onSignOut={() => signOut.mutateAsync()} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

function DropdownLink(
  props: React.PropsWithChildren<{
    path: string;
    label: string;
    Icon: React.ReactNode;
  }>,
) {
  return (
    <DropdownMenuItem asChild>
      <Link
        to={props.path}
        className={'flex h-12 w-full items-center space-x-2 px-3'}
      >
        {props.Icon}

        <span>
          <Trans i18nKey={props.label} defaults={props.label} />
        </span>
      </Link>
    </DropdownMenuItem>
  );
}

function SignOutDropdownItem(
  props: React.PropsWithChildren<{
    onSignOut: () => unknown;
  }>,
) {
  return (
    <DropdownMenuItem
      className={'flex h-12 w-full items-center space-x-2'}
      onClick={props.onSignOut}
    >
      <LogOut className={'h-4'} />

      <span>
        <Trans i18nKey={'common:signOut'} />
      </span>
    </DropdownMenuItem>
  );
}

function TeamAccountsModal(props: { accounts: Accounts }) {
  const navigate = useNavigate();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <DropdownMenuItem
          className={'flex h-12 w-full items-center space-x-2'}
          onSelect={(e) => e.preventDefault()}
        >
          <Home className={'h-4'} />

          <span>
            <Trans i18nKey={'common:yourAccounts'} />
          </span>
        </DropdownMenuItem>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <Trans i18nKey={'common:yourAccounts'} />
          </DialogTitle>
        </DialogHeader>

        <div className={'py-16'}>
          <AccountSelector
            className={'w-full max-w-full'}
            onAccountChange={(value) => {
              const path = value
                ? pathsConfig.app.accountHome.replace('[account]', value)
                : pathsConfig.app.home;

              navigate(path, {
                replace: true,
              });
            }}
            accounts={props.accounts}
            features={features}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

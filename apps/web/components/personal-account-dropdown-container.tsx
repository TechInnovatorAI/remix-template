'use client';

import type { User } from '@supabase/supabase-js';

import { PersonalAccountDropdown } from '@kit/accounts/personal-account-dropdown';
import { useSignOut } from '@kit/supabase/hooks/use-sign-out';
import { useUser } from '@kit/supabase/hooks/use-user';

import featuresFlagConfig from '~/config/feature-flags.config';
import pathsConfig from '~/config/paths.config';

const paths = {
  home: pathsConfig.app.home,
};

const features = {
  enableThemeToggle: featuresFlagConfig.enableThemeToggle,
};

export function ProfileAccountDropdownContainer(props: {
  collapsed: boolean;
  user: User | null;

  account?: {
    id: string | null;
    name: string | null;
    picture_url: string | null;
  };
}) {
  const signOut = useSignOut();
  const user = useUser(props.user);
  const userData = user.data ?? props.user ?? null;

  return (
    <div className={props.collapsed ? '' : 'w-full'}>
      <PersonalAccountDropdown
        className={'w-full'}
        paths={paths}
        features={features}
        showProfileName={!props.collapsed}
        user={userData}
        account={props.account}
        signOutRequested={() => signOut.mutateAsync()}
      />
    </div>
  );
}

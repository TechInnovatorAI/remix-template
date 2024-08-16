import { User } from '@supabase/supabase-js';

import { BadgeX, Ban, ShieldPlus, VenetianMask } from 'lucide-react';

import { Tables } from '@kit/supabase/database';
import { AppBreadcrumbs } from '@kit/ui/app-breadcrumbs';
import { Badge } from '@kit/ui/badge';
import { Button } from '@kit/ui/button';
import { Heading } from '@kit/ui/heading';
import { If } from '@kit/ui/if';
import { ProfileAvatar } from '@kit/ui/profile-avatar';

import { AdminBanUserDialog } from './admin-ban-user-dialog';
import { AdminDeleteUserDialog } from './admin-delete-user-dialog';
import { AdminImpersonateUserDialog } from './admin-impersonate-user-dialog';
import { AdminMembershipsTable } from './admin-memberships-table';
import { AdminReactivateUserDialog } from './admin-reactivate-user-dialog';
import { AdminSubscriptionTable } from './admin-subscription-table';

type Membership = Tables<'accounts_memberships'> & {
  account: {
    id: string;
    name: string;
  };
};

export function AdminPersonalAccountPage(props: {
  user: User;

  account: {
    id: string;
    name: string;
    picture_url: string;
    email: string;
  };

  memberships: Membership[];
  subscription:
    | (Tables<'subscriptions'> & {
        subscription_items: Tables<'subscription_items'>[];
      })
    | null;
}) {
  const isBanned =
    'banned_until' in props.user && props.user.banned_until !== 'none';

  return (
    <div className={'flex flex-col space-y-4'}>
      <AppBreadcrumbs
        values={{
          [props.account.id]:
            props.account.name ?? props.account.email ?? 'Account',
        }}
      />

      <div className={'flex items-center justify-between'}>
        <div className={'flex items-center space-x-4'}>
          <div className={'flex items-center space-x-2.5'}>
            <ProfileAvatar
              pictureUrl={props.account.picture_url}
              displayName={props.account.name}
            />

            <span>{props.account.name}</span>
          </div>

          <Badge variant={'outline'}>Personal Account</Badge>

          <If condition={isBanned}>
            <Badge variant={'destructive'}>Banned</Badge>
          </If>
        </div>

        <div className={'flex space-x-1'}>
          <If condition={isBanned}>
            <AdminReactivateUserDialog userId={props.account.id}>
              <Button size={'sm'} variant={'ghost'}>
                <ShieldPlus className={'mr-1 h-4'} />
                Reactivate
              </Button>
            </AdminReactivateUserDialog>
          </If>

          <If condition={!isBanned}>
            <AdminBanUserDialog userId={props.account.id}>
              <Button size={'sm'} variant={'ghost'}>
                <Ban className={'mr-1 h-4'} />
                Ban
              </Button>
            </AdminBanUserDialog>

            <AdminImpersonateUserDialog userId={props.account.id}>
              <Button size={'sm'} variant={'ghost'}>
                <VenetianMask className={'mr-1 h-4'} />
                Impersonate
              </Button>
            </AdminImpersonateUserDialog>
          </If>

          <AdminDeleteUserDialog userId={props.account.id}>
            <Button size={'sm'} variant={'destructive'}>
              <BadgeX className={'mr-1 h-4'} />
              Delete
            </Button>
          </AdminDeleteUserDialog>
        </div>
      </div>

      <div className={'flex flex-col space-y-8'}>
        <AdminSubscriptionTable subscription={props.subscription} />

        <div className={'divider-divider-x flex flex-col space-y-2.5'}>
          <Heading level={6}>Teams</Heading>

          <div>
            <AdminMembershipsTable memberships={props.memberships} />
          </div>
        </div>
      </div>
    </div>
  );
}

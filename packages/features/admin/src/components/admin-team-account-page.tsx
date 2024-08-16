import { BadgeX } from 'lucide-react';

import { Database, Tables } from '@kit/supabase/database';
import { AppBreadcrumbs } from '@kit/ui/app-breadcrumbs';
import { Badge } from '@kit/ui/badge';
import { Button } from '@kit/ui/button';
import { Heading } from '@kit/ui/heading';
import { ProfileAvatar } from '@kit/ui/profile-avatar';

import { AdminDeleteAccountDialog } from './admin-delete-account-dialog';
import { AdminMembersTable } from './admin-members-table';
import { AdminSubscriptionTable } from './admin-subscription-table';

type Account = Tables<'accounts'>;
type Members =
  Database['public']['Functions']['get_account_members']['Returns'];

type Subscription = Tables<'subscriptions'> & {
  subscription_items: Tables<'subscription_items'>[];
};

export function AdminTeamAccountPage(props: {
  account: Account;
  subscription: Subscription | null;
  members: Members;
}) {
  return (
    <div className={'flex flex-col space-y-4'}>
      <AppBreadcrumbs
        values={{
          [props.account.id]: props.account.name ?? 'Account',
        }}
      />

      <div className={'flex justify-between'}>
        <div className={'flex items-center space-x-4'}>
          <div className={'flex items-center space-x-2.5'}>
            <ProfileAvatar
              pictureUrl={props.account.picture_url}
              displayName={props.account.name}
            />

            <span>{props.account.name}</span>
          </div>

          <Badge variant={'outline'}>Team Account</Badge>
        </div>

        <AdminDeleteAccountDialog accountId={props.account.id}>
          <Button size={'sm'} variant={'destructive'}>
            <BadgeX className={'mr-1 h-4'} />
            Delete
          </Button>
        </AdminDeleteAccountDialog>
      </div>

      <div>
        <div className={'flex flex-col space-y-8'}>
          <AdminSubscriptionTable subscription={props.subscription} />

          <div className={'flex flex-col space-y-2.5'}>
            <Heading level={6}>Team Members</Heading>

            <AdminMembersTable members={props.members} />
          </div>
        </div>
      </div>
    </div>
  );
}

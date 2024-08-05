import { useState } from 'react';

import { Link } from '@remix-run/react';

import { CreateTeamAccountDialog } from '@kit/team-accounts/components';
import { Button } from '@kit/ui/button';
import {
  CardButton,
  CardButtonHeader,
  CardButtonTitle,
} from '@kit/ui/card-button';
import {
  EmptyState,
  EmptyStateButton,
  EmptyStateHeading,
  EmptyStateText,
} from '@kit/ui/empty-state';
import { Trans } from '@kit/ui/trans';

import { UserWorkspace } from '../_lib/load-user-workspace.server';

export function HomeAccountsList({
  accounts,
}: {
  accounts: UserWorkspace['accounts'];
}) {
  if (!accounts.length) {
    return <HomeAccountsListEmptyState />;
  }

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {accounts.map((account) => (
          <CardButton key={account.value} asChild>
            <Link to={`/home/${account.value}`}>
              <CardButtonHeader>
                <CardButtonTitle>{account.label}</CardButtonTitle>
              </CardButtonHeader>
            </Link>
          </CardButton>
        ))}
      </div>
    </div>
  );
}

function HomeAccountsListEmptyState() {
  return (
    <div className={'flex flex-1'}>
      <EmptyState>
        <EmptyStateButton asChild>
          <HomeAddAccountButton className={'mt-4'} />
        </EmptyStateButton>
        <EmptyStateHeading>
          <Trans i18nKey={'account:noTeamsYet'} />
        </EmptyStateHeading>
        <EmptyStateText>
          <Trans i18nKey={'account:createTeam'} />
        </EmptyStateText>
      </EmptyState>
    </div>
  );
}

function HomeAddAccountButton(props: { className?: string }) {
  const [isAddingAccount, setIsAddingAccount] = useState(false);

  return (
    <>
      <Button
        className={props.className}
        size="sm"
        onClick={() => setIsAddingAccount(true)}
      >
        <Trans i18nKey={'account:createTeamButtonLabel'} />
      </Button>

      <CreateTeamAccountDialog
        isOpen={isAddingAccount}
        setIsOpen={setIsAddingAccount}
      />
    </>
  );
}

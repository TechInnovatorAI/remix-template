import { useState } from 'react';

import { Link } from '@remix-run/react';

import { CreateTeamAccountDialog } from '@kit/team-accounts/components';
import { Button } from '@kit/ui/button';
import {
  CardButton,
  CardButtonHeader,
  CardButtonTitle,
} from '@kit/ui/card-button';
import { Heading } from '@kit/ui/heading';
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
    <div className="flex flex-col items-center justify-center space-y-8 py-24">
      <div className="flex flex-col items-center space-y-1">
        <Heading level={2}>
          <Trans i18nKey={'account:noTeamsYet'} />
        </Heading>

        <Heading
          className="text-muted-foreground font-sans font-medium"
          level={4}
        >
          <Trans i18nKey={'account:createTeam'} />
        </Heading>
      </div>

      <HomeAddAccountButton />
    </div>
  );
}

function HomeAddAccountButton() {
  const [isAddingAccount, setIsAddingAccount] = useState(false);

  return (
    <>
      <Button size="sm" onClick={() => setIsAddingAccount(true)}>
        <Trans i18nKey={'account:createTeamButtonLabel'} />
      </Button>

      <CreateTeamAccountDialog
        isOpen={isAddingAccount}
        setIsOpen={setIsAddingAccount}
      />
    </>
  );
}

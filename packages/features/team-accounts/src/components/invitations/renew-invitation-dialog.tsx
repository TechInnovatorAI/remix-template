import { useEffect, useState } from 'react';

import { useFetcher } from '@remix-run/react';

import { Alert, AlertDescription, AlertTitle } from '@kit/ui/alert';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@kit/ui/alert-dialog';
import { Button } from '@kit/ui/button';
import { If } from '@kit/ui/if';
import { Trans } from '@kit/ui/trans';

export const RenewInvitationDialog: React.FC<{
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  invitationId: number;
  email: string;
}> = ({ isOpen, setIsOpen, invitationId, email }) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <Trans i18nKey="team:renewInvitation" />
          </AlertDialogTitle>

          <AlertDialogDescription>
            <Trans
              i18nKey="team:renewInvitationDialogDescription"
              values={{ email }}
            />
          </AlertDialogDescription>
        </AlertDialogHeader>

        <RenewInvitationForm
          setIsOpen={setIsOpen}
          invitationId={invitationId}
        />
      </AlertDialogContent>
    </AlertDialog>
  );
};

function RenewInvitationForm({
  invitationId,
  setIsOpen,
}: {
  invitationId: number;
  setIsOpen: (isOpen: boolean) => void;
}) {
  const fetcher = useFetcher<{
    success: boolean;
  }>();

  const pending = fetcher.state === 'submitting';

  const [error, setError] = useState<boolean>();

  useEffect(() => {
    if (fetcher.data && fetcher.data.success) {
      setIsOpen(false);
    }

    if (fetcher.data && fetcher.data.success) {
      setError(true);
    }
  }, [fetcher.data, setIsOpen]);

  const inInvitationRenewed = () => {
    fetcher.submit(
      {
        intent: 'renew-invitation',
        payload: { invitationId },
      },
      {
        method: 'POST',
        encType: 'application/json',
      },
    );
  };

  return (
    <form onSubmit={inInvitationRenewed}>
      <div className={'flex flex-col space-y-6'}>
        <p className={'text-muted-foreground text-sm'}>
          <Trans i18nKey={'common:modalConfirmationQuestion'} />
        </p>

        <If condition={error}>
          <RenewInvitationErrorAlert />
        </If>

        <AlertDialogFooter>
          <AlertDialogCancel>
            <Trans i18nKey={'common:cancel'} />
          </AlertDialogCancel>

          <Button data-test={'confirm-renew-invitation'} disabled={pending}>
            <Trans i18nKey={'teams:renewInvitation'} />
          </Button>
        </AlertDialogFooter>
      </div>
    </form>
  );
}

function RenewInvitationErrorAlert() {
  return (
    <Alert variant={'destructive'}>
      <AlertTitle>
        <Trans i18nKey={'teams:renewInvitationErrorTitle'} />
      </AlertTitle>

      <AlertDescription>
        <Trans i18nKey={'teams:renewInvitationErrorDescription'} />
      </AlertDescription>
    </Alert>
  );
}

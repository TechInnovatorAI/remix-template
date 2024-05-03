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

export const RemoveMemberDialog: React.FC<{
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  teamAccountId: string;
  userId: string;
}> = ({ isOpen, setIsOpen, teamAccountId, userId }) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <Trans i18nKey="teamS:removeMemberModalHeading" />
          </AlertDialogTitle>

          <AlertDialogDescription>
            <Trans i18nKey={'teams:removeMemberModalDescription'} />
          </AlertDialogDescription>
        </AlertDialogHeader>

        <RemoveMemberForm
          setIsOpen={setIsOpen}
          accountId={teamAccountId}
          userId={userId}
        />
      </AlertDialogContent>
    </AlertDialog>
  );
};

function RemoveMemberForm({
  accountId,
  userId,
  setIsOpen,
}: {
  accountId: string;
  userId: string;
  setIsOpen: (isOpen: boolean) => void;
}) {
  const [error, setError] = useState<boolean>();

  const fetcher = useFetcher<{
    success: boolean;
  }>();

  const pending = fetcher.state === 'submitting';

  useEffect(() => {
    if (fetcher.data) {
      if (fetcher.data.success) {
        setIsOpen(false);
      } else {
        setError(true);
      }
    }
  }, []);

  const onMemberRemoved = () => {
    fetcher.submit({
      intent: 'remove-member',
      payload: {
        accountId,
        userId,
      },
    }, {
      method: 'POST',
      encType: 'application/json',
    });
  };

  return (
    <form action={onMemberRemoved}>
      <div className={'flex flex-col space-y-6'}>
        <p className={'text-muted-foreground text-sm'}>
          <Trans i18nKey={'common:modalConfirmationQuestion'} />
        </p>

        <If condition={error}>
          <RemoveMemberErrorAlert />
        </If>

        <AlertDialogFooter>
          <AlertDialogCancel>
            <Trans i18nKey={'common:cancel'} />
          </AlertDialogCancel>

          <Button
            data-test={'confirm-remove-member'}
            variant={'destructive'}
            disabled={pending}
            onClick={onMemberRemoved}
          >
            <Trans i18nKey={'teams:removeMemberSubmitLabel'} />
          </Button>
        </AlertDialogFooter>
      </div>
    </form>
  );
}

function RemoveMemberErrorAlert() {
  return (
    <Alert variant={'destructive'}>
      <AlertTitle>
        <Trans i18nKey={'teams:removeMemberErrorHeading'} />
      </AlertTitle>

      <AlertDescription>
        <Trans i18nKey={'teams:removeMemberErrorMessage'} />
      </AlertDescription>
    </Alert>
  );
}

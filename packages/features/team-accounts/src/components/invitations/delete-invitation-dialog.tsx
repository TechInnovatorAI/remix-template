import { useCallback, useEffect, useState } from 'react';

import { useFetcher } from '@remix-run/react';

import { useCsrfToken } from '@kit/csrf/client';
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

export const DeleteInvitationDialog: React.FC<{
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  invitationId: number;
}> = ({ isOpen, setIsOpen, invitationId }) => {
  const [error, setError] = useState<boolean>();
  const csrfToken = useCsrfToken();

  const fetcher = useFetcher<{
    success: boolean;
  }>();

  useEffect(() => {
    if (fetcher.data && fetcher.data.success) {
      setIsOpen(false);
    }

    if (fetcher.data && !fetcher.data.success) {
      setError(true);
    }
  }, [fetcher.data, setIsOpen]);

  const onInvitationRemoved = useCallback(() => {
    fetcher.submit(
      {
        intent: 'delete-invitation',
        payload: { invitationId, csrfToken },
      },
      {
        method: 'POST',
        encType: 'application/json',
      },
    );
  }, [fetcher, invitationId, csrfToken]);

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <Trans i18nKey="team:deleteInvitation" />
          </AlertDialogTitle>

          <AlertDialogDescription>
            <Trans i18nKey="team:deleteInvitationDialogDescription" />
          </AlertDialogDescription>
        </AlertDialogHeader>

        <DeleteInvitationForm
          pending={fetcher.state === 'submitting'}
          error={error}
          onInvitationRemoved={onInvitationRemoved}
        />
      </AlertDialogContent>
    </AlertDialog>
  );
};

function DeleteInvitationForm({
  onInvitationRemoved,
  pending,
  error,
}: {
  pending: boolean;
  onInvitationRemoved: () => void;
  error: boolean | undefined;
}) {
  return (
    <form data-test={'delete-invitation-form'} onSubmit={onInvitationRemoved}>
      <div className={'flex flex-col space-y-6'}>
        <p className={'text-muted-foreground text-sm'}>
          <Trans i18nKey={'common:modalConfirmationQuestion'} />
        </p>

        <If condition={error}>
          <RemoveInvitationErrorAlert />
        </If>

        <AlertDialogFooter>
          <AlertDialogCancel>
            <Trans i18nKey={'common:cancel'} />
          </AlertDialogCancel>

          <Button type={'submit'} variant={'destructive'} disabled={pending}>
            <Trans i18nKey={'teams:deleteInvitation'} />
          </Button>
        </AlertDialogFooter>
      </div>
    </form>
  );
}

function RemoveInvitationErrorAlert() {
  return (
    <Alert variant={'destructive'}>
      <AlertTitle>
        <Trans i18nKey={'teams:deleteInvitationErrorTitle'} />
      </AlertTitle>

      <AlertDescription>
        <Trans i18nKey={'teams:deleteInvitationErrorMessage'} />
      </AlertDescription>
    </Alert>
  );
}

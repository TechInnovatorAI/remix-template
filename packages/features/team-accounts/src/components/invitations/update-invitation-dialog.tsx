import { useCallback, useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useFetcher } from '@remix-run/react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { Alert, AlertDescription, AlertTitle } from '@kit/ui/alert';
import { Button } from '@kit/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@kit/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@kit/ui/form';
import { If } from '@kit/ui/if';
import { Trans } from '@kit/ui/trans';

import { RoleSchema } from '../../schema';
import { UpdateInvitationSchema } from '../../schema';
import { MembershipRoleSelector } from '../members/membership-role-selector';
import { RolesDataProvider } from '../members/roles-data-provider';

type Role = string;

export const UpdateInvitationDialog: React.FC<{
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  invitationId: number;
  userRole: Role;
  userRoleHierarchy: number;
}> = ({ isOpen, setIsOpen, invitationId, userRole, userRoleHierarchy }) => {
  const [error, setError] = useState<boolean>();

  const fetcher = useFetcher<{
    success: boolean;
  }>();

  const pending = fetcher.state === 'submitting';

  useEffect(() => {
    if (fetcher.data && fetcher.data.success) {
      setIsOpen(false);
    }

    if (fetcher.data && !fetcher.data.success) {
      setError(true);
    }
  }, [fetcher.data, setIsOpen]);

  const onSubmit = useCallback(
    ({ role }: { role: Role }) => {
      fetcher.submit(
        {
          intent: 'update-invitation',
          payload: { invitationId, role },
        } satisfies z.infer<typeof UpdateInvitationSchema>,
        {
          method: 'POST',
          encType: 'application/json',
        },
      );
    },
    [fetcher, invitationId],
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <Trans i18nKey={'teams:updateMemberRoleModalHeading'} />
          </DialogTitle>

          <DialogDescription>
            <Trans i18nKey={'teams:updateMemberRoleModalDescription'} />
          </DialogDescription>
        </DialogHeader>

        <UpdateInvitationForm
          onSubmit={onSubmit}
          pending={pending}
          error={error}
          userRole={userRole}
          userRoleHierarchy={userRoleHierarchy}
        />
      </DialogContent>
    </Dialog>
  );
};

function UpdateInvitationForm({
  onSubmit,
  pending,
  error,
  userRole,
  userRoleHierarchy,
}: React.PropsWithChildren<{
  onSubmit: (data: { role: Role }) => void;
  pending: boolean;
  error: boolean | undefined;
  userRole: Role;
  userRoleHierarchy: number;
}>) {
  const { t } = useTranslation('teams');

  const form = useForm({
    resolver: zodResolver(
      RoleSchema.refine(
        (data) => {
          return data.role !== userRole;
        },
        {
          message: t('roleMustBeDifferent'),
          path: ['role'],
        },
      ),
    ),
    reValidateMode: 'onChange',
    mode: 'onChange',
    defaultValues: {
      role: userRole,
    },
  });

  return (
    <Form {...form}>
      <form
        data-test={'update-invitation-form'}
        onSubmit={form.handleSubmit(onSubmit)}
        className={'flex flex-col space-y-6'}
      >
        <If condition={error}>
          <UpdateRoleErrorAlert />
        </If>

        <FormField
          name={'role'}
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>
                  <Trans i18nKey={'teams:roleLabel'} />
                </FormLabel>

                <FormControl>
                  <RolesDataProvider maxRoleHierarchy={userRoleHierarchy}>
                    {(roles) => (
                      <MembershipRoleSelector
                        roles={roles}
                        currentUserRole={userRole}
                        value={field.value}
                        onChange={(newRole) =>
                          form.setValue(field.name, newRole)
                        }
                      />
                    )}
                  </RolesDataProvider>
                </FormControl>

                <FormDescription>
                  <Trans i18nKey={'teams:updateRoleDescription'} />
                </FormDescription>

                <FormMessage />
              </FormItem>
            );
          }}
        />

        <Button type={'submit'} disabled={pending}>
          <Trans i18nKey={'teams:updateRoleSubmitLabel'} />
        </Button>
      </form>
    </Form>
  );
}

function UpdateRoleErrorAlert() {
  return (
    <Alert variant={'destructive'}>
      <AlertTitle>
        <Trans i18nKey={'teams:updateRoleErrorHeading'} />
      </AlertTitle>

      <AlertDescription>
        <Trans i18nKey={'teams:updateRoleErrorMessage'} />
      </AlertDescription>
    </Alert>
  );
}

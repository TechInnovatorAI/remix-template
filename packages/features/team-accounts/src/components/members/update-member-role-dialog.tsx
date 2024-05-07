import { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useFetcher } from '@remix-run/react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { useCsrfToken } from '@kit/csrf/client';
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

import { RoleSchema, UpdateMemberRoleSchema } from '../../schema';
import { MembershipRoleSelector } from './membership-role-selector';
import { RolesDataProvider } from './roles-data-provider';

type Role = string;

export const UpdateMemberRoleDialog: React.FC<{
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  userId: string;
  teamAccountId: string;
  userRole: Role;
  userRoleHierarchy: number;
}> = ({
  isOpen,
  setIsOpen,
  userId,
  teamAccountId,
  userRole,
  userRoleHierarchy,
}) => {
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

        <RolesDataProvider maxRoleHierarchy={userRoleHierarchy}>
          {(data) => (
            <UpdateMemberForm
              setIsOpen={setIsOpen}
              userId={userId}
              teamAccountId={teamAccountId}
              userRole={userRole}
              roles={data}
            />
          )}
        </RolesDataProvider>
      </DialogContent>
    </Dialog>
  );
};

function UpdateMemberForm({
  userId,
  userRole,
  teamAccountId,
  setIsOpen,
  roles,
}: React.PropsWithChildren<{
  userId: string;
  userRole: Role;
  teamAccountId: string;
  setIsOpen: (isOpen: boolean) => void;
  roles: Role[];
}>) {
  const [error, setError] = useState<boolean>();
  const { t } = useTranslation('teams');

  const csrfToken = useCsrfToken();
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
  }, [fetcher.data, setIsOpen]);

  const onSubmit = ({ role }: { role: Role }) => {
    fetcher.submit(
      {
        intent: 'update-member-role',
        payload: {
          accountId: teamAccountId,
          userId,
          role,
          csrfToken,
        },
      } satisfies z.infer<typeof UpdateMemberRoleSchema>,
      {
        method: 'POST',
        encType: 'application/json',
      },
    );
  };

  const form = useForm({
    resolver: zodResolver(
      RoleSchema.refine(
        (data) => {
          return data.role !== userRole;
        },
        {
          message: t(`roleMustBeDifferent`),
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
        data-test={'update-member-role-form'}
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
                <FormLabel>{t('roleLabel')}</FormLabel>

                <FormControl>
                  <MembershipRoleSelector
                    roles={roles}
                    currentUserRole={userRole}
                    value={field.value}
                    onChange={(newRole) => form.setValue('role', newRole)}
                  />
                </FormControl>

                <FormDescription>{t('updateRoleDescription')}</FormDescription>

                <FormMessage />
              </FormItem>
            );
          }}
        />

        <Button data-test={'confirm-update-member-role'} disabled={pending}>
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

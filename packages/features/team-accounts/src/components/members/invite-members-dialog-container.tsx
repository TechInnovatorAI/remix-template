'use client';

import { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useFetcher } from '@remix-run/react';
import { Plus, X } from 'lucide-react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { Button } from '@kit/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@kit/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@kit/ui/form';
import { If } from '@kit/ui/if';
import { Input } from '@kit/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@kit/ui/tooltip';
import { Trans } from '@kit/ui/trans';

import { InvitationsSchema } from '../../schema';
import { MembershipRoleSelector } from './membership-role-selector';
import { RolesDataProvider } from './roles-data-provider';
import {useCsrfToken} from "@kit/csrf/client";

type InviteModel = ReturnType<typeof createEmptyInviteModel>;

type Role = string;

/**
 * The maximum number of invites that can be sent at once.
 * Useful to avoid spamming the server with too large payloads
 */
const MAX_INVITES = 5;

export function InviteMembersDialogContainer({
  accountSlug,
  userRoleHierarchy,
  children,
}: React.PropsWithChildren<{
  accountSlug: string;
  userRoleHierarchy: number;
}>) {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation('teams');

  const fetcher = useFetcher<{
    success: boolean;
  }>();

  const pending = fetcher.state === 'submitting';

  useEffect(() => {
    if (fetcher.data) {
      if (fetcher.data.success) {
        toast.success(t('invitingMembers'));
        setIsOpen(false);
      } else {
        toast.error(t('inviteMembersErrorMessage'));
      }
    }
  }, [fetcher.data, t]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} modal>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>
            <Trans i18nKey={'teams:inviteMembersHeading'} />
          </DialogTitle>

          <DialogDescription>
            <Trans i18nKey={'teams:inviteMembersDescription'} />
          </DialogDescription>
        </DialogHeader>

        <RolesDataProvider maxRoleHierarchy={userRoleHierarchy}>
          {(roles) => (
            <InviteMembersForm
              accountSlug={accountSlug}
              pending={pending}
              roles={roles}
              onSubmit={(payload) => {
                fetcher.submit(
                  {
                    intent: 'create-invitations',
                    payload,
                  },
                  {
                    method: 'POST',
                    encType: 'application/json',
                  },
                );
              }}
            />
          )}
        </RolesDataProvider>
      </DialogContent>
    </Dialog>
  );
}

function InviteMembersForm({
  onSubmit,
  roles,
  accountSlug,
  pending,
}: {
  onSubmit: (data: { invitations: InviteModel[]; accountSlug: string }) => void;
  pending: boolean;
  roles: string[];
  accountSlug: string;
}) {
  const { t } = useTranslation('teams');
  const csrfToken = useCsrfToken();

  const form = useForm({
    resolver: zodResolver(InvitationsSchema),
    shouldUseNativeValidation: true,
    reValidateMode: 'onSubmit',
    defaultValues: {
      invitations: [createEmptyInviteModel()],
      accountSlug,
      csrfToken,
    },
  });

  const fieldArray = useFieldArray({
    control: form.control,
    name: 'invitations',
  });

  return (
    <Form {...form}>
      <form
        className={'flex flex-col space-y-8'}
        data-test={'invite-members-form'}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex flex-col space-y-4">
          {fieldArray.fields.map((field, index) => {
            const isFirst = index === 0;

            const emailInputName = `invitations.${index}.email` as const;
            const roleInputName = `invitations.${index}.role` as const;

            return (
              <div data-test={'invite-member-form-item'} key={field.id}>
                <div className={'flex items-end space-x-0.5 md:space-x-2'}>
                  <div className={'w-7/12'}>
                    <FormField
                      name={emailInputName}
                      render={({ field }) => {
                        return (
                          <FormItem>
                            <If condition={isFirst}>
                              <FormLabel>{t('emailLabel')}</FormLabel>
                            </If>

                            <FormControl>
                              <Input
                                data-test={'invite-email-input'}
                                placeholder={t('emailPlaceholder')}
                                type="email"
                                required
                                {...field}
                              />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                  </div>

                  <div className={'w-4/12'}>
                    <FormField
                      name={roleInputName}
                      render={({ field }) => {
                        return (
                          <FormItem>
                            <If condition={isFirst}>
                              <FormLabel>
                                <Trans i18nKey={'teams:roleLabel'} />
                              </FormLabel>
                            </If>

                            <FormControl>
                              <MembershipRoleSelector
                                roles={roles}
                                value={field.value}
                                onChange={(role) => {
                                  form.setValue(field.name, role);
                                }}
                              />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                  </div>

                  <div className={'flex w-[40px] justify-end'}>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant={'ghost'}
                            size={'icon'}
                            type={'button'}
                            disabled={fieldArray.fields.length <= 1}
                            data-test={'remove-invite-button'}
                            aria-label={t('removeInviteButtonLabel')}
                            onClick={() => {
                              fieldArray.remove(index);
                              form.clearErrors(emailInputName);
                            }}
                          >
                            <X className={'h-4 lg:h-5'} />
                          </Button>
                        </TooltipTrigger>

                        <TooltipContent>
                          {t('removeInviteButtonLabel')}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </div>
            );
          })}

          <If condition={fieldArray.fields.length < MAX_INVITES}>
            <div>
              <Button
                data-test={'add-new-invite-button'}
                type={'button'}
                variant={'link'}
                size={'sm'}
                disabled={pending}
                onClick={() => {
                  fieldArray.append(createEmptyInviteModel());
                }}
              >
                <Plus className={'mr-1 h-3'} />

                <span>
                  <Trans i18nKey={'teams:addAnotherMemberButtonLabel'} />
                </span>
              </Button>
            </div>
          </If>
        </div>

        <Button type={'submit'} disabled={pending}>
          <Trans
            i18nKey={
              pending
                ? 'teams:invitingMembers'
                : 'teams:inviteMembersButtonLabel'
            }
          />
        </Button>
      </form>
    </Form>
  );
}

function createEmptyInviteModel() {
  return { email: '', role: 'member' as Role };
}

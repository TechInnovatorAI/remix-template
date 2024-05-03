import { useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useFetcher } from '@remix-run/react';
import { useForm } from 'react-hook-form';
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
import { Input } from '@kit/ui/input';
import { Trans } from '@kit/ui/trans';

import { CreateTeamSchema } from '../schema/create-team.schema';

export function CreateTeamAccountDialog(
  props: React.PropsWithChildren<{
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
  }>,
) {
  return (
    <Dialog open={props.isOpen} onOpenChange={props.setIsOpen}>
      <DialogContent
        onEscapeKeyDown={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>
            <Trans i18nKey={'teams:createTeamModalHeading'} />
          </DialogTitle>

          <DialogDescription>
            <Trans i18nKey={'teams:createTeamModalDescription'} />
          </DialogDescription>
        </DialogHeader>

        <CreateTeamAccountForm onClose={() => props.setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

function CreateTeamAccountForm(props: { onClose: () => void }) {
  const fetcher = useFetcher<{
    success: boolean;
  }>();

  const form = useForm<z.infer<typeof CreateTeamSchema>>({
    defaultValues: {
      name: '',
    },
    resolver: zodResolver(CreateTeamSchema),
  });

  const error = fetcher.data && !fetcher.data.success;
  const pending = fetcher.state === 'submitting';

  useEffect(() => {
    if (fetcher.data) {
      if (fetcher.data.success) {
        props.onClose();
      }
    }
  }, [fetcher.data, props]);

  return (
    <Form {...form}>
      <form
        data-test={'create-team-form'}
        onSubmit={form.handleSubmit((data) => {
          const body = {
            intent: 'create-account',
            payload: data,
          };

          fetcher.submit(body, {
            method: 'POST',
            action: `/api/accounts`,
            encType: 'application/json',
          });
        })}
      >
        <div className={'flex flex-col space-y-4'}>
          <If condition={error}>
            <CreateOrganizationErrorAlert />
          </If>

          <FormField
            name={'name'}
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>
                    <Trans i18nKey={'teams:teamNameLabel'} />
                  </FormLabel>

                  <FormControl>
                    <Input
                      data-test={'create-team-name-input'}
                      required
                      minLength={2}
                      maxLength={50}
                      placeholder={''}
                      {...field}
                    />
                  </FormControl>

                  <FormDescription>
                    <Trans i18nKey={'teams:teamNameDescription'} />
                  </FormDescription>

                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <div className={'flex justify-end space-x-2'}>
            <Button
              variant={'outline'}
              type={'button'}
              disabled={pending}
              onClick={props.onClose}
            >
              <Trans i18nKey={'common:cancel'} />
            </Button>

            <Button data-test={'confirm-create-team-button'} disabled={pending}>
              {pending ? (
                <Trans i18nKey={'teams:creatingTeam'} />
              ) : (
                <Trans i18nKey={'teams:createTeamSubmitLabel'} />
              )}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}

function CreateOrganizationErrorAlert() {
  return (
    <Alert variant={'destructive'}>
      <AlertTitle>
        <Trans i18nKey={'teams:createTeamErrorHeading'} />
      </AlertTitle>

      <AlertDescription>
        <Trans i18nKey={'teams:createTeamErrorMessage'} />
      </AlertDescription>
    </Alert>
  );
}

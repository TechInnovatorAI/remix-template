'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useFetcher } from '@remix-run/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useCsrfToken } from '@kit/csrf/client';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@kit/ui/alert-dialog';
import { Button } from '@kit/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@kit/ui/form';
import { Input } from '@kit/ui/input';

import {
  DeleteAccountForm,
  DeleteAccountSchema,
} from '../lib/server/schema/admin-actions.schema';

export function AdminDeleteAccountDialog(
  props: React.PropsWithChildren<{
    accountId: string;
  }>,
) {
  const fetcher = useFetcher();
  const csrfToken = useCsrfToken();

  const form = useForm({
    resolver: zodResolver(DeleteAccountForm),
    defaultValues: {
      accountId: props.accountId,
      confirmation: '',
      csrfToken,
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{props.children}</AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Account</AlertDialogTitle>

          <AlertDialogDescription>
            Are you sure you want to delete this account? All the data
            associated with this account will be permanently deleted. Any active
            subscriptions will be canceled.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Form {...form}>
          <form
            className={'flex flex-col space-y-8'}
            onSubmit={form.handleSubmit((data) => {
              return fetcher.submit(
                {
                  intent: 'delete-team-account',
                  payload: { ...data, csrfToken },
                } satisfies z.infer<typeof DeleteAccountSchema>,
                {
                  method: 'POST',
                  encType: 'application/json',
                },
              );
            })}
          >
            <FormField
              name={'confirmation'}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Type <b>CONFIRM</b> to confirm
                  </FormLabel>

                  <FormControl>
                    <Input
                      pattern={'CONFIRM'}
                      required
                      placeholder={'Type CONFIRM to confirm'}
                      {...field}
                    />
                  </FormControl>

                  <FormDescription>
                    Are you sure you want to do this? This action cannot be
                    undone.
                  </FormDescription>

                  <FormMessage />
                </FormItem>
              )}
            />

            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>

              <Button type={'submit'} variant={'destructive'}>
                Delete
              </Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}

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

import { BanUserSchema } from '../lib/server/schema/admin-actions.schema';

export function AdminBanUserDialog(
  props: React.PropsWithChildren<{
    userId: string;
  }>,
) {
  const fetcher = useFetcher<{
    success: boolean;
  }>();

  const csrfToken = useCsrfToken();

  const form = useForm({
    resolver: zodResolver(
      z.object({
        userId: z.string(),
        confirmation: z.string().refine((data) => data === 'CONFIRM', {
          message: 'You must type CONFIRM to confirm',
        }),
      }),
    ),
    defaultValues: {
      userId: props.userId,
      confirmation: '',
      csrfToken,
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{props.children}</AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Ban User</AlertDialogTitle>

          <AlertDialogDescription>
            Are you sure you want to ban this user?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Form {...form}>
          <form
            className={'flex flex-col space-y-8'}
            onSubmit={form.handleSubmit((data) => {
              fetcher.submit(
                {
                  intent: 'ban-user',
                  payload: { ...data, csrfToken },
                } satisfies z.infer<typeof BanUserSchema>,
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
                      required
                      pattern={'CONFIRM'}
                      placeholder={'Type CONFIRM to confirm'}
                      {...field}
                    />
                  </FormControl>

                  <FormDescription>
                    Are you sure you want to do this?
                  </FormDescription>

                  <FormMessage />
                </FormItem>
              )}
            />

            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>

              <Button type={'submit'} variant={'destructive'}>
                Ban User
              </Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}

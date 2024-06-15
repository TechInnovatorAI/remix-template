import { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useFetcher } from '@remix-run/react';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useCsrfToken } from '@kit/csrf/client';
import { useSupabase } from '@kit/supabase/hooks/use-supabase';
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
import { LoadingOverlay } from '@kit/ui/loading-overlay';

import { ImpersonateUserSchema } from '../lib/server/schema/admin-actions.schema';

export function AdminImpersonateUserDialog(
  props: React.PropsWithChildren<{
    userId: string;
  }>,
) {
  const [tokens, setTokens] = useState<{
    accessToken: string;
    refreshToken: string;
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

  const fetcher = useFetcher<{
    accessToken: string;
    refreshToken: string;
  }>();

  useEffect(() => {
    if (fetcher.data) {
      setTokens(fetcher.data);
    }
  }, [fetcher.data]);

  if (tokens) {
    return (
      <>
        <ImpersonateUserAuthSetter tokens={tokens} />

        <LoadingOverlay>Setting up your session...</LoadingOverlay>
      </>
    );
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{props.children}</AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Impersonate User</AlertDialogTitle>

          <AlertDialogDescription>
            Are you sure you want to impersonate this user? You will be logged
            in as this user. To stop impersonating, log out.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Form {...form}>
          <form
            className={'flex flex-col space-y-8'}
            onSubmit={form.handleSubmit((data) => {
              fetcher.submit(
                {
                  intent: 'impersonate-user',
                  payload: {
                    ...data,
                    csrfToken,
                  },
                } satisfies z.infer<typeof ImpersonateUserSchema>,
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
                    Are you sure you want to impersonate this user?
                  </FormDescription>

                  <FormMessage />
                </FormItem>
              )}
            />

            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>

              <Button type={'submit'}>Impersonate User</Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function ImpersonateUserAuthSetter({
  tokens,
}: React.PropsWithChildren<{
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}>) {
  useSetSession(tokens);

  return <LoadingOverlay>Setting up your session...</LoadingOverlay>;
}

function useSetSession(tokens: { accessToken: string; refreshToken: string }) {
  const supabase = useSupabase();

  return useQuery({
    queryKey: ['impersonate-user', tokens.accessToken, tokens.refreshToken],
    gcTime: 0,
    queryFn: async () => {
      await supabase.auth.setSession({
        refresh_token: tokens.refreshToken,
        access_token: tokens.accessToken,
      });

      // use a hard refresh to avoid hitting cached pages
      window.location.replace('/home');
    },
  });
}

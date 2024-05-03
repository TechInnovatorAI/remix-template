'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { useRequestResetPassword } from '@kit/supabase/hooks/use-request-reset-password';
import { Alert, AlertDescription } from '@kit/ui/alert';
import { Button } from '@kit/ui/button';
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
import { Trans } from '@kit/ui/trans';

import { AuthErrorAlert } from './auth-error-alert';

const PasswordResetSchema = z.object({
  email: z.string().email(),
});

export function PasswordResetRequestContainer(params: {
  redirectPath: string;
}) {
  const { t } = useTranslation('auth');
  const resetPasswordMutation = useRequestResetPassword();
  const error = resetPasswordMutation.error;
  const success = resetPasswordMutation.data;

  const form = useForm<z.infer<typeof PasswordResetSchema>>({
    resolver: zodResolver(PasswordResetSchema),
    defaultValues: {
      email: '',
    },
  });

  return (
    <>
      <If condition={success}>
        <Alert variant={'success'}>
          <AlertDescription>
            <Trans i18nKey={'auth:passwordResetSuccessMessage'} />
          </AlertDescription>
        </Alert>
      </If>

      <If condition={!resetPasswordMutation.data}>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(({ email }) => {
              return resetPasswordMutation.mutateAsync({
                email,
                redirectTo: new URL(params.redirectPath, window.location.origin)
                  .href,
              });
            })}
            className={'w-full'}
          >
            <div className={'flex flex-col space-y-4'}>
              <div>
                <p className={'text-muted-foreground text-sm'}>
                  <Trans i18nKey={'auth:passwordResetSubheading'} />
                </p>
              </div>

              <AuthErrorAlert error={error} />

              <FormField
                name={'email'}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <Trans i18nKey={'common:emailAddress'} />
                    </FormLabel>

                    <FormControl>
                      <Input
                        required
                        type="email"
                        placeholder={t('emailPlaceholder')}
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button disabled={resetPasswordMutation.isPending} type="submit">
                <Trans i18nKey={'auth:passwordResetLabel'} />
              </Button>
            </div>
          </form>
        </Form>
      </If>
    </>
  );
}

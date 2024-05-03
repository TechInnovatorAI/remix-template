'use client';

import { useMutation } from '@tanstack/react-query';

import { useSupabase } from '@kit/supabase/hooks/use-supabase';
import { Alert, AlertDescription } from '@kit/ui/alert';
import { Button } from '@kit/ui/button';
import { Input } from '@kit/ui/input';
import { Label } from '@kit/ui/label';
import { Trans } from '@kit/ui/trans';

function ResendAuthLinkForm() {
  const resendLink = useResendLink();

  if (resendLink.data && !resendLink.isPending) {
    return (
      <Alert variant={'success'}>
        <AlertDescription>
          <Trans i18nKey={'auth:resendLinkSuccess'} defaults={'Success!'} />
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <form
      className={'flex flex-col space-y-2'}
      onSubmit={(data) => {
        data.preventDefault();

        const email = new FormData(data.currentTarget).get('email') as string;

        return resendLink.mutateAsync(email);
      }}
    >
      <Label>
        <Trans i18nKey={'common:emailAddress'} />
        <Input name={'email'} required placeholder={''} />
      </Label>

      <Button disabled={resendLink.isPending}>
        <Trans i18nKey={'auth:resendLink'} defaults={'Resend Link'} />
      </Button>
    </form>
  );
}

export default ResendAuthLinkForm;

function useResendLink() {
  const supabase = useSupabase();

  const mutationKey = ['resend-link'];
  const mutationFn = async (email: string) => {
    const response = await supabase.auth.resend({
      email,
      type: 'signup',
    });

    if (response.error) {
      throw response.error;
    }

    return response.data;
  };

  return useMutation({
    mutationKey,
    mutationFn,
  });
}

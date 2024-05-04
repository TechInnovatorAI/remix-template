import { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useFetcher } from '@remix-run/react';
import { useForm } from 'react-hook-form';

import { Alert, AlertDescription, AlertTitle } from '@kit/ui/alert';
import { Button } from '@kit/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@kit/ui/form';
import { Input } from '@kit/ui/input';
import { Textarea } from '@kit/ui/textarea';
import { Trans } from '@kit/ui/trans';

import { ContactEmailSchema } from '../_lib/contact-email.schema';

export function ContactForm() {
  const [state, setState] = useState({
    success: false,
    error: false,
  });

  const form = useForm({
    resolver: zodResolver(ContactEmailSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  const fetcher = useFetcher<{
    success: boolean;
  }>();

  const pending = fetcher.state === 'submitting';

  useEffect(() => {
    if (fetcher.data) {
      const success = fetcher.data.success;
      setState({ success, error: !success });
    }
  }, [fetcher.data]);

  if (state.success) {
    return <SuccessAlert />;
  }

  if (state.error) {
    return <ErrorAlert />;
  }

  return (
    <Form {...form}>
      <form
        className={'flex flex-col space-y-4'}
        onSubmit={form.handleSubmit((data) => {
          fetcher.submit(data, {
            method: 'POST',
            encType: 'application/json',
          });
        })}
      >
        <FormField
          name={'name'}
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>
                  <Trans i18nKey={'marketing:contactName'} />
                </FormLabel>

                <FormControl>
                  <Input maxLength={200} {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            );
          }}
        />

        <FormField
          name={'email'}
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>
                  <Trans i18nKey={'marketing:contactEmail'} />
                </FormLabel>

                <FormControl>
                  <Input type={'email'} {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            );
          }}
        />

        <FormField
          name={'message'}
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>
                  <Trans i18nKey={'marketing:contactMessage'} />
                </FormLabel>

                <FormControl>
                  <Textarea
                    className={'min-h-36'}
                    maxLength={5000}
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            );
          }}
        />

        <Button disabled={pending} type={'submit'}>
          <Trans i18nKey={'marketing:sendMessage'} />
        </Button>
      </form>
    </Form>
  );
}

function SuccessAlert() {
  return (
    <Alert variant={'success'}>
      <AlertTitle>
        <Trans i18nKey={'marketing:contactSuccess'} />
      </AlertTitle>

      <AlertDescription>
        <Trans i18nKey={'marketing:contactSuccessDescription'} />
      </AlertDescription>
    </Alert>
  );
}

function ErrorAlert() {
  return (
    <Alert variant={'destructive'}>
      <AlertTitle>
        <Trans i18nKey={'marketing:contactError'} />
      </AlertTitle>

      <AlertDescription>
        <Trans i18nKey={'marketing:contactErrorDescription'} />
      </AlertDescription>
    </Alert>
  );
}

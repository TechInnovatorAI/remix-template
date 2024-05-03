'use client';

import { useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useFetcher } from '@remix-run/react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@kit/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@kit/ui/form';
import { Input } from '@kit/ui/input';
import { Trans } from '@kit/ui/trans';

import { TeamNameFormSchema, UpdateTeamNameSchema } from '../../schema';

export const UpdateTeamAccountNameForm = (props: {
  account: {
    name: string;
    slug: string;
  };

  path: string;
}) => {
  const { t } = useTranslation('teams');

  const fetcher = useFetcher<{
    success: boolean;
  }>();

  const pending = fetcher.state === 'submitting';

  const form = useForm({
    resolver: zodResolver(TeamNameFormSchema),
    defaultValues: {
      name: props.account.name,
    },
  });

  useEffect(() => {
    if (fetcher.data) {
      if (fetcher.data.success) {
        toast.success(t('updateTeamSuccessMessage'));
      } else {
        toast.error(t('updateTeamErrorMessage'));
      }
    }
  }, [fetcher.data, t]);

  return (
    <div className={'space-y-8'}>
      <Form {...form}>
        <form
          data-test={'update-team-account-name-form'}
          className={'flex flex-col space-y-4'}
          onSubmit={form.handleSubmit((data) => {
            fetcher.submit(
              {
                intent: 'update-team-name',
                name: data.name,
                payload: {
                  slug: props.account.slug,
                  name: data.name,
                  path: props.path,
                },
              } satisfies z.infer<typeof UpdateTeamNameSchema>,
              {
                method: 'POST',
                encType: 'application/json',
              },
            );
          })}
        >
          <FormField
            name={'name'}
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>
                    <Trans i18nKey={'teams:teamNameInputLabel'} />
                  </FormLabel>

                  <FormControl>
                    <Input
                      data-test={'team-name-input'}
                      required
                      placeholder={''}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              );
            }}
          />

          <div>
            <Button
              name={'intent'}
              value={'update-team-name'}
              className={'w-full md:w-auto'}
              data-test={'update-team-submit-button'}
              disabled={pending}
            >
              <Trans i18nKey={'teams:updateTeamSubmitLabel'} />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

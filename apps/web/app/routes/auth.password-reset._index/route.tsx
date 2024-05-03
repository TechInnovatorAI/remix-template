import { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import {Link, redirect} from '@remix-run/react';

import { PasswordResetRequestContainer } from '@kit/auth/password-reset';
import { Button } from '@kit/ui/button';
import { Heading } from '@kit/ui/heading';
import { Trans } from '@kit/ui/trans';

import pathsConfig from '~/config/paths.config';
import { createI18nServerInstance } from '~/lib/i18n/i18n.server';
import {requireUser} from "@kit/supabase/require-user";
import {getSupabaseServerClient} from "@kit/supabase/server-client";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const i18n = await createI18nServerInstance(request);
  const user = await requireUser(getSupabaseServerClient(request));

  if (user.data) {
    return redirect(pathsConfig.app.home);
  }

  return {
    title: i18n.t('auth:passwordResetLabel'),
  };
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    {
      title: data?.title,
    },
  ];
};

const { callback, passwordUpdate, signIn } = pathsConfig.auth;
const redirectPath = `${callback}?next=${passwordUpdate}`;

export default function PasswordResetPage() {
  return (
    <>
      <Heading level={4}>
        <Trans i18nKey={'auth:passwordResetLabel'} />
      </Heading>

      <div className={'flex flex-col space-y-4'}>
        <PasswordResetRequestContainer redirectPath={redirectPath} />

        <div className={'flex justify-center text-xs'}>
          <Button asChild variant={'link'} size={'sm'}>
            <Link to={signIn}>
              <Trans i18nKey={'auth:passwordRecoveredQuestion'} />
            </Link>
          </Button>
        </div>
      </div>
    </>
  );
}

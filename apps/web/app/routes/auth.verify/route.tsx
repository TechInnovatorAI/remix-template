import { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { redirect, useLoaderData } from '@remix-run/react';

import { MultiFactorChallengeContainer } from '@kit/auth/mfa';
import { checkRequiresMultiFactorAuthentication } from '@kit/supabase/check-requires-mfa';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

import pathsConfig from '~/config/paths.config';
import { createI18nServerInstance } from '~/lib/i18n/i18n.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const client = getSupabaseServerClient(request);
  const needsMfa = await checkRequiresMultiFactorAuthentication(client);

  if (!needsMfa) {
    return redirect(pathsConfig.auth.signIn);
  }

  const i18n = await createI18nServerInstance(request);
  const searchParams = new URL(request.url).searchParams;
  const redirectPath = searchParams.get('next') ?? pathsConfig.app.home;

  return {
    title: i18n.t('auth:signIn'),
    redirectPath,
  };
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    {
      title: data?.title,
    },
  ];
};

export default function VerifyPage() {
  const { redirectPath } = useLoaderData<typeof loader>();

  return (
    <MultiFactorChallengeContainer
      paths={{
        redirectPath,
      }}
    />
  );
}

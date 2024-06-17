import { MetaFunction, redirect, useLoaderData } from '@remix-run/react';
import { LoaderFunctionArgs } from '@remix-run/server-runtime';

import { MultiFactorChallengeContainer } from '@kit/auth/mfa';
import { checkRequiresMultiFactorAuthentication } from '@kit/supabase/check-requires-mfa';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

import pathsConfig from '~/config/paths.config';
import { createI18nServerInstance } from '~/lib/i18n/i18n.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const client = getSupabaseServerClient(request);

  const {
    data: { user },
  } = await client.auth.getUser();

  if (!user) {
    return redirect(pathsConfig.auth.signIn);
  }

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
    userId: user.id,
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
  const { redirectPath, userId } = useLoaderData<typeof loader>();

  return (
    <MultiFactorChallengeContainer
      userId={userId}
      paths={{
        redirectPath,
      }}
    />
  );
}

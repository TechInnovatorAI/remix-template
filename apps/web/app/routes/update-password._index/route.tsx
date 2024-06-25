import { MetaFunction } from '@remix-run/react';
import { LoaderFunctionArgs } from '@remix-run/server-runtime';

import { UpdatePasswordForm } from '@kit/auth/password-reset';
import { AuthLayoutShell } from '@kit/auth/shared';

import { AppLogo } from '~/components/app-logo';
import pathsConfig from '~/config/paths.config';
import { createI18nServerInstance } from '~/lib/i18n/i18n.server';

export const loader = async (args: LoaderFunctionArgs) => {
  const { t } = await createI18nServerInstance(args.request);

  return {
    title: t('auth:updatePassword'),
  };
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    {
      title: data?.title,
    },
  ];
};

export default function UpdatePasswordPage() {
  return (
    <AuthLayoutShell Logo={AppLogo}>
      <UpdatePasswordForm redirectTo={pathsConfig.app.home} />
    </AuthLayoutShell>
  );
}

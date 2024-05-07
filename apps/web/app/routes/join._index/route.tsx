import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from '@remix-run/node';
import { Link, redirect, useLoaderData } from '@remix-run/react';
import { ArrowLeft } from 'lucide-react';

import { AuthLayoutShell } from '@kit/auth/shared';
import { verifyCsrfToken } from '@kit/csrf/server';
import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerAdminClient } from '@kit/supabase/server-admin-client';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { acceptInvitationAction } from '@kit/team-accounts/actions';
import { createTeamAccountsApi } from '@kit/team-accounts/api';
import { AcceptInvitationContainer } from '@kit/team-accounts/components';
import { Button } from '@kit/ui/button';
import { Heading } from '@kit/ui/heading';
import { Trans } from '@kit/ui/trans';

import { AppLogo } from '~/components/app-logo';
import pathsConfig from '~/config/paths.config';
import { createI18nServerInstance } from '~/lib/i18n/i18n.server';

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    {
      title: data?.title,
    },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const token = new URL(request.url).searchParams.get('invite_token');

  // no token, redirect to 404
  if (!token) {
    return redirect('/404');
  }

  const client = getSupabaseServerClient(request);
  const auth = await requireUser(client);

  // if the user is not logged in or there is an error
  // redirect to the sign up page with the invite token
  // so that they will get back to this page after signing up
  if (auth.error ?? !auth.data) {
    const path = `${pathsConfig.auth.signUp}?invite_token=${token}`;

    return redirect(path);
  }

  // get api to interact with team accounts
  const adminClient = getSupabaseServerAdminClient();
  const api = createTeamAccountsApi(client);

  // the user is logged in, we can now check if the token is valid
  const invitation = await api.getInvitation(adminClient, token);

  if (!invitation) {
    return redirect('/404');
  }

  // we need to verify the user isn't already in the account
  // we do so by checking if the user can read the account
  // if the user can read the account, then they are already in the account
  const account = await api.getTeamAccountById(invitation.account.id);

  // if the user is already in the account redirect to the home page
  if (account) {
    const { getLogger } = await import('@kit/shared/logger');
    const logger = await getLogger();

    logger.warn(
      {
        name: 'join-team-account',
        accountId: invitation.account.id,
        userId: auth.data.id,
      },
      'User is already in the account. Redirecting to account page.',
    );

    // if the user is already in the account redirect to the home page
    return redirect(pathsConfig.app.home);
  }

  // if the user decides to sign in with a different account
  // we redirect them to the sign in page with the invite token
  const signOutNext = `${pathsConfig.auth.signIn}?invite_token=${token}`;

  // once the user accepts the invitation, we redirect them to the account home page
  const accountHome = pathsConfig.app.accountHome.replace(
    '[account]',
    invitation.account.slug,
  );

  const email = auth.data.email ?? '';
  const i18n = await createI18nServerInstance(request);
  const title = i18n.t('teams:joinTeamAccount');

  return {
    title,
    email,
    token,
    invitation,
    signOutNext,
    accountHome,
  };
};

export default function JoinTeamAccountPage() {
  const { invitation, email, accountHome, signOutNext, token } =
    useLoaderData<typeof loader>();

  // the invitation is not found or expired
  if (!invitation) {
    return (
      <AuthLayoutShell Logo={AppLogo}>
        <InviteNotFoundOrExpired />
      </AuthLayoutShell>
    );
  }

  return (
    <AuthLayoutShell Logo={AppLogo}>
      <AcceptInvitationContainer
        email={email}
        inviteToken={token}
        invitation={invitation}
        paths={{
          signOutNext,
          accountHome,
        }}
      />
    </AuthLayoutShell>
  );
}

/**
 * @name action
 * @description Accepts an invitation to join a team.
 * @param request
 */
export const action = async ({ request }: ActionFunctionArgs) => {
  const data = await request.formData();
  const client = getSupabaseServerClient(request);

  const csrfToken = data.get('csrfToken') as string;

  await verifyCsrfToken(request, csrfToken);

  return acceptInvitationAction({
    client,
    data,
  });
};

function InviteNotFoundOrExpired() {
  return (
    <div className={'flex flex-col space-y-4'}>
      <Heading level={6}>
        <Trans i18nKey={'teams:inviteNotFoundOrExpired'} />
      </Heading>

      <p className={'text-muted-foreground text-sm'}>
        <Trans i18nKey={'teams:inviteNotFoundOrExpiredDescription'} />
      </p>

      <Button asChild className={'w-full'} variant={'outline'}>
        <Link to={pathsConfig.app.home}>
          <ArrowLeft className={'mr-2 w-4'} />
          <Trans i18nKey={'teams:backToHome'} />
        </Link>
      </Button>
    </div>
  );
}

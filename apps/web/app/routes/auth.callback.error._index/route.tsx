import { LoaderFunctionArgs } from '@remix-run/node';
import { Link, json, redirect, useLoaderData } from '@remix-run/react';

import { Alert, AlertDescription, AlertTitle } from '@kit/ui/alert';
import { Button } from '@kit/ui/button';
import { Trans } from '@kit/ui/trans';

import pathsConfig from '~/config/paths.config';

export const loader = ({ request }: LoaderFunctionArgs) => {
  const searchParams = new URL(request.url).searchParams;
  const inviteToken = searchParams.get('invite_token');
  const error = searchParams.get('error');

  if (!error) {
    const queryParam = inviteToken ? `?invite_token=${inviteToken}` : '';

    return redirect(pathsConfig.auth.signIn + queryParam);
  }

  return json({
    error,
  });
};

export default function AuthCallbackErrorPage() {
  const { error } = useLoaderData<typeof loader>();

  return (
    <div className={'flex flex-col space-y-4 py-4'}>
      <div>
        <Alert variant={'destructive'}>
          <AlertTitle>
            <Trans i18nKey={'auth:authenticationErrorAlertHeading'} />
          </AlertTitle>

          <AlertDescription>
            <Trans i18nKey={error} />
          </AlertDescription>
        </Alert>
      </div>

      <Button asChild>
        <Link to={pathsConfig.auth.signIn}>
          <Trans i18nKey={'auth:signIn'} />
        </Link>
      </Button>
    </div>
  );
}

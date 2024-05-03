import { Link, isRouteErrorResponse, useRouteError } from '@remix-run/react';
import { ArrowLeft } from 'lucide-react';

import { useCaptureException } from '@kit/monitoring/hooks';
import { Button } from '@kit/ui/button';
import { Heading } from '@kit/ui/heading';
import { Trans } from '@kit/ui/trans';

import { SiteFooter } from '~/routes/_marketing/_components/site-footer';
import { SiteHeader } from '~/routes/_marketing/_components/site-header';

export function RootErrorBoundary() {
  const routeError = useRouteError();

  const error =
    routeError instanceof Error ? routeError : new Error('Unknown error');

  const status = isRouteErrorResponse(error) ? error.status : 500;

  useCaptureException(error);

  return (
    <div className={'flex h-screen flex-1 flex-col'}>
      <script
        dangerouslySetInnerHTML={{
          __html: `window.process = {env: ${JSON.stringify({})}}`,
        }}
      />

      <SiteHeader />

      <div
        className={
          'container m-auto flex w-full flex-1 flex-col items-center justify-center'
        }
      >
        <div className={'flex flex-col items-center space-y-16'}>
          <div>
            <h1 className={'font-heading text-9xl font-extrabold'}>
              {status === 404 ? (
                <Trans i18nKey={'common:pageNotFoundHeading'} />
              ) : (
                <Trans i18nKey={'common:errorPageHeading'} />
              )}
            </h1>
          </div>

          <div className={'flex flex-col items-center space-y-8'}>
            <div className={'flex flex-col items-center space-y-2.5'}>
              <div>
                <Heading level={1}>
                  {status === 404 ? (
                    <Trans i18nKey={'common:pageNotFound'} />
                  ) : (
                    <Trans i18nKey={'common:genericError'} />
                  )}
                </Heading>
              </div>

              <p className={'text-muted-foreground'}>
                {status === 404 ? (
                  <Trans i18nKey={'common:pageNotFoundSubHeading'} />
                ) : (
                  <Trans i18nKey={'common:genericErrorSubHeading'} />
                )}
              </p>
            </div>

            <div>
              <Button variant={'outline'} asChild>
                <Link to={'/'}>
                  <ArrowLeft className={'mr-2 h-4'} />

                  <Trans i18nKey={'common:goBack'} />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}

import { useMemo } from 'react';

import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import {
  MetaFunction,
  json,
  useFetcher,
  useLoaderData,
} from '@remix-run/react';
import { LoaderFunctionArgs } from '@remix-run/server-runtime';

import {
  BillingPortalCard,
  CurrentLifetimeOrderCard,
  CurrentSubscriptionCard,
} from '@kit/billing-gateway/components';
import { useCsrfToken } from '@kit/csrf/client';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { Alert, AlertDescription, AlertTitle } from '@kit/ui/alert';
import { If } from '@kit/ui/if';
import { PageBody } from '@kit/ui/page';
import { Trans } from '@kit/ui/trans';
import { cn } from '@kit/ui/utils';

import billingConfig from '~/config/billing.config';
import { createI18nServerInstance } from '~/lib/i18n/i18n.server';
import { requireUserLoader } from '~/lib/require-user-loader';
import { TeamAccountCheckoutForm } from '~/routes/home.$account.billing._index/_components/team-account-checkout-form';
import { TeamAccountLayoutPageHeader } from '~/routes/home.$account/_components/team-account-layout-page-header';
import { loadTeamWorkspace } from '~/routes/home.$account/_lib/team-account-workspace-loader.server';

import { loadTeamAccountBillingPage } from './_lib/load-team-account-billing-page.server';

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    {
      title: data?.title,
    },
  ];
};

export async function loader(args: LoaderFunctionArgs) {
  // require user
  await requireUserLoader(args.request);

  const client = getSupabaseServerClient(args.request);
  const accountSlug = args.params.account as string;

  const i18n = await createI18nServerInstance(args.request);
  const title = i18n.t('teams:billing.pageTitle');

  const workspace = await loadTeamWorkspace({
    client,
    accountSlug,
  });

  const accountId = workspace.account.id;

  const [data, customerId] = await loadTeamAccountBillingPage({
    client,
    accountId,
  });

  return json({
    title,
    data,
    customerId,
    accountId,
    workspace,
    accountSlug,
  });
}

export default function TeamAccountBillingPage() {
  const { data, workspace, customerId, accountId, accountSlug } =
    useLoaderData<typeof loader>();

  const canManageBilling =
    workspace.account.permissions.includes('billing.manage');

  const fetcher = useFetcher();
  const csrfToken = useCsrfToken();

  const Checkout = useMemo(() => {
    if (!canManageBilling) {
      return <CannotManageBillingAlert />;
    }

    return (
      <TeamAccountCheckoutForm
        customerId={customerId}
        accountId={accountId}
        accountSlug={accountSlug}
      />
    );
  }, [accountId, accountSlug, canManageBilling, customerId]);

  const BillingPortal = useMemo(() => {
    if (!canManageBilling || !customerId) {
      return null;
    }

    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();

          fetcher.submit(
            {
              intent: 'account-billing-portal',
              payload: {
                accountId,
                slug: accountSlug,
                csrfToken,
              },
            },
            {
              action: '/api/billing/customer-portal',
              method: 'POST',
              encType: 'application/json',
            },
          );
        }}
      >
        <BillingPortalCard />
      </form>
    );
  }, [
    accountId,
    accountSlug,
    canManageBilling,
    customerId,
    fetcher,
    csrfToken,
  ]);

  return (
    <>
      <TeamAccountLayoutPageHeader
        account={accountSlug}
        title={<Trans i18nKey={'common:billingTabLabel'} />}
        description={<Trans i18nKey={'common:billingTabDescription'} />}
      />

      <PageBody>
        <div
          className={cn(`flex w-full flex-col space-y-4`, {
            'max-w-2xl': data,
          })}
        >
          <If condition={data} fallback={<div>{Checkout}</div>}>
            {(data) => {
              if ('active' in data) {
                return (
                  <CurrentSubscriptionCard
                    subscription={data}
                    config={billingConfig}
                  />
                );
              }

              return (
                <CurrentLifetimeOrderCard order={data} config={billingConfig} />
              );
            }}
          </If>

          {BillingPortal}
        </div>
      </PageBody>
    </>
  );
}

function CannotManageBillingAlert() {
  return (
    <Alert variant={'warning'}>
      <ExclamationTriangleIcon className={'h-4'} />

      <AlertTitle>
        <Trans i18nKey={'billing:cannotManageBillingAlertTitle'} />
      </AlertTitle>

      <AlertDescription>
        <Trans i18nKey={'billing:cannotManageBillingAlertDescription'} />
      </AlertDescription>
    </Alert>
  );
}

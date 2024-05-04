import { lazy, useEffect, useState } from 'react';

import { useFetcher } from '@remix-run/react';

import { PlanPicker } from '@kit/billing-gateway/components';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@kit/ui/card';
import { If } from '@kit/ui/if';
import { Trans } from '@kit/ui/trans';

import billingConfig from '~/config/billing.config';

const EmbeddedCheckout = lazy(async () => {
  const { EmbeddedCheckout } = await import('@kit/billing-gateway/checkout');

  return {
    default: EmbeddedCheckout,
  };
});

export function TeamAccountCheckoutForm(params: {
  accountId: string;
  accountSlug: string;
  customerId: string | null | undefined;
}) {
  const [checkoutToken, setCheckoutToken] = useState<string | undefined>(
    undefined,
  );

  const fetcher = useFetcher<{
    checkoutToken: string;
  }>();

  const pending = fetcher.state === 'submitting';

  // only allow trial if the user is not already a customer
  const canStartTrial = !params.customerId;

  useEffect(() => {
    if (fetcher.data?.checkoutToken) {
      setCheckoutToken(fetcher.data.checkoutToken);
    }
  }, [fetcher.data?.checkoutToken]);

  return (
    <>
      <If condition={checkoutToken}>
        <EmbeddedCheckout
          checkoutToken={checkoutToken!}
          provider={billingConfig.provider}
          onClose={() => setCheckoutToken(undefined)}
        />
      </If>

      <Card>
        <CardHeader>
          <CardTitle>
            <Trans i18nKey={'billing:manageTeamPlan'} />
          </CardTitle>

          <CardDescription>
            <Trans i18nKey={'billing:manageTeamPlanDescription'} />
          </CardDescription>
        </CardHeader>

        <CardContent>
          <PlanPicker
            pending={pending}
            config={billingConfig}
            canStartTrial={canStartTrial}
            onSubmit={({ planId, productId }) => {
              fetcher.submit(
                {
                  intent: 'account-checkout',
                  payload: {
                    planId,
                    productId,
                    slug: params.accountSlug,
                    accountId: params.accountId,
                  },
                },
                {
                  action: '/api/billing/checkout',
                  method: 'POST',
                  encType: 'application/json',
                },
              );
            }}
          />
        </CardContent>
      </Card>
    </>
  );
}

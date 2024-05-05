import { useEffect, useState } from 'react';

import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { useFetcher } from '@remix-run/react';

import { EmbeddedCheckout } from '@kit/billing-gateway/checkout';
import { PlanPicker } from '@kit/billing-gateway/components';
import { Alert, AlertDescription, AlertTitle } from '@kit/ui/alert';
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

export function PersonalAccountCheckoutForm(props: {
  customerId: string | null | undefined;
}) {
  const [error, setError] = useState(false);

  const [checkoutToken, setCheckoutToken] = useState<string | undefined>(
    undefined,
  );

  const fetcher = useFetcher<
    | {
        checkoutToken: string;
      }
    | {
        error: boolean;
      }
  >();

  useEffect(() => {
    if (fetcher.data) {
      if ('error' in fetcher.data) {
        setError(true);
      }

      if ('checkoutToken' in fetcher.data) {
        setCheckoutToken(fetcher.data.checkoutToken);
      }
    }
  }, [fetcher.data]);

  // only allow trial if the user is not already a customer
  const canStartTrial = !props.customerId;
  const pending = fetcher.state === 'submitting';

  // If the checkout token is set, render the embedded checkout component
  if (checkoutToken) {
    return (
      <EmbeddedCheckout
        checkoutToken={checkoutToken}
        provider={billingConfig.provider}
        onClose={() => setCheckoutToken(undefined)}
      />
    );
  }

  // Otherwise, render the plan picker component
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>
            <Trans i18nKey={'common:planCardLabel'} />
          </CardTitle>

          <CardDescription>
            <Trans i18nKey={'common:planCardDescription'} />
          </CardDescription>
        </CardHeader>

        <CardContent className={'space-y-4'}>
          <If condition={error}>
            <ErrorAlert />
          </If>

          <PlanPicker
            pending={pending}
            config={billingConfig}
            canStartTrial={canStartTrial}
            onSubmit={(payload) => {
              fetcher.submit(
                {
                  intent: 'personal-checkout',
                  payload,
                },
                {
                  encType: 'application/json',
                  method: 'POST',
                  action: '/api/billing/checkout',
                },
              );
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}

function ErrorAlert() {
  return (
    <Alert variant={'destructive'}>
      <ExclamationTriangleIcon className={'h-4'} />

      <AlertTitle>
        <Trans i18nKey={'common:planPickerAlertErrorTitle'} />
      </AlertTitle>

      <AlertDescription>
        <Trans i18nKey={'common:planPickerAlertErrorDescription'} />
      </AlertDescription>
    </Alert>
  );
}

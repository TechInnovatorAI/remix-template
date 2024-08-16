import { Suspense, forwardRef, lazy, memo, useMemo } from 'react';

import { Enums } from '@kit/supabase/database';
import { LoadingOverlay } from '@kit/ui/loading-overlay';

type BillingProvider = Enums<'billing_provider'>;

const Fallback = <LoadingOverlay fullPage={false} />;

export function EmbeddedCheckout(
  props: React.PropsWithChildren<{
    checkoutToken: string;
    provider: BillingProvider;
    onClose?: () => void;
  }>,
) {
  const CheckoutComponent = useMemo(
    () => loadCheckoutComponent(props.provider),
    [props.provider],
  );

  return (
    <>
      <CheckoutComponent
        onClose={props.onClose}
        checkoutToken={props.checkoutToken}
      />

      <BlurryBackdrop />
    </>
  );
}

function loadCheckoutComponent(provider: BillingProvider) {
  switch (provider) {
    case 'stripe': {
      return buildLazyComponent(() => {
        return import('@kit/stripe/components').then(({ StripeCheckout }) => {
          return {
            default: StripeCheckout,
          };
        });
      });
    }

    case 'lemon-squeezy': {
      return buildLazyComponent(() => {
        return import('@kit/lemon-squeezy/components').then(
          ({ LemonSqueezyEmbeddedCheckout }) => {
            return {
              default: LemonSqueezyEmbeddedCheckout,
            };
          },
        );
      });
    }

    case 'paddle': {
      throw new Error('Paddle is not yet supported');
    }

    default:
      throw new Error(`Unsupported provider: ${provider as string}`);
  }
}

function buildLazyComponent<
  Component extends React.ComponentType<{
    onClose: (() => unknown) | undefined;
    checkoutToken: string;
  }>,
>(
  load: () => Promise<{
    default: Component;
  }>,
  fallback = Fallback,
) {
  let LoadedComponent: ReturnType<typeof lazy<Component>> | null = null;

  const LazyComponent = forwardRef<
    React.ElementRef<'div'>,
    {
      onClose: (() => unknown) | undefined;
      checkoutToken: string;
    }
  >(function LazyDynamicComponent(props, ref) {
    if (!LoadedComponent) {
      LoadedComponent = lazy(load);
    }

    return (
      <Suspense fallback={fallback}>
        {/* @ts-expect-error: weird TS */}
        <LoadedComponent
          onClose={props.onClose}
          checkoutToken={props.checkoutToken}
          ref={ref}
        />
      </Suspense>
    );
  });

  return memo(LazyComponent);
}

function BlurryBackdrop() {
  return (
    <div
      className={
        'bg-background/30 fixed left-0 top-0 w-full backdrop-blur-sm' +
        ' !m-0 h-full'
      }
    />
  );
}

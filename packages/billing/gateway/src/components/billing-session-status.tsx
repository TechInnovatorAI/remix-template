import { Check, ChevronRight } from 'lucide-react';

import { Button } from '@kit/ui/button';
import { Heading } from '@kit/ui/heading';
import { Trans } from '@kit/ui/trans';

/**
 * Retrieves the session status for a Stripe checkout session.
 * Since we should only arrive here for a successful checkout, we only check
 * for the `paid` status.
 **/
export function BillingSessionStatus({
  customerEmail,
  onRedirect,
}: React.PropsWithChildren<{
  customerEmail: string;
  onRedirect: () => void;
}>) {
  return (
    <section
      data-test={'payment-return-success'}
      className={
        'fade-in dark:border-border mx-auto max-w-xl rounded-xl border border-transparent p-16 xl:drop-shadow-2xl' +
        ' bg-background animate-in slide-in-from-bottom-8 ease-out' +
        ' zoom-in-50 dark:shadow-primary/20 duration-1000 dark:shadow-2xl'
      }
    >
      <div
        className={
          'flex flex-col items-center justify-center space-y-6 text-center'
        }
      >
        <Check
          className={
            'h-16 w-16 rounded-full bg-green-500 p-1 text-white ring-8' +
            ' ring-green-500/30 dark:ring-green-500/50'
          }
        />

        <Heading level={3}>
          <span className={'mr-4 font-semibold'}>
            <Trans i18nKey={'billing:checkoutSuccessTitle'} />
          </span>
          🎉
        </Heading>

        <div className={'text-muted-foreground flex flex-col space-y-4'}>
          <p>
            <Trans
              i18nKey={'billing:checkoutSuccessDescription'}
              values={{ customerEmail }}
            />
          </p>
        </div>

        <form>
          <Button
            data-test={'checkout-success-back-link'}
            formAction={onRedirect}
          >
            <span>
              <Trans i18nKey={'billing:checkoutSuccessBackButton'} />
            </span>

            <ChevronRight className={'h-4'} />
          </Button>
        </form>
      </div>
    </section>
  );
}

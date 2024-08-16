import { Enums } from '@kit/supabase/database';
import { Alert, AlertDescription, AlertTitle } from '@kit/ui/alert';
import { Trans } from '@kit/ui/trans';

export function CurrentPlanAlert(
  props: React.PropsWithoutRef<{
    status: Enums<'subscription_status'>;
  }>,
) {
  let variant: 'success' | 'warning' | 'destructive';
  const prefix = 'billing:status';

  const text = `${prefix}.${props.status}.description`;
  const title = `${prefix}.${props.status}.heading`;

  switch (props.status) {
    case 'active':
      variant = 'success';
      break;
    case 'trialing':
      variant = 'success';
      break;
    case 'past_due':
      variant = 'destructive';
      break;
    case 'canceled':
      variant = 'destructive';
      break;
    case 'unpaid':
      variant = 'destructive';
      break;
    case 'incomplete':
      variant = 'warning';
      break;
    case 'incomplete_expired':
      variant = 'destructive';
      break;
    case 'paused':
      variant = 'warning';
      break;
  }

  return (
    <Alert variant={variant}>
      <AlertTitle>
        <Trans i18nKey={title} />
      </AlertTitle>

      <AlertDescription>
        <Trans i18nKey={text} />
      </AlertDescription>
    </Alert>
  );
}

import { Enums } from '@kit/supabase/database';
import { Badge } from '@kit/ui/badge';
import { Trans } from '@kit/ui/trans';

type Status = Enums<'subscription_status'> | Enums<'payment_status'>;

export function CurrentPlanBadge(
  props: React.PropsWithoutRef<{
    status: Status;
  }>,
) {
  let variant: 'success' | 'warning' | 'destructive';
  const text = `billing:status.${props.status}.badge`;

  switch (props.status) {
    case 'active':
    case 'succeeded':
      variant = 'success';
      break;
    case 'trialing':
      variant = 'success';
      break;
    case 'past_due':
    case 'failed':
      variant = 'destructive';
      break;
    case 'canceled':
      variant = 'destructive';
      break;
    case 'unpaid':
      variant = 'destructive';
      break;
    case 'incomplete':
    case 'pending':
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
    <Badge data-test={'current-plan-card-status-badge'} variant={variant}>
      <Trans i18nKey={text} />
    </Badge>
  );
}

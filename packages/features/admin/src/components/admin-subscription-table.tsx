import { Tables } from '@kit/supabase/database';
import { Alert, AlertDescription, AlertTitle } from '@kit/ui/alert';
import { Heading } from '@kit/ui/heading';
import { If } from '@kit/ui/if';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@kit/ui/table';

export function AdminSubscriptionTable({
  subscription,
}: {
  subscription:
    | (Tables<'subscriptions'> & {
        subscription_items: Tables<'subscription_items'>[];
      })
    | null;
}) {
  return (
    <div className={'flex flex-col space-y-2.5'}>
      <Heading level={6}>Subscription</Heading>

      <If
        condition={subscription}
        fallback={
          <Alert>
            <AlertTitle>No subscription found for this account.</AlertTitle>

            <AlertDescription>
              This account does not have a subscription.
            </AlertDescription>
          </Alert>
        }
      >
        {(subscription) => {
          return (
            <div className={'flex flex-col space-y-4'}>
              <Table>
                <TableHeader>
                  <TableHead>Subscription ID</TableHead>

                  <TableHead>Provider</TableHead>

                  <TableHead>Customer ID</TableHead>

                  <TableHead>Status</TableHead>

                  <TableHead>Created At</TableHead>

                  <TableHead>Period Starts At</TableHead>

                  <TableHead>Ends At</TableHead>
                </TableHeader>

                <TableBody>
                  <TableRow>
                    <TableCell>
                      <span>{subscription.id}</span>
                    </TableCell>

                    <TableCell>
                      <span>{subscription.billing_provider}</span>
                    </TableCell>

                    <TableCell>
                      <span>{subscription.billing_customer_id}</span>
                    </TableCell>

                    <TableCell>
                      <span>{subscription.status}</span>
                    </TableCell>

                    <TableCell>
                      <span>{subscription.created_at}</span>
                    </TableCell>

                    <TableCell>
                      <span>{subscription.period_starts_at}</span>
                    </TableCell>

                    <TableCell>
                      <span>{subscription.period_ends_at}</span>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <Table>
                <TableHeader>
                  <TableHead>Product ID</TableHead>

                  <TableHead>Variant ID</TableHead>

                  <TableHead>Quantity</TableHead>

                  <TableHead>Price</TableHead>

                  <TableHead>Interval</TableHead>

                  <TableHead>Type</TableHead>
                </TableHeader>

                <TableBody>
                  {subscription.subscription_items.map((item) => {
                    return (
                      <TableRow key={item.variant_id}>
                        <TableCell>
                          <span>{item.product_id}</span>
                        </TableCell>

                        <TableCell>
                          <span>{item.variant_id}</span>
                        </TableCell>

                        <TableCell>
                          <span>{item.quantity}</span>
                        </TableCell>

                        <TableCell>
                          <span>{item.price_amount}</span>
                        </TableCell>

                        <TableCell>
                          <span>{item.interval}</span>
                        </TableCell>

                        <TableCell>
                          <span>{item.type}</span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          );
        }}
      </If>
    </div>
  );
}

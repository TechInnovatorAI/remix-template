import { Database } from '@kit/supabase/database';

type LineItems = Array<{
  id: string;
  quantity: number;
  product_id: string;
  variant_id: string;
  price_amount: number;
}>;

export type UpsertSubscriptionParams =
  Database['public']['Functions']['upsert_subscription']['Args'] & {
    line_items: LineItems & {
      interval: string;
      subscription_id: string;
      interval_count: number;
      type: 'per_seat' | 'flat' | 'metered';
    };
  };

export type UpsertOrderParams =
  Database['public']['Functions']['upsert_order']['Args'] & {
    line_items: LineItems;
  };

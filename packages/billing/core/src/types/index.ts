import { Database } from '@kit/supabase/database';

export type UpsertSubscriptionParams =
  Database['public']['Functions']['upsert_subscription']['Args'];

export type UpsertOrderParams =
  Database['public']['Functions']['upsert_order']['Args'];

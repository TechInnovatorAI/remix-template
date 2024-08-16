import { SupabaseClient } from '@supabase/supabase-js';

import { Database, Tables } from '@kit/supabase/database';
import { getSupabaseServerAdminClient } from '@kit/supabase/server-admin-client';

type Membership = Tables<'accounts_memberships'>;

export async function loadAdminAccountPage(accountId: string) {
  const client = getSupabaseServerAdminClient();
  const account = await getAccount(client, accountId);

  if (account.is_personal_account) {
    const [user, subscription, memberships] = await Promise.all([
      client.auth.admin.getUserById(accountId).then((data) => {
        if (data.error) {
          throw data.error;
        }

        return data.data.user;
      }),
      getSubscription(client, accountId),
      getMemberships(client, accountId),
    ]);

    return {
      is_personal_account: true as const,
      user,
      account,
      subscription,
      memberships,
    };
  }

  const [subscription, members] = await Promise.all([
    getSubscription(client, accountId),
    getMembers(client, accountId),
  ]);

  return {
    is_personal_account: false as const,
    account,
    subscription,
    members,
  };
}

async function getSubscription(
  client: SupabaseClient<Database>,
  accountId: string,
) {
  const subscriptions = await client
    .from('subscriptions')
    .select('*, subscription_items !inner (*)')
    .eq('account_id', accountId)
    .maybeSingle();

  if (subscriptions.error) {
    throw subscriptions.error;
  }

  return subscriptions.data;
}

async function getAccount(client: SupabaseClient<Database>, accountId: string) {
  const { data, error } = await client
    .from('accounts')
    .select('*')
    .eq('id', accountId)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

async function getMemberships(
  client: SupabaseClient<Database>,
  userId: string,
) {
  const memberships = await client
    .from('accounts_memberships')
    .select<
      string,
      Membership & {
        account: {
          id: string;
          name: string;
        };
      }
    >('*, account: account_id !inner (id, name)')
    .eq('user_id', userId);

  if (memberships.error) {
    throw memberships.error;
  }

  return memberships.data;
}

async function getMembers(
  client: SupabaseClient<Database>,
  accountSlug: string,
) {
  const members = await client.rpc('get_account_members', {
    account_slug: accountSlug,
  });

  if (members.error) {
    throw members.error;
  }

  return members.data;
}

import { SupabaseClient } from '@supabase/supabase-js';

import { Database } from '@kit/supabase/database';

export function createAdminDashboardService(client: SupabaseClient<Database>) {
  return new AdminDashboardService(client);
}

export class AdminDashboardService {
  constructor(private readonly client: SupabaseClient<Database>) {}

  /**
   * Get the dashboard data for the admin dashboard
   * @param count
   */
  async getDashboardData(
    { count }: { count: 'exact' | 'estimated' | 'planned' } = {
      count: 'estimated',
    },
  ) {
    const selectParams = {
      count,
      head: true,
    };

    const subscriptionsPromise = this.client
      .from('subscriptions')
      .select('*', selectParams)
      .eq('status', 'active')
      .then((response) => {
        if (response.error) {
          throw new Error(response.error.message);
        }

        return response.count;
      });

    const trialsPromise = this.client
      .from('subscriptions')
      .select('*', selectParams)
      .eq('status', 'trialing')
      .then((response) => {
        if (response.error) {
          throw new Error(response.error.message);
        }

        return response.count;
      });

    const accountsPromise = this.client
      .from('accounts')
      .select('*', selectParams)
      .eq('is_personal_account', true)
      .then((response) => {
        if (response.error) {
          throw new Error(response.error.message);
        }

        return response.count;
      });

    const teamAccountsPromise = this.client
      .from('accounts')
      .select('*', selectParams)
      .eq('is_personal_account', false)
      .then((response) => {
        if (response.error) {
          throw new Error(response.error.message);
        }

        return response.count;
      });

    const [subscriptions, trials, accounts, teamAccounts] = await Promise.all([
      subscriptionsPromise,
      trialsPromise,
      accountsPromise,
      teamAccountsPromise,
    ]);

    return {
      subscriptions,
      trials,
      accounts,
      teamAccounts,
    };
  }
}

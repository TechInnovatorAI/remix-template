import { SupabaseClient } from '@supabase/supabase-js';

import { Database } from '@kit/supabase/database';

/**
 * Class representing an API for interacting with user accounts.
 * @constructor
 * @param {SupabaseClient<Database>} client - The Supabase client instance.
 */
class AccountsApi {
  constructor(private readonly client: SupabaseClient<Database>) {}

  /**
   * @name getAccountWorkspace
   * @description Get the account workspace data.
   */
  async getAccountWorkspace() {
    const { data, error } = await this.client
      .from('user_account_workspace')
      .select(`*`)
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  /**
   * @name loadUserAccounts
   * Load the user accounts.
   */
  async loadUserAccounts() {
    const { data: accounts, error } = await this.client
      .from('user_accounts')
      .select(`name, slug, picture_url`);

    if (error) {
      throw error;
    }

    return accounts.map(({ name, slug, picture_url }) => {
      return {
        label: name,
        value: slug,
        image: picture_url,
      };
    });
  }

  /**
   * @name getSubscription
   * Get the subscription data for the given user.
   * @param accountId
   */
  async getSubscription(accountId: string) {
    const response = await this.client
      .from('subscriptions')
      .select('*, items: subscription_items !inner (*)')
      .eq('account_id', accountId)
      .maybeSingle();

    if (response.error) {
      throw response.error;
    }

    return response.data;
  }

  /**
   * Get the orders data for the given account.
   * @param accountId
   */
  async getOrder(accountId: string) {
    const response = await this.client
      .from('orders')
      .select('*, items: order_items !inner (*)')
      .eq('account_id', accountId)
      .maybeSingle();

    if (response.error) {
      throw response.error;
    }

    return response.data;
  }

  /**
   * @name getCustomerId
   * Get the billing customer ID for the given user.
   * If the user does not have a billing customer ID, it will return null.
   * @param accountId
   */
  async getCustomerId(accountId: string) {
    const response = await this.client
      .from('billing_customers')
      .select('customer_id')
      .eq('account_id', accountId)
      .maybeSingle();

    if (response.error) {
      throw response.error;
    }

    return response.data?.customer_id;
  }
}

export function createAccountsApi(client: SupabaseClient<Database>) {
  return new AccountsApi(client);
}

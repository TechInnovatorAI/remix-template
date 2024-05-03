import { SupabaseClient } from '@supabase/supabase-js';

import { Database } from '@kit/supabase/database';

/**
 * Class representing an API for interacting with team accounts.
 * @constructor
 * @param {SupabaseClient<Database>} client - The Supabase client instance.
 */
export class TeamAccountsApi {
  constructor(private readonly client: SupabaseClient<Database>) {}

  /**
   * @name getTeamAccountById
   * @description Check if the user is already in the account.
   * @param accountId
   */
  async getTeamAccountById(accountId: string) {
    const { data, error } = await this.client
      .from('accounts')
      .select('*')
      .eq('id', accountId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data;
  }

  /**
   * @name getSubscription
   * @description Get the subscription data for the account.
   * @param accountId
   */
  async getSubscription(accountId: string) {
    const { data, error } = await this.client
      .from('subscriptions')
      .select('*')
      .eq('account_id', accountId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data;
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
   * @name getAccountWorkspace
   * @description Get the account workspace data.
   * @param slug
   */
  async getAccountWorkspace(slug: string) {
    const accountPromise = this.client.rpc('team_account_workspace', {
      account_slug: slug,
    });

    const accountsPromise = this.client.from('user_accounts').select('*');

    const [
      accountResult,
      accountsResult,
      {
        data: { user },
      },
    ] = await Promise.all([
      accountPromise,
      accountsPromise,
      this.client.auth.getUser(),
    ]);

    if (accountResult.error) {
      return {
        error: accountResult.error,
        data: null,
      };
    }

    if (accountsResult.error) {
      return {
        error: accountsResult.error,
        data: null,
      };
    }

    if (!user) {
      return {
        error: new Error('User is not logged in'),
        data: null,
      };
    }

    const accountData = accountResult.data[0];

    if (!accountData) {
      return {
        error: new Error('Account data not found'),
        data: null,
      };
    }

    return {
      data: {
        account: accountData,
        accounts: accountsResult.data,
        user,
      },
      error: null,
    };
  }

  /**
   * @name hasPermission
   * @description Check if the user has permission to manage billing for the account.
   */
  async hasPermission(params: {
    accountId: string;
    userId: string;
    permission: Database['public']['Enums']['app_permissions'];
  }) {
    const { data, error } = await this.client.rpc('has_permission', {
      account_id: params.accountId,
      user_id: params.userId,
      permission_name: params.permission,
    });

    if (error) {
      throw error;
    }

    return data;
  }

  /**
   * @name getMembersCount
   * @description Get the number of members in the account.
   * @param accountId
   */
  async getMembersCount(accountId: string) {
    const { count, error } = await this.client
      .from('accounts_memberships')
      .select('*', {
        head: true,
        count: 'exact',
      })
      .eq('account_id', accountId);

    if (error) {
      throw error;
    }

    return count;
  }

  /**
   * @name getCustomerId
   * @description Get the billing customer ID for the given account.
   * @param accountId
   */
  async getCustomerId(accountId: string) {
    const { data, error } = await this.client
      .from('billing_customers')
      .select('customer_id')
      .eq('account_id', accountId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data?.customer_id;
  }

  /**
   * @name getInvitation
   * @description Get the invitation data from the invite token.
   * @param adminClient - The admin client instance. Since the user is not yet part of the account, we need to use an admin client to read the pending membership
   * @param token - The invitation token.
   */
  async getInvitation(adminClient: SupabaseClient<Database>, token: string) {
    const { data: invitation, error } = await adminClient
      .from('invitations')
      .select<
        string,
        {
          id: string;
          account: {
            id: string;
            name: string;
            slug: string;
            picture_url: string;
          };
        }
      >(
        'id, expires_at, account: account_id !inner (id, name, slug, picture_url)',
      )
      .eq('invite_token', token)
      .gte('expires_at', new Date().toISOString())
      .single();

    if (!invitation ?? error) {
      return null;
    }

    return invitation;
  }
}

export function createTeamAccountsApi(client: SupabaseClient<Database>) {
  return new TeamAccountsApi(client);
}

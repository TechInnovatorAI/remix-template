import { SupabaseClient } from '@supabase/supabase-js';

import { getLogger } from '@kit/shared/logger';
import { Database } from '@kit/supabase/database';

export function createDeleteTeamAccountService() {
  return new DeleteTeamAccountService();
}

class DeleteTeamAccountService {
  private readonly namespace = 'accounts.delete-team-account';

  /**
   * Deletes a team account. Permissions are not checked here, as they are
   * checked in the server action.
   *
   * USE WITH CAUTION. THE USER MUST HAVE THE NECESSARY PERMISSIONS.
   *
   * @param adminClient
   * @param params
   */
  async deleteTeamAccount(
    adminClient: SupabaseClient<Database>,
    params: {
      accountId: string;
      userId: string;
    },
  ) {
    const logger = await getLogger();

    const ctx = {
      accountId: params.accountId,
      userId: params.userId,
      name: this.namespace,
    };

    logger.info(ctx, `Requested team account deletion. Processing...`);

    // we can use the admin client to delete the account.
    const { error } = await adminClient
      .from('accounts')
      .delete()
      .eq('id', params.accountId);

    if (error) {
      logger.error(
        {
          ...ctx,
          error,
        },
        'Failed to delete team account',
      );

      throw new Error('Failed to delete team account');
    }

    logger.info(ctx, 'Successfully deleted team account');
  }
}

import { SupabaseClient } from '@supabase/supabase-js';

import { getLogger } from '@kit/shared/logger';
import { Database } from '@kit/supabase/database';

export function createDeletePersonalAccountService() {
  return new DeletePersonalAccountService();
}

/**
 * @name DeletePersonalAccountService
 * @description Service for managing accounts in the application
 * @param Database - The Supabase database type to use
 * @example
 * const client = getSupabaseClient();
 * const accountsService = new DeletePersonalAccountService();
 */
class DeletePersonalAccountService {
  private namespace = 'accounts.delete';

  /**
   * @name deletePersonalAccount
   * Delete personal account of a user.
   * This will delete the user from the authentication provider and cancel all subscriptions.
   *
   * Permissions are not checked here, as they are checked in the server action.
   * USE WITH CAUTION. THE USER MUST HAVE THE NECESSARY PERMISSIONS.
   */
  async deletePersonalAccount(params: {
    adminClient: SupabaseClient<Database>;

    userId: string;
    userEmail: string | null;

    emailSettings: {
      fromEmail: string;
      productName: string;
    };
  }) {
    const logger = await getLogger();

    const userId = params.userId;
    const ctx = { userId, name: this.namespace };

    logger.info(
      ctx,
      'User requested to delete their personal account. Processing...',
    );

    // execute the deletion of the user
    try {
      await params.adminClient.auth.admin.deleteUser(userId);
    } catch (error) {
      logger.error(
        {
          ...ctx,
          error,
        },
        'Encountered an error deleting user',
      );

      throw new Error('Error deleting user');
    }

    logger.info(ctx, 'User successfully deleted!');
  }
}

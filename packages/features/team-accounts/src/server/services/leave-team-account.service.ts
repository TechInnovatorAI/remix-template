import { SupabaseClient } from '@supabase/supabase-js';

import { z } from 'zod';

import { getLogger } from '@kit/shared/logger';
import { Database } from '@kit/supabase/database';

const Schema = z.object({
  accountId: z.string().uuid(),
  userId: z.string().uuid(),
});

export function createLeaveTeamAccountService(
  client: SupabaseClient<Database>,
) {
  return new LeaveTeamAccountService(client);
}

/**
 * @name LeaveTeamAccountService
 * @description Service for leaving a team account.
 */
class LeaveTeamAccountService {
  private readonly namespace = 'leave-team-account';

  constructor(private readonly adminClient: SupabaseClient<Database>) {}

  /**
   * @name leaveTeamAccount
   * @description Leave a team account
   * @param params
   */
  async leaveTeamAccount(params: z.infer<typeof Schema>) {
    const logger = await getLogger();

    const ctx = {
      ...params,
      name: this.namespace,
    };

    logger.info(ctx, 'Leaving team account...');

    const { accountId, userId } = Schema.parse(params);

    const { error } = await this.adminClient
      .from('accounts_memberships')
      .delete()
      .match({
        account_id: accountId,
        user_id: userId,
      });

    if (error) {
      logger.error({ ...ctx, error }, 'Failed to leave team account');

      throw new Error('Failed to leave team account');
    }

    logger.info(ctx, 'Successfully left team account');
  }
}

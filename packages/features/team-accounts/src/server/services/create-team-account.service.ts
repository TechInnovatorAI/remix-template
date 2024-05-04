import { SupabaseClient } from '@supabase/supabase-js';

import { getLogger } from '@kit/shared/logger';
import { Database } from '@kit/supabase/database';

export function createCreateTeamAccountService(
  client: SupabaseClient<Database>,
) {
  return new CreateTeamAccountService(client);
}

class CreateTeamAccountService {
  private readonly namespace = 'accounts.create-team-account';

  constructor(private readonly client: SupabaseClient<Database>) {}

  async createNewOrganizationAccount(params: { name: string; userId: string }) {
    const logger = await getLogger();
    const ctx = { ...params, namespace: this.namespace };

    logger.info(ctx, `Creating new team account...`);

    const { error, data } = await this.client.rpc('create_team_account', {
      account_name: params.name,
    });

    if (error) {
      logger.error(
        {
          error,
          ...ctx,
        },
        `Error creating team account`,
      );

      throw new Error('Error creating team account');
    }

    logger.info(ctx, `Team account created successfully`);

    return { data, error };
  }
}

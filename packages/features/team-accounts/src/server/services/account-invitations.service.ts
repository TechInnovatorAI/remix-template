import { SupabaseClient } from '@supabase/supabase-js';

import { addDays, formatISO } from 'date-fns';
import { z } from 'zod';

import { getLogger } from '@kit/shared/logger';
import { Database } from '@kit/supabase/database';

import type { DeleteInvitationSchema, InviteMembersSchema } from '../../schema';
import type { UpdateInvitationSchema } from '../../schema';

export function createAccountInvitationsService(
  client: SupabaseClient<Database>,
) {
  return new AccountInvitationsService(client);
}

/**
 * @name AccountInvitationsService
 * @description Service for managing account invitations.
 */
class AccountInvitationsService {
  private readonly namespace = 'invitations';

  constructor(private readonly client: SupabaseClient<Database>) {}

  /**
   * @name deleteInvitation
   * @description Removes an invitation from the database.
   * @param params
   */
  async deleteInvitation(params: z.infer<typeof DeleteInvitationSchema>) {
    const logger = await getLogger();

    const ctx = {
      name: this.namespace,
      ...params,
    };

    logger.info(ctx, 'Removing invitation...');

    const { data, error } = await this.client
      .from('invitations')
      .delete()
      .match({
        id: params.payload.invitationId,
      });

    if (error) {
      logger.error(ctx, `Failed to remove invitation`);

      throw error;
    }

    logger.info(ctx, 'Invitation successfully removed');

    return data;
  }

  /**
   * @name updateInvitation
   * @param params
   * @description Updates an invitation in the database.
   */
  async updateInvitation({ payload }: z.infer<typeof UpdateInvitationSchema>) {
    const logger = await getLogger();

    const ctx = {
      name: this.namespace,
      ...payload,
    };

    logger.info(ctx, 'Updating invitation...');

    const { data, error } = await this.client
      .from('invitations')
      .update({
        role: payload.role,
      })
      .match({
        id: payload.invitationId,
      });

    if (error) {
      logger.error(
        {
          ...ctx,
          error,
        },
        'Failed to update invitation',
      );

      throw error;
    }

    logger.info(ctx, 'Invitation successfully updated');

    return data;
  }

  /**
   * @name sendInvitations
   * @description Sends invitations to join a team.
   * @param accountSlug
   * @param invitations
   */
  async sendInvitations({
    accountSlug,
    invitations,
  }: {
    invitations: z.infer<typeof InviteMembersSchema>['payload']['invitations'];
    accountSlug: string;
  }) {
    const logger = await getLogger();

    const ctx = {
      accountSlug,
      name: this.namespace,
    };

    logger.info(ctx, 'Storing invitations...');

    const accountResponse = await this.client
      .from('accounts')
      .select('name')
      .eq('slug', accountSlug)
      .single();

    if (!accountResponse.data) {
      logger.error(
        ctx,
        'Account not found in database. Cannot send invitations.',
      );

      throw new Error('Account not found');
    }

    const response = await this.client.rpc('add_invitations_to_account', {
      invitations,
      account_slug: accountSlug,
    });

    if (response.error) {
      logger.error(
        {
          ...ctx,
          error: response.error,
        },
        `Failed to add invitations to account ${accountSlug}`,
      );

      throw response.error;
    }

    const responseInvitations = Array.isArray(response.data)
      ? response.data
      : [response.data];

    logger.info(
      {
        ...ctx,
        count: responseInvitations.length,
      },
      'Invitations added to account',
    );
  }

  /**
   * @name acceptInvitationToTeam
   * @description Accepts an invitation to join a team.
   */
  async acceptInvitationToTeam(
    adminClient: SupabaseClient<Database>,
    params: {
      userId: string;
      inviteToken: string;
    },
  ) {
    const logger = await getLogger();
    const ctx = {
      name: this.namespace,
      ...params,
    };

    logger.info(ctx, 'Accepting invitation to team');

    const { error, data } = await adminClient.rpc('accept_invitation', {
      token: params.inviteToken,
      user_id: params.userId,
    });

    if (error) {
      logger.error(
        {
          ...ctx,
          error,
        },
        'Failed to accept invitation to team',
      );

      throw error;
    }

    logger.info(ctx, 'Successfully accepted invitation to team');

    return data;
  }

  /**
   * @name renewInvitation
   * @description Renews an invitation to join a team by extending the expiration date by 7 days.
   * @param invitationId
   */
  async renewInvitation(invitationId: number) {
    const logger = await getLogger();

    const ctx = {
      invitationId,
      name: this.namespace,
    };

    logger.info(ctx, 'Renewing invitation...');

    const sevenDaysFromNow = formatISO(addDays(new Date(), 7));

    const { data, error } = await this.client
      .from('invitations')
      .update({
        expires_at: sevenDaysFromNow,
      })
      .match({
        id: invitationId,
      });

    if (error) {
      logger.error(
        {
          ...ctx,
          error,
        },
        'Failed to renew invitation',
      );

      throw error;
    }

    logger.info(ctx, 'Invitation successfully renewed');

    return data;
  }
}

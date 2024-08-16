import { SupabaseClient } from '@supabase/supabase-js';

import process from 'node:process';
import { z } from 'zod';

import { getLogger } from '@kit/shared/logger';
import { Database, Tables } from '@kit/supabase/database';

type Invitation = Tables<'invitations'>;

const invitePath = '/join';

const siteURL = import.meta.env.VITE_SITE_URL;
const productName = import.meta.env.VITE_PRODUCT_NAME ?? '';
const emailSender = process.env.EMAIL_SENDER;

const vars = z
  .object({
    invitePath: z.string().min(1),
    siteURL: z.string().min(1),
    productName: z.string(),
    emailSender: z.string().email(),
  })
  .parse({
    invitePath,
    siteURL,
    productName,
    emailSender,
  });

export function createAccountInvitationsWebhookService(
  client: SupabaseClient<Database>,
) {
  return new AccountInvitationsWebhookService(client);
}

class AccountInvitationsWebhookService {
  private namespace = 'accounts.invitations.webhook';

  constructor(private readonly adminClient: SupabaseClient<Database>) {}

  /**
   * @name handleInvitationWebhook
   * @description Handles the webhook event for invitations
   * @param invitation
   */
  async handleInvitationWebhook(invitation: Invitation) {
    return this.dispatchInvitationEmail(invitation);
  }

  private async dispatchInvitationEmail(invitation: Invitation) {
    const logger = await getLogger();

    logger.info(
      { invitation, name: this.namespace },
      'Handling invitation webhook event...',
    );

    const inviter = await this.adminClient
      .from('accounts')
      .select('email, name')
      .eq('id', invitation.invited_by)
      .single();

    if (inviter.error) {
      logger.error(
        {
          error: inviter.error,
          name: this.namespace,
        },
        'Failed to fetch inviter details',
      );

      throw inviter.error;
    }

    const team = await this.adminClient
      .from('accounts')
      .select('name')
      .eq('id', invitation.account_id)
      .single();

    if (team.error) {
      logger.error(
        {
          error: team.error,
          name: this.namespace,
        },
        'Failed to fetch team details',
      );

      throw team.error;
    }

    const ctx = {
      invitationId: invitation.id,
      name: this.namespace,
    };

    logger.info(ctx, 'Invite retrieved. Sending invitation email...');

    try {
      const { renderInviteEmail } = await import('@kit/email-templates');
      const { getMailer } = await import('@kit/mailers');

      const mailer = await getMailer();

      const { html, subject } = await renderInviteEmail({
        link: this.getInvitationLink(invitation.invite_token),
        invitedUserEmail: invitation.email,
        inviter: inviter.data.name ?? inviter.data.email ?? '',
        productName: vars.productName,
        teamName: team.data.name,
      });

      await mailer
        .sendEmail({
          from: vars.emailSender,
          to: invitation.email,
          subject,
          html,
        })
        .then(() => {
          logger.info(ctx, 'Invitation email successfully sent!');
        })
        .catch((error) => {
          console.error(error);

          logger.error({ error, ...ctx }, 'Failed to send invitation email');
        });

      return {
        success: true,
      };
    } catch (error) {
      console.error(error);
      logger.warn({ error, ...ctx }, 'Failed to invite user to team');

      return {
        error,
        success: false,
      };
    }
  }

  private getInvitationLink(token: string) {
    return (
      new URL(vars.invitePath, vars.siteURL).href + `?invite_token=${token}`
    );
  }
}

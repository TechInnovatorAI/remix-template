import process from 'node:process';
import { z } from 'zod';

import { getLogger } from '@kit/shared/logger';
import { Tables } from '@kit/supabase/database';

type Account = Tables<'accounts'>;

export function createAccountWebhooksService() {
  return new AccountWebhooksService();
}

class AccountWebhooksService {
  private readonly namespace = 'accounts.webhooks';

  async handleAccountDeletedWebhook(account: Account) {
    const logger = await getLogger();

    const ctx = {
      accountId: account.id,
      namespace: this.namespace,
    };

    logger.info(ctx, 'Received account deleted webhook. Processing...');

    if (account.is_personal_account) {
      logger.info(ctx, `Account is personal. We send an email to the user.`);

      await this.sendDeleteAccountEmail(account);
    }
  }

  private async sendDeleteAccountEmail(account: Account) {
    const userEmail = account.email;
    const userDisplayName = account.name ?? userEmail;

    const emailSettings = this.getEmailSettings();

    if (userEmail) {
      await this.sendAccountDeletionEmail({
        fromEmail: emailSettings.fromEmail,
        productName: emailSettings.productName,
        userDisplayName,
        userEmail,
      });
    }
  }

  private async sendAccountDeletionEmail(params: {
    fromEmail: string;
    userEmail: string;
    userDisplayName: string;
    productName: string;
  }) {
    const { renderAccountDeleteEmail } = await import('@kit/email-templates');
    const { getMailer } = await import('@kit/mailers');
    const mailer = await getMailer();

    const { html, subject } = await renderAccountDeleteEmail({
      userDisplayName: params.userDisplayName,
      productName: params.productName,
    });

    return mailer.sendEmail({
      to: params.userEmail,
      from: params.fromEmail,
      subject,
      html,
    });
  }

  private getEmailSettings() {
    const productName = import.meta.env.VITE_PRODUCT_NAME;
    const fromEmail = process.env.EMAIL_SENDER;

    return z
      .object({
        productName: z.string(),
        fromEmail: z.string().email(),
      })
      .parse({
        productName,
        fromEmail,
      });
  }
}

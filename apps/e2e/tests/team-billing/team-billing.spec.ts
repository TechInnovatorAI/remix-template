import { Page, expect, test } from '@playwright/test';

import { TeamBillingPageObject } from './team-billing.po';

test.describe('Team Billing', () => {
  let page: Page;
  let po: TeamBillingPageObject;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    po = new TeamBillingPageObject(page);
  });

  test('a team can subscribe to a plan', async () => {
    await po.setup();
    await po.teamAccounts.goToBilling();

    await po.billing.selectPlan(0);
    await po.billing.proceedToCheckout();

    await po.billing.stripe.waitForForm();
    await po.billing.stripe.fillForm();
    await po.billing.stripe.submitForm();

    await expect(po.billing.successStatus()).toBeVisible({
      timeout: 25_000,
    });

    await po.billing.returnToBilling();

    await expect(po.billing.getStatus()).toContainText('Active');
    await expect(po.billing.manageBillingButton()).toBeVisible();
  });
});

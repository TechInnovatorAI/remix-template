import { Page, expect } from '@playwright/test';

import { StripePageObject } from './stripe.po';

export class BillingPageObject {
  public readonly stripe: StripePageObject;

  constructor(private readonly page: Page) {
    this.stripe = new StripePageObject(page);
  }

  plans() {
    return this.page.locator('[data-test-plan]');
  }

  async selectPlan(index = 0) {
    await expect(async () => {
      const plans = this.plans();
      const plan = plans.nth(index);

      await expect(plan).toBeVisible();

      await this.page.waitForTimeout(500);

      await plan.click();
    }).toPass();
  }

  manageBillingButton() {
    return this.page.locator('[data-test="manage-billing-redirect-button"]');
  }

  successStatus() {
    return this.page.locator('[data-test="payment-return-success"]');
  }

  async returnToBilling() {
    // wait a bit for the webhook to be processed
    await this.page.waitForTimeout(1000);

    return this.page
      .locator('[data-test="checkout-success-back-link"]')
      .click();
  }

  proceedToCheckout() {
    return this.page.click('[data-test="checkout-submit-button"]');
  }

  getStatus() {
    return this.page.locator('[data-test="current-plan-card-status-badge"]');
  }
}

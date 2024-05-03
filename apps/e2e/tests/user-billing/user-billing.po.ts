import { Page } from '@playwright/test';
import { AuthPageObject } from '../authentication/auth.po';
import { BillingPageObject } from '../utils/billing.po';

export class UserBillingPageObject {
  private readonly auth: AuthPageObject;
  public readonly billing: BillingPageObject;

  constructor(page: Page) {
    this.auth = new AuthPageObject(page);
    this.billing = new BillingPageObject(page);
  }

  async setup() {
    await this.auth.signUpFlow('/home/billing');
  }
}
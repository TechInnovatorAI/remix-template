import { Page, expect } from '@playwright/test';

import { AuthPageObject } from '../authentication/auth.po';

export class AccountPageObject {
  private readonly page: Page;
  public auth: AuthPageObject;

  constructor(page: Page) {
    this.page = page;
    this.auth = new AuthPageObject(page);
  }

  async setup() {
    return this.auth.signUpFlow('/home/settings');
  }

  async updateName(name: string) {
    await this.page.fill('[data-test="update-account-name-form"] input', name);
    await this.page.click('[data-test="update-account-name-form"] button');
  }

  async updateEmail(email: string) {
    await expect(async () => {
      await this.page.fill(
        '[data-test="account-email-form-email-input"]',
        email,
      );

      await this.page.fill(
        '[data-test="account-email-form-repeat-email-input"]',
        email,
      );

      await this.page.click('[data-test="account-email-form"] button');
    }).toPass();
  }

  async updatePassword(password: string) {
    await this.page.fill(
      '[data-test="account-password-form-password-input"]',
      password,
    );
    await this.page.fill(
      '[data-test="account-password-form-repeat-password-input"]',
      password,
    );
    await this.page.click('[data-test="account-password-form"] button');
  }

  async deleteAccount() {
    await expect(async () => {
      await this.page.click('[data-test="delete-account-button"]');
      await this.page.fill(
        '[data-test="delete-account-input-field"]',
        'DELETE',
      );

      const click = this.page.click(
        '[data-test="confirm-delete-account-button"]',
      );

      const response = this.page
        .waitForResponse((resp) => {
          return (
            resp.url().includes('home/settings') &&
            resp.request().method() === 'POST'
          );
        })
        .then((response) => {
          expect(response.status()).toBe(204);
        });

      return Promise.all([click, response]);
    }).toPass();
  }

  getProfileName() {
    return this.page.locator('[data-test="account-dropdown-display-name"]');
  }
}

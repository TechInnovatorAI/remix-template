import { Page } from '@playwright/test';
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
    await this.page.fill('[data-test="account-email-form-email-input"]', email);
    await this.page.fill('[data-test="account-email-form-repeat-email-input"]', email);
    await this.page.click('[data-test="account-email-form"] button');
  }

  async updatePassword(password: string) {
    await this.page.fill('[data-test="account-password-form-password-input"]', password);
    await this.page.fill('[data-test="account-password-form-repeat-password-input"]', password);
    await this.page.click('[data-test="account-password-form"] button');
  }

  async deleteAccount() {
    await this.page.click('[data-test="delete-account-button"]');
    await this.page.fill('[data-test="delete-account-input-field"]', 'DELETE');
    await this.page.click('[data-test="confirm-delete-account-button"]');
  }

  getProfileName() {
    return this.page.locator('[data-test="account-dropdown-display-name"]');
  }
}
import { expect, Page } from '@playwright/test';
import { Mailbox } from '../utils/mailbox';

export class AuthPageObject {
  private readonly page: Page;
  private readonly mailbox: Mailbox;

  constructor(page: Page) {
    this.page = page;
    this.mailbox = new Mailbox(page);
  }

  goToSignIn() {
    return this.page.goto('/auth/sign-in');
  }

  goToSignUp() {
    return this.page.goto('/auth/sign-up');
  }

  signOut() {
    return expect(async () => {
      await this.page.click('[data-test="account-dropdown-trigger"]');
      await this.page.click('[data-test="account-dropdown-sign-out"]');

      await this.page.waitForURL('**/');
    }).toPass();
  }

  async signIn(params: {
    email: string,
    password: string
  }) {
    await expect(async() => {
      await this.page.waitForTimeout(1000);

      await this.page.fill('input[name="email"]', params.email);
      await this.page.fill('input[name="password"]', params.password);
      await this.page.click('button[type="submit"]');

      await this.page.waitForURL('**/home');
    }).toPass();
  }

  async signUp(params: {
    email: string,
    password: string,
    repeatPassword: string
  }) {
    await expect(async() => {
      await this.page.waitForTimeout(1000);

      await this.page.fill('input[name="email"]', params.email);
      await this.page.fill('input[name="password"]', params.password);
      await this.page.fill('input[name="repeatPassword"]', params.repeatPassword);

      const signUp = this.page.click('button[type="submit"]');

      const response = this.page.waitForResponse((resp) => {
        return resp.url().includes('auth');
      });

      await Promise.all([signUp, response]);
    }).toPass();
  }

  async visitConfirmEmailLink(email: string, params: {
    deleteAfter: boolean
  } = {
    deleteAfter: true
  }) {
    return expect(async() => {
      const res = await this.mailbox.visitMailbox(email, params);

      expect(res).not.toBeNull();
    }).toPass();
  }

  createRandomEmail() {
    const value = Math.random() * 10000000000;

    return `${value.toFixed(0)}@makerkit.dev`;
  }

  async signUpFlow(path: string) {
    const email = this.createRandomEmail();

    await this.page.goto(`/auth/sign-up?next=${path}`);

    await this.signUp({
      email,
      password: 'password',
      repeatPassword: 'password',
    });

    await this.visitConfirmEmailLink(email);
  }
}
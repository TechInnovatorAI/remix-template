import { Page, expect } from '@playwright/test';

import { AuthPageObject } from '../authentication/auth.po';

export class TeamAccountsPageObject {
  private readonly page: Page;
  public auth: AuthPageObject;

  constructor(page: Page) {
    this.page = page;
    this.auth = new AuthPageObject(page);
  }

  async setup(params = this.createTeamName()) {
    await this.auth.signUpFlow('/home');

    await this.createTeam(params);
  }

  getTeamFromSelector(teamName: string) {
    return this.page.locator(`[data-test="account-selector-team"]`, {
      hasText: teamName,
    });
  }

  getTeams() {
    return this.page.locator('[data-test="account-selector-team"]');
  }

  goToSettings() {
    return this.page
      .locator('a', {
        hasText: 'Settings',
      })
      .click();
  }

  goToBilling() {
    return this.page
      .locator('a', {
        hasText: 'Billing',
      })
      .click();
  }

  async openAccountsSelector() {
    await expect(async () => {
      await this.page.click('[data-test="account-selector-trigger"]');

      return expect(
        this.page.locator('[data-test="account-selector-content"]'),
      ).toBeVisible();
    }).toPass();
  }

  async createTeam({ teamName, slug } = this.createTeamName()) {
    await this.openAccountsSelector();

    await this.page.click('[data-test="create-team-account-trigger"]');
    await this.page.fill('[data-test="create-team-form"] input', teamName);
    await this.page.click('[data-test="create-team-form"] button:last-child');

    await this.page.waitForURL(`/home/${slug}`);
  }

  async updateName(name: string, slug: string) {
    await expect(async () => {
      await this.page.fill(
        '[data-test="update-team-account-name-form"] input',
        name,
      );

      await this.page.click(
        '[data-test="update-team-account-name-form"] button',
      );

      // the slug should be updated to match the new team name
      await expect(this.page).toHaveURL(
        `http://localhost:5173/home/${slug}/settings`,
      );
    }).toPass();
  }

  async deleteAccount(teamName: string) {
    await expect(async () => {
      await this.page.click('[data-test="delete-team-trigger"]');

      await expect(
        this.page.locator('[data-test="delete-team-form-confirm-input"]'),
      ).toBeVisible();

      await this.page.fill(
        '[data-test="delete-team-form-confirm-input"]',
        teamName,
      );

      await this.page.click('[data-test="delete-team-form-confirm-button"]');

      await this.page.waitForURL('http://localhost:5173/home');
    }).toPass();
  }

  createTeamName() {
    const random = (Math.random() * 100000000).toFixed(0);

    const teamName = `Team-Name-${random}`;
    const slug = `team-name-${random}`;

    return { teamName, slug };
  }
}

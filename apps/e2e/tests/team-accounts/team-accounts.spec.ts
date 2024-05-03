import { Page, expect, test } from '@playwright/test';

import { TeamAccountsPageObject } from './team-accounts.po';

test.describe('Team Accounts', () => {
  let page: Page;
  let teamAccounts: TeamAccountsPageObject;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    teamAccounts = new TeamAccountsPageObject(page);
  });

  test('user can update their team name (and slug)', async () => {
    await teamAccounts.setup();

    const { teamName, slug } = teamAccounts.createTeamName();

    await teamAccounts.goToSettings();
    await teamAccounts.updateName(teamName);

    // the slug should be updated to match the new team name
    await page.waitForURL(`http://localhost:3000/home/${slug}/settings`);

    await teamAccounts.openAccountsSelector();

    await expect(teamAccounts.getTeamFromSelector(slug)).toBeVisible();
  });
});

test.describe('Account Deletion', () => {
  test('user can delete their team account', async ({ page }) => {
    const teamAccounts = new TeamAccountsPageObject(page);
    const params = teamAccounts.createTeamName();

    await teamAccounts.setup(params);
    await teamAccounts.goToSettings();

    await teamAccounts.deleteAccount(params.teamName);
    await teamAccounts.openAccountsSelector();

    await expect(
      teamAccounts.getTeamFromSelector(params.slug),
    ).not.toBeVisible();
  });
});

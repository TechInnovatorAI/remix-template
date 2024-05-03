import { expect, Page, test } from '@playwright/test';
import { AccountPageObject } from './account.po';

test.describe('Account Settings', () => {
  let page: Page;
  let account: AccountPageObject;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    account = new AccountPageObject(page);

    await account.setup();
  });

  test('user can update their profile name', async () => {
    const name = 'John Doe';

    await account.updateName(name);

    await page.waitForResponse((resp) => {
      return resp.url().includes('accounts');
    });

    await expect(account.getProfileName()).toHaveText(name);
  });

  test('user can update their email', async () => {
    const email = account.auth.createRandomEmail();

    await account.updateEmail(email);

    const req = await page.waitForResponse((resp) => {
      return resp.url().includes('auth/v1/user');
    });

    expect(req.status()).toBe(200);
  });

  test('user can update their password', async () => {
    const password = (Math.random() * 100000).toString();

    await account.updatePassword(password);

    await page.waitForResponse((resp) => {
      return resp.url().includes('auth/v1/user');
    });

    await account.auth.signOut();
  });
});

test.describe('Account Deletion', () => {
  test('user can delete their own account', async ({ page }) => {
    const account = new AccountPageObject(page);

    await account.setup();
    await account.deleteAccount();

    const response = await page.waitForResponse((resp) => {
      return resp.url().includes('home/settings') &&
        resp.request().method() === 'POST';
    });

    // The server should respond with a 303 redirect
    expect(response.status()).toBe(303);
  });
});
import { expect, test } from '@playwright/test';

import { AuthPageObject } from './auth.po';

test.describe('Auth flow', () => {
  test.describe.configure({ mode: 'serial' });

  let email: string;

  test('will sign-up and redirect to the home page', async ({ page }) => {
    const auth = new AuthPageObject(page);
    await auth.goToSignUp();

    email = auth.createRandomEmail();

    console.log(`Signing up with email ${email} ...`);

    await auth.signUp({
      email,
      password: 'password',
      repeatPassword: 'password',
    });

    await auth.visitConfirmEmailLink(email);

    await page.waitForURL('**/home');
  });

  test('will sign-in with the correct credentials', async ({ page }) => {
    const auth = new AuthPageObject(page);
    await auth.goToSignIn();

    console.log(`Signing in with email ${email} ...`);

    await auth.signIn({
      email,
      password: 'password',
    });

    await auth.signOut();

    expect(page.url()).toContain('/');
  });
});

test.describe('Protected routes', () => {
  test('will redirect to the sign-in page if not authenticated', async ({
    page,
  }) => {
    await page.goto('/home/settings');

    expect(page.url()).toContain('/auth/sign-in?next=/home/settings');
  });

  test('will return a 404 for the admin page', async ({ page }) => {
    await page.goto('/admin');

    expect(page.url()).toContain('/auth/sign-in');
  });
});

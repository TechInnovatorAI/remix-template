import { Page, expect, test } from '@playwright/test';

import { InvitationsPageObject } from './invitations.po';

test.describe('Invitations', () => {
  let page: Page;
  let invitations: InvitationsPageObject;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    invitations = new InvitationsPageObject(page);

    await invitations.setup();
  });

  test('users can delete invites', async () => {
    await invitations.navigateToMembers();
    await invitations.openInviteForm();

    const email = invitations.auth.createRandomEmail();

    const invites = [
      {
        email,
        role: 'member',
      },
    ];

    await invitations.inviteMembers(invites);

    await expect(invitations.getInvitations()).toHaveCount(1);

    await invitations.deleteInvitation(email);

    await expect(invitations.getInvitations()).toHaveCount(0);
  });

  test('users can update invites', async () => {
    await invitations.navigateToMembers();
    await invitations.openInviteForm();

    const email = invitations.auth.createRandomEmail();

    const invites = [
      {
        email,
        role: 'member',
      },
    ];

    await invitations.inviteMembers(invites);

    await expect(invitations.getInvitations()).toHaveCount(1);

    await invitations.updateInvitation(email, 'owner');

    const row = invitations.getInvitationRow(email);

    await expect(row.locator('[data-test="member-role-badge"]')).toHaveText(
      'Owner',
    );
  });
});

test.describe('Full Invitation Flow', () => {
  let page: Page;
  let invitations: InvitationsPageObject;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    invitations = new InvitationsPageObject(page);

    await invitations.setup();
  });

  test('should invite users and let users accept an invite', async () => {
    await invitations.navigateToMembers();
    await invitations.openInviteForm();

    const invites = [
      {
        email: invitations.auth.createRandomEmail(),
        role: 'member',
      },
      {
        email: invitations.auth.createRandomEmail(),
        role: 'member',
      },
    ];

    await invitations.inviteMembers(invites);

    const firstEmail = invites[0]!.email;

    await expect(invitations.getInvitations()).toHaveCount(2);

    // sign out and sign in with the first email
    await invitations.auth.signOut();

    await invitations.auth.visitConfirmEmailLink(invites[0]!.email);

    console.log(`Signing up with ${firstEmail}`);

    await invitations.auth.signUp({
      email: firstEmail,
      password: 'password',
      repeatPassword: 'password',
    });

    await invitations.auth.visitConfirmEmailLink(firstEmail);

    console.log(`Accepting invitation as ${firstEmail}`);

    await invitations.acceptInvitation();

    await invitations.teamAccounts.openAccountsSelector();

    await expect(invitations.teamAccounts.getTeams()).toHaveCount(1);
  });
});

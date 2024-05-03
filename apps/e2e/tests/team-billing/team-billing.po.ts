import { Page } from '@playwright/test';

import { TeamAccountsPageObject } from '../team-accounts/team-accounts.po';
import { BillingPageObject } from '../utils/billing.po';

export class TeamBillingPageObject {
  public readonly teamAccounts: TeamAccountsPageObject;
  public readonly billing: BillingPageObject;

  constructor(page: Page) {
    this.teamAccounts = new TeamAccountsPageObject(page);
    this.billing = new BillingPageObject(page);
  }

  setup() {
    return this.teamAccounts.setup();
  }
}

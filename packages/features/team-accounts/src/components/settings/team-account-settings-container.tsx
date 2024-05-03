'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@kit/ui/card';
import { Trans } from '@kit/ui/trans';

import { TeamAccountDangerZone } from './team-account-danger-zone';
import { UpdateTeamAccountImage } from './update-team-account-image-container';
import { UpdateTeamAccountNameForm } from './update-team-account-name-form';

export function TeamAccountSettingsContainer(props: {
  account: {
    name: string;
    slug: string;
    id: string;
    pictureUrl: string | null;
    primaryOwnerUserId: string;
  };

  paths: {
    teamAccountSettings: string;
  };
}) {
  return (
    <div className={'flex w-full flex-col space-y-6'}>
      <Card>
        <CardHeader>
          <CardTitle>
            <Trans i18nKey={'teams:settings.teamLogo'} />
          </CardTitle>

          <CardDescription>
            <Trans i18nKey={'teams:settings.teamLogoDescription'} />
          </CardDescription>
        </CardHeader>

        <CardContent>
          <UpdateTeamAccountImage account={props.account} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <Trans i18nKey={'teams:settings.teamName'} />
          </CardTitle>

          <CardDescription>
            <Trans i18nKey={'teams:settings.teamNameDescription'} />
          </CardDescription>
        </CardHeader>

        <CardContent>
          <UpdateTeamAccountNameForm
            path={props.paths.teamAccountSettings}
            account={props.account}
          />
        </CardContent>
      </Card>

      <Card className={'border-destructive border-2'}>
        <CardHeader>
          <CardTitle>
            <Trans i18nKey={'teams:settings.dangerZone'} />
          </CardTitle>

          <CardDescription>
            <Trans i18nKey={'teams:settings.dangerZoneDescription'} />
          </CardDescription>
        </CardHeader>

        <CardContent>
          <TeamAccountDangerZone
            primaryOwnerUserId={props.account.primaryOwnerUserId}
            account={props.account}
          />
        </CardContent>
      </Card>
    </div>
  );
}

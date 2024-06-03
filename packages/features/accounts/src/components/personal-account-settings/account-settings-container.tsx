'use client';

import { useTranslation } from 'react-i18next';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@kit/ui/card';
import { If } from '@kit/ui/if';
import { LanguageSelector } from '@kit/ui/language-selector';
import { LoadingOverlay } from '@kit/ui/loading-overlay';
import { Trans } from '@kit/ui/trans';

import { usePersonalAccountData } from '../../hooks/use-personal-account-data';
import { AccountDangerZone } from './account-danger-zone';
import { UpdateEmailFormContainer } from './email/update-email-form-container';
import { MultiFactorAuthFactorsList } from './mfa/multi-factor-auth-list';
import { UpdatePasswordFormContainer } from './password/update-password-container';
import { UpdateAccountDetailsFormContainer } from './update-account-details-form-container';
import { UpdateAccountImageContainer } from './update-account-image-container';

export function PersonalAccountSettingsContainer(
  props: React.PropsWithChildren<{
    userId: string;

    features: {
      enableAccountDeletion: boolean;
    };

    paths: {
      callback: string;
    };
  }>,
) {
  const supportsLanguageSelection = useSupportMultiLanguage();
  const user = usePersonalAccountData(props.userId);

  if (!user.data || user.isPending) {
    return <LoadingOverlay fullPage />;
  }

  return (
    <div className={'flex w-full flex-col space-y-6 pb-32'}>
      <Card>
        <CardHeader>
          <CardTitle>
            <Trans i18nKey={'account:accountImage'} />
          </CardTitle>

          <CardDescription>
            <Trans i18nKey={'account:accountImageDescription'} />
          </CardDescription>
        </CardHeader>

        <CardContent>
          <UpdateAccountImageContainer
            user={{
              pictureUrl: user.data.picture_url,
              id: user.data.id,
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <Trans i18nKey={'account:name'} />
          </CardTitle>

          <CardDescription>
            <Trans i18nKey={'account:nameDescription'} />
          </CardDescription>
        </CardHeader>

        <CardContent>
          <UpdateAccountDetailsFormContainer user={user.data} />
        </CardContent>
      </Card>

      <If condition={supportsLanguageSelection}>
        <Card>
          <CardHeader>
            <CardTitle>
              <Trans i18nKey={'account:language'} />
            </CardTitle>

            <CardDescription>
              <Trans i18nKey={'account:languageDescription'} />
            </CardDescription>
          </CardHeader>

          <CardContent>
            <LanguageSelector />
          </CardContent>
        </Card>
      </If>

      <Card>
        <CardHeader>
          <CardTitle>
            <Trans i18nKey={'account:updateEmailCardTitle'} />
          </CardTitle>

          <CardDescription>
            <Trans i18nKey={'account:updateEmailCardDescription'} />
          </CardDescription>
        </CardHeader>

        <CardContent>
          <UpdateEmailFormContainer callbackPath={props.paths.callback} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <Trans i18nKey={'account:updatePasswordCardTitle'} />
          </CardTitle>

          <CardDescription>
            <Trans i18nKey={'account:updatePasswordCardDescription'} />
          </CardDescription>
        </CardHeader>

        <CardContent>
          <UpdatePasswordFormContainer callbackPath={props.paths.callback} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <Trans i18nKey={'account:multiFactorAuth'} />
          </CardTitle>

          <CardDescription>
            <Trans i18nKey={'account:multiFactorAuthDescription'} />
          </CardDescription>
        </CardHeader>

        <CardContent>
          <MultiFactorAuthFactorsList />
        </CardContent>
      </Card>

      <If condition={props.features.enableAccountDeletion}>
        <Card className={'border-destructive border-2'}>
          <CardHeader>
            <CardTitle>
              <Trans i18nKey={'account:dangerZone'} />
            </CardTitle>

            <CardDescription>
              <Trans i18nKey={'account:dangerZoneDescription'} />
            </CardDescription>
          </CardHeader>

          <CardContent>
            <AccountDangerZone />
          </CardContent>
        </Card>
      </If>
    </div>
  );
}

function useSupportMultiLanguage() {
  const { i18n } = useTranslation();
  const langs = (i18n?.options?.supportedLngs as string[]) ?? [];

  const supportedLangs = langs.filter((lang) => lang !== 'cimode');

  return supportedLangs.length > 1;
}

import { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';

import { PersonalAccountSettingsContainer } from '@kit/accounts/personal-account-settings';
import { PageBody } from '@kit/ui/page';
import { Trans } from '@kit/ui/trans';

import featureFlagsConfig from '~/config/feature-flags.config';
import pathsConfig from '~/config/paths.config';
import { createI18nServerInstance } from '~/lib/i18n/i18n.server';
import { HomeLayoutPageHeader } from '~/routes/home._user/_components/home-page-header';

const features = {
  enableAccountDeletion: featureFlagsConfig.enableAccountDeletion,
};

const paths = {
  callback: pathsConfig.auth.callback + `?next=${pathsConfig.app.accountHome}`,
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    {
      title: data?.title,
    },
  ];
};

export const loader = async (args: LoaderFunctionArgs) => {
  const i18n = await createI18nServerInstance(args.request);
  const title = i18n.t('account:settingsTab');

  return {
    title,
  };
};

export default function PersonalAccountSettingsPage() {
  return (
    <>
      <HomeLayoutPageHeader
        title={<Trans i18nKey={'account:accountTabLabel'} />}
        description={<Trans i18nKey={'account:accountTabDescription'} />}
      />

      <PageBody>
        <div className={'flex w-full flex-1 flex-col lg:max-w-2xl'}>
          <PersonalAccountSettingsContainer features={features} paths={paths} />
        </div>
      </PageBody>
    </>
  );
}

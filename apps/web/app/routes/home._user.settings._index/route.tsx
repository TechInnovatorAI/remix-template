import { MetaFunction, useLoaderData } from '@remix-run/react';
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from '@remix-run/server-runtime';

import { deletePersonalAccountAction } from '@kit/accounts/actions';
import { PersonalAccountSettingsContainer } from '@kit/accounts/personal-account-settings';
import { DeletePersonalAccountSchema } from '@kit/accounts/schema';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { AppBreadcrumbs } from '@kit/ui/app-breadcrumbs';
import { PageBody } from '@kit/ui/page';
import { Trans } from '@kit/ui/trans';

import featureFlagsConfig from '~/config/feature-flags.config';
import pathsConfig from '~/config/paths.config';
import { createI18nServerInstance } from '~/lib/i18n/i18n.server';
import { requireUserLoader } from '~/lib/require-user-loader';
import { HomeLayoutPageHeader } from '~/routes/home._user/_components/home-page-header';

const features = {
  enableAccountDeletion: featureFlagsConfig.enableAccountDeletion,
};

const paths = {
  callback: pathsConfig.auth.callback + `?next=${pathsConfig.app.accountHome}`,
};

const ActionsSchema = DeletePersonalAccountSchema;

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    {
      title: data?.title,
    },
  ];
};

export const loader = async (args: LoaderFunctionArgs) => {
  // require user
  const user = await requireUserLoader(args.request);

  const i18n = await createI18nServerInstance(args.request);
  const title = i18n.t('account:settingsTab');

  return {
    title,
    userId: user.id,
  };
};

export default function PersonalAccountSettingsPage() {
  const { userId } = useLoaderData<typeof loader>();

  return (
    <>
      <HomeLayoutPageHeader
        title={<Trans i18nKey={'account:accountTabLabel'} />}
        description={<AppBreadcrumbs />}
      />

      <PageBody>
        <div className={'flex w-full flex-1 flex-col lg:max-w-2xl'}>
          <PersonalAccountSettingsContainer
            userId={userId}
            features={features}
            paths={paths}
          />
        </div>
      </PageBody>
    </>
  );
}

export const action = async (args: ActionFunctionArgs) => {
  const json = ActionsSchema.parse(await args.request.json());
  const client = getSupabaseServerClient(args.request);

  switch (json.intent) {
    case 'delete-account':
      return deletePersonalAccountAction({ client });

    default:
      return new Response('Invalid action', { status: 400 });
  }
};

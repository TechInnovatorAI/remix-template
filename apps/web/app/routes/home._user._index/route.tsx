import { LoaderFunctionArgs } from '@remix-run/node';
import { PageBody, PageHeader } from '@kit/ui/page';
import { Trans } from '@kit/ui/trans';

import { createI18nServerInstance } from '~/lib/i18n/i18n.server';
import { requireUserLoader } from '~/lib/require-user-loader';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireUserLoader(request);

  const i18n = await createI18nServerInstance(request);
  const title = i18n.t('account:homePage');

  return {
    title,
  };
};

export default function UserHomePage() {
  return (
    <>
      <PageHeader
        title={<Trans i18nKey={'common:homeTabLabel'} />}
        description={<Trans i18nKey={'common:homeTabDescription'} />}
      />

      <PageBody></PageBody>
    </>
  );
}

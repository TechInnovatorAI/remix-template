import { MetaFunction, useLoaderData } from '@remix-run/react';
import type { LoaderFunctionArgs } from '@remix-run/server-runtime';

import { PricingTable } from '@kit/billing-gateway/marketing';

import billingConfig from '~/config/billing.config';
import pathsConfig from '~/config/paths.config';
import { createI18nServerInstance } from '~/lib/i18n/i18n.server';
import { SitePageHeader } from '~/routes/_marketing/_components/site-page-header';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { t } = await createI18nServerInstance(request);

  return {
    title: t('marketing:pricing'),
    subtitle: t('marketing:pricingSubtitle'),
  };
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    {
      title: data?.title,
    },
  ];
};

const paths = {
  signUp: pathsConfig.auth.signUp,
  subscription: pathsConfig.app.personalAccountBilling,
};

export default function PricingPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className={'flex flex-col space-y-12'}>
      <SitePageHeader title={data.title} subtitle={data.subtitle} />

      <div className={'container mx-auto pb-8 xl:pb-16'}>
        <PricingTable paths={paths} config={billingConfig} />
      </div>
    </div>
  );
}

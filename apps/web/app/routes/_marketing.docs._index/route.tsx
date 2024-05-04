import { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import { Cms } from '@kit/cms';
import { PageBody } from '@kit/ui/page';

import { createI18nServerInstance } from '~/lib/i18n/i18n.server';
import { DocsCards } from '~/routes/_marketing.docs/_components/docs-cards';
import { getDocs } from '~/routes/_marketing.docs/_lib/get-docs';
import { SitePageHeader } from '~/routes/_marketing/_components/site-page-header';

export const loader = async (args: LoaderFunctionArgs) => {
  const { t, resolvedLanguage: language } = await createI18nServerInstance(
    args.request,
  );

  const items = await getDocs(language);

  return {
    title: t('marketing:documentation'),
    description: t('marketing:documentationSubtitle'),
    items,
  };
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    {
      title: data?.title,
      description: data?.description,
    },
  ];
};

export default function DocsPage() {
  const { items, title, description } = useLoaderData<typeof loader>();

  return (
    <PageBody>
      <div className={'flex flex-col space-y-8 xl:space-y-16'}>
        <SitePageHeader title={title} subtitle={description} />

        <div className={'flex flex-col items-center'}>
          <div className={'container mx-auto max-w-5xl'}>
            <DocsCards cards={items as Cms.ContentItem[]} />
          </div>
        </div>
      </div>
    </PageBody>
  );
}

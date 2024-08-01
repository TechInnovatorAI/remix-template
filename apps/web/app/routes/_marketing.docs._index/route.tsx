import {
  MetaFunction,
  useLoaderData,
  useRouteLoaderData,
} from '@remix-run/react';
import type { LoaderFunctionArgs } from '@remix-run/server-runtime';

import { Cms } from '@kit/cms';
import { PageBody } from '@kit/ui/page';

import { createI18nServerInstance } from '~/lib/i18n/i18n.server';
import { DocsCards } from '~/routes/_marketing.docs/_components/docs-cards';
import { SitePageHeader } from '~/routes/_marketing/_components/site-page-header';

import type { loader as docsLoader } from '../_marketing.docs/route';

export const loader = async (args: LoaderFunctionArgs) => {
  const { t } = await createI18nServerInstance(args.request);

  return {
    title: t('marketing:documentation'),
    description: t('marketing:documentationSubtitle'),
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
  const { title, description } = useLoaderData<typeof loader>();

  const data = useRouteLoaderData<typeof docsLoader>('routes/_marketing.docs');

  // only top level cards
  const cards = (data?.pages ?? []).filter((item) => !item.parentId);

  return (
    <PageBody>
      <div className={'flex flex-col space-y-8 xl:space-y-16'}>
        <SitePageHeader title={title} subtitle={description} />

        <div className={'flex flex-col items-center'}>
          <div className={'container mx-auto max-w-5xl'}>
            <DocsCards cards={cards as Cms.ContentItem[]} />
          </div>
        </div>
      </div>
    </PageBody>
  );
}

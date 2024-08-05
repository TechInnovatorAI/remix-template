import { MetaFunction, json, redirect, useLoaderData } from '@remix-run/react';
import type { LoaderFunctionArgs } from '@remix-run/server-runtime';

import { Cms, ContentRenderer, createCmsClient } from '@kit/cms';
import { If } from '@kit/ui/if';
import { Separator } from '@kit/ui/separator';

import { DocsCards } from '~/routes/_marketing.docs/_components/docs-cards';
import { SitePageHeader } from '~/routes/_marketing/_components/site-page-header';

import styles from '../_marketing.blog.$slug/_components/html-renderer.module.css';

const getPageBySlug = async (slug: string) => {
  const client = await createCmsClient();

  return client.getContentItemBySlug({ slug, collection: 'documentation' });
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const { title, description } = data?.page ?? {};

  return [
    {
      title,
      description,
    },
  ];
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const page = await getPageBySlug(params['*'] as string);

  if (!page) {
    return redirect('/404');
  }

  return json({
    page,
  });
};

export default function DocumentationPage() {
  const { page } = useLoaderData<typeof loader>();
  const description = page?.description ?? '';

  return (
    <div className={'flex flex-1 flex-col'}>
      <SitePageHeader
        className={'lg:px-8'}
        container={false}
        title={page.title}
        subtitle={description}
      />

      <div className={'flex flex-col space-y-4 py-6 lg:px-8'}>
        <article className={styles.HTML}>
          <ContentRenderer content={page.content} />
        </article>

        <If condition={page.children.length > 0}>
          <Separator />

          <DocsCards cards={(page.children ?? []) as Cms.ContentItem[]} />
        </If>
      </div>
    </div>
  );
}

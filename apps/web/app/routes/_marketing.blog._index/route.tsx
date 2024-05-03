import { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import { createCmsClient } from '@kit/cms';
import { If } from '@kit/ui/if';
import { Trans } from '@kit/ui/trans';

import { createI18nServerInstance } from '~/lib/i18n/i18n.server';
import { SitePageHeader } from '~/routes/_marketing/_components/site-page-header';

// local imports
import { BlogPagination } from './_components/blog-pagination';
import { PostPreview } from './_components/post-preview';

export const loader = async (args: LoaderFunctionArgs) => {
  const { t, resolvedLanguage: language } = await createI18nServerInstance(
    args.request,
  );

  const searchParams = new URL(args.request.url).searchParams;
  const pageSearchParam = searchParams.get('page');

  const page = pageSearchParam ? parseInt(pageSearchParam) : 0;

  const limit = 10;
  const offset = page * limit;

  const { total, items: posts } = await getContentItems(
    language,
    limit,
    offset,
  );

  return {
    title: t('marketing:blog'),
    description: t('marketing:blogSubtitle'),
    posts,
    total,
    page,
    canGoToNextPage: offset + limit < total,
    canGoToPreviousPage: page > 0,
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

const getContentItems = async (
  language: string | undefined,
  limit: number,
  offset: number,
) => {
  const client = await createCmsClient();

  return client.getContentItems({
    collection: 'posts',
    limit,
    offset,
    language,
    sortBy: 'publishedAt',
    sortDirection: 'desc',
  });
};

export default function BlogPage() {
  const {
    posts,
    title,
    description,
    page,
    canGoToNextPage,
    canGoToPreviousPage,
  } = useLoaderData<typeof loader>();

  return (
    <>
      <SitePageHeader title={title} subtitle={description} />

      <div className={'container flex flex-col space-y-6 py-12'}>
        <If
          condition={posts.length > 0}
          fallback={<Trans i18nKey="marketing:noPosts" />}
        >
          <PostsGridList>
            {posts.map((post, idx) => {
              return <PostPreview key={idx} post={post} />;
            })}
          </PostsGridList>

          <div>
            <BlogPagination
              currentPage={page}
              canGoToNextPage={canGoToNextPage}
              canGoToPreviousPage={canGoToPreviousPage}
            />
          </div>
        </If>
      </div>
    </>
  );
}

function PostsGridList({ children }: React.PropsWithChildren) {
  return (
    <div className="grid grid-cols-1 gap-y-8 md:grid-cols-2 md:gap-x-8 md:gap-y-12 lg:grid-cols-3 lg:gap-x-12">
      {children}
    </div>
  );
}

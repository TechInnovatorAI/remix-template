import { LoaderFunctionArgs, MetaFunction, redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import { createCmsClient } from '@kit/cms';

import { Post } from './_components/post';

export const loader = async (args: LoaderFunctionArgs) => {
  const client = await createCmsClient();
  const slug = args.params.slug as string;

  const post = await client.getContentItemBySlug({ slug, collection: 'posts' });

  if (!post) {
    return redirect('/404');
  }

  return { post };
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data?.post) {
    return {};
  }

  const { title, publishedAt, description, image, url } = data.post;

  return [{
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: publishedAt,
      url,
      images: image
        ? [
            {
              url: image,
            },
          ]
        : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : [],
    },
  }];
};

export default function BlogPost() {
  const { post } = useLoaderData<typeof loader>();

  return (
    <div className={'container sm:max-w-none sm:p-0'}>
      <Post post={post} content={post.content} />
    </div>
  );
}

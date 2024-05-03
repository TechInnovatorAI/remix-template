import { lazy } from 'react';

import type { Cms } from '@kit/cms';

import styles from './html-renderer.module.css';
import { PostHeader } from './post-header';

const ContentRenderer = lazy(() => {
  return import('@kit/cms').then((mod) => ({ default: mod.ContentRenderer }));
});

export function Post({
  post,
  content,
}: {
  post: Cms.ContentItem;
  content: unknown;
}) {
  return (
    <div>
      <PostHeader post={post} />

      <div className={'mx-auto flex max-w-3xl flex-col space-y-6 py-8'}>
        <article className={styles.HTML}>
          <ContentRenderer content={content} />
        </article>
      </div>
    </div>
  );
}

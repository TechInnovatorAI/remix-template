import { Outlet, useLoaderData } from '@remix-run/react';
import type { LoaderFunctionArgs } from '@remix-run/server-runtime';

import { Cms } from '@kit/cms';

import { createI18nServerInstance } from '~/lib/i18n/i18n.server';
import { getDocs } from '~/routes/_marketing.docs/_lib/get-docs';

// local imports
import { DocsNavigation } from './_components/docs-navigation';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { resolvedLanguage } = await createI18nServerInstance(request);
  const docs = await getDocs(resolvedLanguage);
  const pages = buildDocumentationTree(docs);

  return {
    pages,
  };
};

export default function DocsLayout() {
  const { pages } = useLoaderData<typeof loader>();

  return (
    <div className={'flex container'}>
      <DocsNavigation pages={pages as Cms.ContentItem[]} />

      <Outlet />
    </div>
  );
}

// we want to place all the children under their parent
// based on the property parentId
function buildDocumentationTree(pages: Cms.ContentItem[]) {
  const tree: Cms.ContentItem[] = [];
  const map: Record<string, Cms.ContentItem> = {};

  pages.forEach((page) => {
    map[page.id] = page;
  });

  pages.forEach((page) => {
    if (page.parentId) {
      const parent = map[page.parentId];

      if (!parent) {
        return;
      }

      if (!parent.children) {
        parent.children = [];
      }

      parent.children.push(page);

      // sort children by order
      parent.children.sort((a, b) => a.order - b.order);
    } else {
      tree.push(page);
    }
  });

  return tree.sort((a, b) => a.order - b.order);
}

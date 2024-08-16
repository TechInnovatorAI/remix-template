import { createCmsClient } from '@kit/cms';

import appConfig from '~/config/app.config';

export const loader = async () => {
  const paths = getPaths();
  const contentItems = await getContentItems();

  const allUrls = [...paths, ...contentItems].map((path) => {
    return {
      loc: new URL(path, appConfig.url).href,
      lastmod: new Date().toISOString(),
    };
  });

  const urls = allUrls.map(
    (url) =>
      `<url>
      <loc>${url.loc}</loc>
      <lastmod>${url.lastmod}</lastmod>
      <priority>1.0</priority>
    </url>`,
  );

  const content = `
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${urls}
    </urlset>
    `.trim();

  return new Response(content, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'xml-version': '1.0',
      encoding: 'UTF-8',
    },
  });
};

function getPaths() {
  return [
    '/',
    '/faq',
    '/blog',
    '/docs',
    '/pricing',
    '/contact',
    '/cookie-policy',
    '/terms-of-service',
    '/privacy-policy',
    // add more paths here
  ];
}

async function getContentItems() {
  const client = await createCmsClient();

  const posts = client
    .getContentItems({
      collection: 'posts',
      limit: Infinity,
    })
    .then((response) => response.items)
    .then((posts) => posts.map((post) => `/blog/${post.slug}`));

  const docs = client
    .getContentItems({
      collection: 'documentation',
      limit: Infinity,
    })
    .then((response) => response.items)
    .then((docs) => docs.map((doc) => `/docs/${doc.slug}`));

  return Promise.all([posts, docs]).then((items) => items.flat());
}

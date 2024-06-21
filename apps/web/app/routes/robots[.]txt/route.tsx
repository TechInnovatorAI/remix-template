import appConfig from '~/config/app.config';

const robots = {
  rules: {
    userAgent: '*',
    allow: '/',
  },
  sitemap: `${appConfig.url}/sitemap.xml`,
};

export const loader = async () => {
  const items = [
    `User-agent: ${robots.rules.userAgent}`,
    `Allow: ${robots.rules.allow}`,
    `Sitemap: ${robots.sitemap}`,
  ];

  const content = items.reduce((acc, curr) => acc + curr + '\n', '');

  return new Response(content, {
    status: 200,
    headers: {
      encoding: 'UTF-8',
    },
  });
};

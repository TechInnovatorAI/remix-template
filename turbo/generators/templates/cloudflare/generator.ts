import type { PlopTypes } from '@turbo/gen';
import { execSync } from 'node:child_process';

export function createCloudflareGenerator(plop: PlopTypes.NodePlopAPI) {
  plop.setGenerator('cloudflare', {
    description: 'Set up Makerkit for Cloudflare Workers',
    prompts: [],
    actions: [
      {
        type: 'add',
        path: 'apps/web/vite.config.ts',
        templateFile: 'templates/cloudflare/vite.config.ts.hbs',
        force: true,
      },
      {
        type: 'add',
        path: 'apps/web/app/entry.server.tsx',
        templateFile: 'templates/cloudflare/entry.server.tsx.hbs',
        force: true,
      },
      {
        type: 'add',
        path: 'apps/web/wrangler.toml',
        templateFile: 'templates/cloudflare/wrangler.toml.hbs',
        force: true,
      },
      {
        type: 'add',
        path: 'apps/web/server.js',
        templateFile: 'templates/cloudflare/server.js.hbs',
        force: true,
      },
      {
        type: 'modify',
        path: 'apps/web/package.json',
        async transform(content) {
          const pkg = JSON.parse(content);

          const dependencies = [
            'miniflare',
            '@cloudflare/kv-asset-handler',
            '@remix-run/cloudflare',
          ];

          const devDependencies = ['@cloudflare/workers-types', 'wrangler'];

          for (const dep of dependencies.filter(Boolean)) {
            const version = await fetch(
              `https://registry.npmjs.org/-/package/${dep}/dist-tags`,
            )
              .then((res) => res.json())
              .then((json) => json.latest);

            pkg.dependencies![dep] = `^${version}`;
          }

          for (const dep of devDependencies.filter(Boolean)) {
            const version = await fetch(
              `https://registry.npmjs.org/-/package/${dep}/dist-tags`,
            )
              .then((res) => res.json())
              .then((json) => json.latest);

            pkg.devDependencies![dep] = `^${version}`;
          }

          pkg.scripts['start'] = 'pnpm with-env wrangler dev';
          pkg.scripts['typegen'] = 'wrangler types';

          return JSON.stringify(pkg, null, 2);
        },
      },
      async () => {
        execSync('pnpm manypkg fix', {
          stdio: 'inherit',
        });

        execSync(`pnpm i`, {
          stdio: 'inherit',
        });

        execSync(
          `pnpm run format:fix`,
        );

        return 'Cloudflare setup is almost complete! Please replace all "@remix-run/node" imports with "@remix-run/cloudflare" in your codebase and add the package to your package.json dependencies. Then run `pnpm i` to install the new dependencies.';
      },
    ],
  });
}

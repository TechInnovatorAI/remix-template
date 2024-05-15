import process from 'node:process';
import { z } from 'zod';

const STORAGE_KIND = process.env.KEYSTATIC_STORAGE_KIND ?? 'local';

/**
 * Create a KeyStatic reader based on the storage kind.
 */
export async function createKeystaticReader() {
  switch (STORAGE_KIND) {
    case 'local': {
      const { default: config } = await import('./keystatic.config');
      const { createReader } = await import('@keystatic/core/reader').catch();

      return createReader(process.cwd(), config);
    }

    case 'github':
    case 'cloud': {
      const { default: config } = await import('./keystatic.config');

      const githubConfig = z
        .object({
          token: z.string(),
          repo: z.custom<`${string}/${string}`>(),
          pathPrefix: z.string().optional(),
        })
        .parse({
          token: process.env.KEYSTATIC_GITHUB_TOKEN,
          repo: process.env.KEYSTATIC_STORAGE_REPO,
          pathPrefix: process.env.KEYSTATIC_PATH_PREFIX,
        });

      const { createGitHubReader } = await import(
        '@keystatic/core/reader/github'
      ).catch();

      return createGitHubReader(config, githubConfig);
    }

    default:
      throw new Error(`Unknown storage kind`);
  }
}

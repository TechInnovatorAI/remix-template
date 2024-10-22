import {
  CloudConfig,
  GitHubConfig,
  LocalConfig,
  collection,
  config,
  fields,
} from '@keystatic/core';
import { Entry } from '@keystatic/core/reader';
import process from 'node:process';
import { z } from 'zod';

type ZodOutputFor<T> = z.ZodType<T, z.ZodTypeDef, unknown>;

const local = z.object({
  kind: z.literal('local'),
}) satisfies ZodOutputFor<LocalConfig['storage']>;

const cloud = z.object({
  kind: z.literal('cloud'),
  project: z.string().min(1),
  branchPrefix: z.string().optional(),
  pathPrefix: z.string().optional(),
}) satisfies ZodOutputFor<CloudConfig['storage']>;

const github = z.object({
  kind: z.literal('github'),
  repo: z.custom<`${string}/${string}`>(),
  branchPrefix: z.string().optional(),
  pathPrefix: z.string().optional(),
  githubToken: z.string({
    description:
      'The GitHub token to use for authentication with the GitHub API',
    required_error: 'Please provide a GitHub token',
  }),
}) satisfies ZodOutputFor<GitHubConfig['storage']>;

const storage = z.union([local, cloud, github]).parse({
  kind: process.env.KEYSTATIC_STORAGE_KIND ?? 'local',
  project: process.env.KEYSTATIC_STORAGE_PROJECT,
  repo: process.env.KEYSTATIC_STORAGE_REPO,
  branchPrefix: process.env.KEYSTATIC_STORAGE_BRANCH_PREFIX,
  githubToken: process.env.KEYSTATIC_GITHUB_TOKEN,
  pathPrefix: process.env.KEYSTATIC_PATH_PREFIX,
});

const keyStaticConfig = createKeyStaticConfig(
  process.env.VITE_KEYSTATIC_CONTENT_PATH ?? '',
);

export default keyStaticConfig;

function getContentField() {
  return fields.markdoc({
    label: 'Content',
    options: {
      link: true,
      blockquote: true,
      bold: true,
      divider: true,
      orderedList: true,
      unorderedList: true,
      strikethrough: true,
      heading: true,
      code: true,
      italic: true,
      image: {
        directory: 'public/site/images',
        publicPath: '/site/images',
        schema: {
          title: fields.text({
            label: 'Caption',
            description: 'The text to display under the image in a caption.',
          }),
        },
      },
    },
  });
}

export type PostEntryProps = Entry<
  (typeof keyStaticConfig)['collections']['posts']
>;

function createKeyStaticConfig(path = '') {
  if (path && !path.endsWith('/')) {
    path += '/';
  }

  const cloud = {
    project: storage.kind === 'cloud' ? storage.project : '',
  };

  const collections = getKeystaticCollections(path);

  return config({
    storage,
    cloud,
    collections,
  });
}

function getKeystaticCollections(path: string) {
  return {
    posts: collection({
      label: 'Posts',
      slugField: 'title',
      path: `${path}posts/*`,
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        image: fields.image({
          label: 'Image',
          directory: 'public/site/images',
          publicPath: '/site/images',
        }),
        categories: fields.array(fields.text({ label: 'Category' })),
        tags: fields.array(fields.text({ label: 'Tag' })),
        description: fields.text({ label: 'Description' }),
        publishedAt: fields.date({ label: 'Published At' }),
        parent: fields.relationship({
          label: 'Parent',
          collection: 'posts',
        }),
        language: fields.text({ label: 'Language' }),
        order: fields.number({ label: 'Order' }),
        content: getContentField(),
      },
    }),
    documentation: collection({
      label: 'Documentation',
      slugField: 'title',
      path: `${path}documentation/**`,
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        content: getContentField(),
        image: fields.image({
          label: 'Image',
          directory: 'public/site/images',
          publicPath: '/site/images',
        }),
        description: fields.text({ label: 'Description' }),
        publishedAt: fields.date({ label: 'Published At' }),
        order: fields.number({ label: 'Order' }),
        language: fields.text({ label: 'Language' }),
        parent: fields.relationship({
          label: 'Parent',
          collection: 'documentation',
        }),
        categories: fields.array(fields.text({ label: 'Category' })),
        tags: fields.array(fields.text({ label: 'Tag' })),
      },
    }),
  };
}

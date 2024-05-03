import { collection, config, fields } from '@keystatic/core';
import { Entry } from '@keystatic/core/reader';
import { z } from 'zod';

const local = z.object({
  kind: z.literal('local'),
});

const cloud = z.object({
  kind: z.literal('cloud'),
  project: z.string(),
});

const github = z.object({
  kind: z.literal('github'),
  repo: z.custom<`${string}/${string}`>(),
  branchPrefix: z.string().optional(),
  pathPrefix: z.string().optional(),
  githubToken: z.string({
    required_error: 'Please provide a GitHub token',
  }),
});

const storage = z.union([local, cloud, github]).parse({
  kind: process.env.KEYSTATIC_STORAGE_KIND ?? 'local',
  project: process.env.KEYSTATIC_STORAGE_PROJECT,
  repo: process.env.KEYSTATIC_STORAGE_REPO,
  branchPrefix: process.env.KEYSTATIC_STORAGE_BRANCH_PREFIX,
  githubToken: process.env.KEYSTATIC_GITHUB_TOKEN,
  pathPrefix: process.env.KEYSTATIC_PATH_PREFIX,
});

const keyStaticConfig = createKeyStaticConfig();

export default keyStaticConfig;

export type PostEntryProps = Entry<
  (typeof keyStaticConfig)['collections']['posts']
>;

function createKeyStaticConfig() {
  return config({
    storage,
    collections: {
      posts: collection({
        label: 'Posts',
        slugField: 'title',
        path: `posts/*`,
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
          content: fields.document({
            label: 'Content',
            formatting: true,
            dividers: true,
            links: true,
            images: {
              directory: 'public/site/images',
              publicPath: '/site/images',
              schema: {
                title: fields.text({
                  label: 'Caption',
                  description:
                    'The text to display under the image in a caption.',
                }),
              },
            },
          }),
        },
      }),
      documentation: collection({
        label: 'Documentation',
        slugField: 'title',
        path: `documentation/**`,
        format: { contentField: 'content' },
        schema: {
          title: fields.slug({ name: { label: 'Title' } }),
          content: fields.document({
            label: 'Content',
            formatting: true,
            dividers: true,
            links: true,
            images: {
              directory: 'public/site/images',
              publicPath: '/site/images',
              schema: {
                title: fields.text({
                  label: 'Caption',
                  description:
                    'The text to display under the image in a caption.',
                }),
              },
            },
          }),
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
    },
  });
}

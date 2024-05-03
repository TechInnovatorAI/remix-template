import type {
  WP_REST_API_Category,
  WP_REST_API_Post,
  WP_REST_API_Tag,
} from 'wp-types';

import { Cms, CmsClient } from '@kit/cms';

import GetTagsOptions = Cms.GetTagsOptions;

export function createWordpressClient(
  apiUrl = process.env.WORDPRESS_API_URL as string,
) {
  return new WordpressClient(apiUrl);
}

/**
 * @name WordpressClient
 * @description Represents a client for interacting with a Wordpress CMS.
 * Implements the CmsClient interface.
 */
class WordpressClient implements CmsClient {
  constructor(private readonly apiUrl: string) {}

  /**
   * Retrieves content items from a CMS based on the provided options.
   *
   * @param {Cms.GetContentItemsOptions} options - The options to customize the retrieval of content items.
   */
  async getContentItems(options: Cms.GetContentItemsOptions) {
    const queryParams = new URLSearchParams({
      _embed: 'true',
    });

    if (options?.limit) {
      queryParams.append('per_page', options.limit.toString());
    }

    if (options?.offset) {
      queryParams.append('offset', options.offset.toString());
    }

    if (options.sortBy) {
      queryParams.append('orderby', options.sortBy);
    }

    if (options.sortDirection) {
      queryParams.append('order', options.sortDirection);
    }

    if (options?.categories) {
      const ids = await this.getCategories({
        slugs: options.categories,
      }).then((categories) => categories.map((category) => category.id));

      if (ids.length) {
        queryParams.append('categories', ids.join(','));
      } else {
        console.warn(
          'No categories found for the provided slugs',
          options.categories,
        );
      }
    }

    if (options?.tags) {
      const allTags = [
        ...options.tags,
        options.language ? options.language : '',
      ].filter(Boolean);

      const ids = await this.getTags({
        slugs: allTags,
      }).then((tags) => tags.map((tag) => tag.id));

      if (ids.length) {
        queryParams.append('tags', ids.join(','));
      } else {
        console.warn('No tags found for the provided slugs', options.tags);
      }
    }

    if (options?.parentIds && options.parentIds.length > 0) {
      queryParams.append('parent', options.parentIds.join(','));
    }

    const endpoints = [
      `/wp-json/wp/v2/posts?${queryParams.toString()}`,
      `/wp-json/wp/v2/pages?${queryParams.toString()}`,
    ];

    const endpoint =
      options.collection === 'posts' ? endpoints[0] : endpoints[1];

    const url = `${this.apiUrl}${endpoint}`;

    const response = await fetch(url);
    const totalHeader = response.headers.get('X-WP-Total');

    const total = totalHeader ? Number(totalHeader) : 0;
    const results = (await response.json()) as WP_REST_API_Post[];

    const posts = await Promise.all(
      results.map(async (item: WP_REST_API_Post) => {
        let parentId: string | undefined;

        if (!item) {
          throw new Error('Failed to fetch content items');
        }

        if (item.parent) {
          parentId = item.parent.toString();
        }

        const categories = await this.getCategoriesByIds(item.categories ?? []);
        const tags = await this.getTagsByIds(item.tags ?? []);
        const image = item.featured_media ? this.getFeaturedMedia(item) : '';
        const order = item.menu_order ?? 0;

        return {
          id: item.id.toString(),
          title: item.title.rendered,
          content: item.content.rendered,
          description: item.excerpt.rendered,
          image,
          url: item.link,
          slug: item.slug,
          publishedAt: item.date,
          categories: categories,
          tags: tags,
          parentId,
          order,
          children: [],
        };
      }),
    );

    return {
      total,
      items: posts,
    };
  }

  async getContentItemBySlug({
    slug,
    collection,
  }: {
    slug: string;
    collection: string;
  }) {
    const searchParams = new URLSearchParams({
      _embed: 'true',
      slug,
    });

    const endpoints = [
      `/wp-json/wp/v2/posts?${searchParams.toString()}`,
      `/wp-json/wp/v2/pages?${searchParams.toString()}`,
    ];

    const endpoint = collection === 'posts' ? endpoints[0] : endpoints[1];

    const responses = await fetch(this.apiUrl + endpoint).then(
      (res) => res.json() as Promise<WP_REST_API_Post[]>,
    );

    const item = responses[0];

    if (!item) {
      return;
    }

    const categories = await this.getCategoriesByIds(item.categories ?? []);
    const tags = await this.getTagsByIds(item.tags ?? []);
    const image = item.featured_media ? this.getFeaturedMedia(item) : '';

    return {
      id: item.id.toString(),
      image,
      order: item.menu_order ?? 0,
      url: item.link,
      description: item.excerpt.rendered,
      children: [],
      title: item.title.rendered,
      content: item.content.rendered,
      slug: item.slug,
      publishedAt: item.date,
      categories,
      tags,
      parentId: item.parent?.toString(),
    };
  }

  async getCategoryBySlug(slug: string) {
    const url = `${this.apiUrl}/wp-json/wp/v2/categories?slug=${slug}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.length === 0) {
      return;
    }

    const item = data[0] as WP_REST_API_Category;

    return {
      id: item.id.toString(),
      name: item.name,
      slug: item.slug,
    };
  }

  async getTagBySlug(slug: string) {
    const url = `${this.apiUrl}/wp-json/wp/v2/tags?slug=${slug}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.length === 0) {
      return;
    }

    const item = data[0] as WP_REST_API_Tag;

    return {
      id: item.id.toString(),
      name: item.name,
      slug: item.slug,
    };
  }

  async getCategories(options?: Cms.GetCategoriesOptions) {
    const queryParams = new URLSearchParams();

    if (options?.limit) {
      queryParams.append('per_page', options.limit.toString());
    }

    if (options?.offset) {
      queryParams.append('offset', options.offset.toString());
    }

    if (options?.slugs) {
      const slugs = options.slugs.join(',');

      queryParams.append('slug', slugs);
    }

    const response = await fetch(
      `${this.apiUrl}/wp-json/wp/v2/categories?${queryParams.toString()}`,
    );

    if (!response.ok) {
      console.error('Failed to fetch categories', await response.json());

      throw new Error('Failed to fetch categories');
    }

    const data = (await response.json()) as WP_REST_API_Category[];

    return data.map((item) => ({
      id: item.id.toString(),
      name: item.name,
      slug: item.slug,
    }));
  }

  async getTags(options: GetTagsOptions) {
    const queryParams = new URLSearchParams();

    if (options?.limit) {
      queryParams.append('per_page', options.limit.toString());
    }

    if (options?.offset) {
      queryParams.append('offset', options.offset.toString());
    }

    if (options?.slugs) {
      const slugs = options.slugs.join(',');
      queryParams.append('slug', slugs);
    }

    const response = await fetch(
      `${this.apiUrl}/wp-json/wp/v2/tags?${queryParams.toString()}`,
    );

    if (!response.ok) {
      console.error('Failed to fetch tags', await response.json());

      throw new Error('Failed to fetch tags');
    }

    const data = (await response.json()) as WP_REST_API_Tag[];

    return data.map((item) => ({
      id: item.id.toString(),
      name: item.name,
      slug: item.slug,
    }));
  }

  private async getTagsByIds(ids: number[]) {
    const promises = ids.map((id) =>
      fetch(`${this.apiUrl}/wp-json/wp/v2/tags/${id}`),
    );

    const responses = await Promise.all(promises);

    const data = (await Promise.all(
      responses.map((response) => response.json()),
    )) as WP_REST_API_Tag[];

    return data.map((item) => ({
      id: item.id.toString(),
      name: item.name,
      slug: item.slug,
    }));
  }

  private async getCategoriesByIds(ids: number[]) {
    const promises = ids.map((id) =>
      fetch(`${this.apiUrl}/wp-json/wp/v2/categories/${id}`),
    );

    const responses = await Promise.all(promises);

    const data = (await Promise.all(
      responses.map((response) => response.json()),
    )) as WP_REST_API_Category[];

    return data.map((item) => ({
      id: item.id.toString(),
      name: item.name,
      slug: item.slug,
    }));
  }

  private getFeaturedMedia(post: WP_REST_API_Post) {
    const embedded = post._embedded ?? {
      'wp:featuredmedia': [],
    };

    const media = embedded['wp:featuredmedia'] ?? [];
    const item = media?.length > 0 ? media[0] : null;

    return item
      ? (
          item as {
            source_url: string;
          }
        ).source_url
      : '';
  }
}

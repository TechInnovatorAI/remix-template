import { CmsClient } from './cms-client';
import { CmsType } from './cms.type';

/**
 * Creates a CMS client based on the specified type.
 *
 * @param {CmsType} type - The type of CMS client to create. Defaults to the value of the CMS_CLIENT environment variable.
 * @returns {Promise<CmsClient>} A Promise that resolves to the created CMS client.
 * @throws {Error} If the specified CMS type is unknown.
 */
export async function createCmsClient(
  type: CmsType = process.env.REMIX_PUBLIC_CMS_CLIENT as CmsType,
): Promise<CmsClient> {
  return cmsClientFactory(type);
}

async function cmsClientFactory(type: CmsType) {
  switch (type) {
    case 'wordpress':
      return getWordpressClient();

    case 'keystatic':
      return getKeystaticClient();

    default:
      throw new Error(`Unknown CMS type`);
  }
}

async function getWordpressClient() {
  const { createWordpressClient } = await import(
    '../../wordpress/src/wp-client'
  );

  return createWordpressClient();
}

async function getKeystaticClient() {
  const { createKeystaticClient } = await import(
    '../../keystatic/src/keystatic-client'
  );

  return createKeystaticClient();
}

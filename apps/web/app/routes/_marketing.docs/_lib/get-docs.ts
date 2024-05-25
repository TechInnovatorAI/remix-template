import { createCmsClient } from '@kit/cms';

export const getDocs = async (language: string | undefined) => {
  const cms = await createCmsClient();

  const { items: pages } = await cms.getContentItems({
    collection: 'documentation',
    language,
    limit: Number.MAX_SAFE_INTEGER,
  });

  return pages;
};

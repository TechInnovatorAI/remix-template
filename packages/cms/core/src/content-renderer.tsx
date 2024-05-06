import { KeystaticDocumentRenderer } from '../../keystatic/src/content-renderer';
import { WordpressContentRenderer } from '../../wordpress/src/content-renderer';
import { CmsType } from './cms.type';

export function ContentRenderer({
  content,
  type = import.meta.env.VITE_CMS_CLIENT as CmsType,
}: {
  content: unknown;
  type?: CmsType;
}) {
  switch (type) {
    case 'keystatic':
      return KeystaticDocumentRenderer({ content });

    case 'wordpress':
      return WordpressContentRenderer({ content });
  }
}

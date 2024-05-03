import { Link } from '@remix-run/react';
import { ChevronRight } from 'lucide-react';

import { Trans } from '@kit/ui/trans';

export function DocsCard({
  title,
  subtitle,
  children,
  link,
}: React.PropsWithChildren<{
  title: string;
  subtitle?: string | null;
  link: { url: string; label?: string };
}>) {
  return (
    <div className="flex flex-col">
      <div
        className={`bg-background flex grow flex-col space-y-2.5 border p-6
        ${link ? 'rounded-t-2xl border-b-0' : 'rounded-2xl'}`}
      >
        <h3 className="mt-0 text-lg font-semibold dark:text-white">
          <Link to={link.url}>{title}</Link>
        </h3>

        {subtitle && (
          <div className="text-muted-foreground text-sm">
            <p dangerouslySetInnerHTML={{ __html: subtitle }}></p>
          </div>
        )}

        {children && <div className="text-sm">{children}</div>}
      </div>

      {link && (
        <div className="bg-muted dark:bg-background rounded-b-2xl border p-6 py-4">
          <span className={'flex items-center space-x-2'}>
            <Link
              className={'text-sm font-medium hover:underline'}
              to={link.url}
            >
              {link.label ?? <Trans i18nKey={'marketing:readMore'} />}
            </Link>

            <ChevronRight className={'h-4'} />
          </span>
        </div>
      )}
    </div>
  );
}

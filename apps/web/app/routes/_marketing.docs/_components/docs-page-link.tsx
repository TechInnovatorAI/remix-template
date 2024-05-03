import { Link } from '@remix-run/react';

import { If } from '@kit/ui/if';
import { cn } from '@kit/ui/utils';

export function DocsPageLink({
  page,
  before,
  after,
}: React.PropsWithChildren<{
  page: {
    url: string;
    title: string;
  };
  before?: React.ReactNode;
  after?: React.ReactNode;
}>) {
  return (
    <Link
      className={cn(
        `ring-muted hover:ring-primary flex w-full items-center space-x-8 rounded-xl p-6 font-medium text-current ring-2 transition-all`,
        {
          'justify-start': before,
          'justify-end self-end': after,
        },
      )}
      to={page.url}
    >
      <If condition={before}>{(node) => <>{node}</>}</If>

      <span className={'flex flex-col space-y-1.5'}>
        <span
          className={'text-muted-foreground text-xs font-semibold uppercase'}
        >
          {before ? `Previous` : ``}
          {after ? `Next` : ``}
        </span>

        <span>{page.title}</span>
      </span>

      <If condition={after}>{(node) => <>{node}</>}</If>
    </Link>
  );
}

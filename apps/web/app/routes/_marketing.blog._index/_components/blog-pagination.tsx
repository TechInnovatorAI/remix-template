import { useSearchParams } from '@remix-run/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

import { Button } from '@kit/ui/button';
import { If } from '@kit/ui/if';
import { Trans } from '@kit/ui/trans';

export function BlogPagination(props: {
  currentPage: number;
  canGoToNextPage: boolean;
  canGoToPreviousPage: boolean;
}) {
  const [, setSearchParams] = useSearchParams();

  return (
    <div className={'flex items-center space-x-2'}>
      <If condition={props.canGoToPreviousPage}>
        <Button
          variant={'outline'}
          onClick={() => {
            setSearchParams({
              page: (props.currentPage - 1).toString(),
            });
          }}
        >
          <ArrowLeft className={'mr-2 h-4'} />
          <Trans i18nKey={'marketing:blogPaginationPrevious'} />
        </Button>
      </If>

      <If condition={props.canGoToNextPage}>
        <Button
          variant={'outline'}
          onClick={() => {
            setSearchParams({
              page: (props.currentPage + 1).toString(),
            });
          }}
        >
          <Trans i18nKey={'marketing:blogPaginationNext'} />
          <ArrowRight className={'ml-2 h-4'} />
        </Button>
      </If>
    </div>
  );
}

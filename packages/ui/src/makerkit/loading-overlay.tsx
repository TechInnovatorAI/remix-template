import type { PropsWithChildren } from 'react';

import { cn } from '../utils';
import { Spinner } from './spinner';

export function LoadingOverlay({
  children,
  className,
  fullPage = true,
  spinnerClassName,
}: PropsWithChildren<{
  className?: string;
  spinnerClassName?: string;
  fullPage?: boolean;
  displayLogo?: boolean;
}>) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center space-y-4',
        className,
        {
          [`fixed left-0 top-0 z-[100] h-screen w-screen bg-background`]:
            fullPage,
        },
      )}
    >
      <Spinner className={spinnerClassName} />

      <div className={'text-sm text-muted-foreground'}>{children}</div>
    </div>
  );
}

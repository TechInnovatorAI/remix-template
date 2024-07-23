import React, { forwardRef } from 'react';

import { cn } from '../../utils';

export const FeatureGrid = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(function FeatureGridComponent({ className, children, ...props }, ref) {
  return (
    <div
      ref={ref}
      className={cn(
        'grid w-full grid-cols-1 gap-6 space-y-0 lg:grid-cols-3',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
});

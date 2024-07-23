import React, { forwardRef } from 'react';

import { cn } from '../../utils';

export const GradientText = forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(function GradientTextComponent({ className, children, ...props }, ref) {
  return (
    <span
      ref={ref}
      className={cn(
        'bg-gradient-to-r bg-clip-text text-transparent',
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
});

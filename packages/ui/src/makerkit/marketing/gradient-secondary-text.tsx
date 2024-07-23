import { forwardRef } from 'react';

import { Slot, Slottable } from '@radix-ui/react-slot';

import { cn } from '../../utils';

export const GradientSecondaryText = forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement> & {
    asChild?: boolean;
  }
>(function GradientSecondaryTextComponent({ className, ...props }, ref) {
  const Comp = props.asChild ? Slot : 'span';

  return (
    <Comp
      ref={ref}
      className={cn(
        'bg-gradient-to-r from-foreground/50 to-foreground bg-clip-text text-transparent',
        className,
      )}
      {...props}
    >
      <Slottable>{props.children}</Slottable>
    </Comp>
  );
});

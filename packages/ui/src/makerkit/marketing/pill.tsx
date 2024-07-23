import { forwardRef } from 'react';

import { Slot, Slottable } from '@radix-ui/react-slot';

import { cn } from '../../utils';
import { GradientSecondaryText } from './gradient-secondary-text';

export const Pill = forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement> & {
    label?: string;
    asChild?: boolean;
  }
>(function PillComponent({ className, asChild, ...props }, ref) {
  const Comp = asChild ? Slot : 'h3';

  return (
    <Comp
      ref={ref}
      className={cn(
        'space-x-2.5 rounded-full border border-gray-100 px-2 py-2.5 text-center text-sm font-medium text-transparent dark:border-primary/10',
        className,
      )}
      {...props}
    >
      {props.label && (
        <span
          className={
            'rounded-2xl bg-primary px-2.5 py-1.5 text-sm font-semibold text-primary-foreground'
          }
        >
          {props.label}
        </span>
      )}
      <Slottable>
        <GradientSecondaryText>{props.children}</GradientSecondaryText>
      </Slottable>
    </Comp>
  );
});

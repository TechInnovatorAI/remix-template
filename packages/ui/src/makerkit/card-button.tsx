import * as React from 'react';

import { Slot, Slottable } from '@radix-ui/react-slot';
import { ChevronRight } from 'lucide-react';

import { cn } from '../utils';

export const CardButton = React.forwardRef<
  HTMLButtonElement,
  {
    asChild?: boolean;
    className?: string;
    children: React.ReactNode;
  } & React.ButtonHTMLAttributes<HTMLButtonElement>
>(function CardButton({ className, asChild, ...props }, ref) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      ref={ref}
      className={cn(
        'group relative flex h-36 flex-col rounded-lg border transition-all hover:bg-secondary/20 hover:shadow active:bg-secondary active:bg-secondary/50 active:shadow-lg dark:shadow-primary/20',
        className,
      )}
      {...props}
    >
      <Slottable>{props.children}</Slottable>
    </Comp>
  );
});

export const CardButtonTitle = React.forwardRef<
  HTMLDivElement,
  {
    className?: string;
    asChild?: boolean;
    children: React.ReactNode;
  }
>(function CardButtonTitle({ className, asChild, ...props }, ref) {
  const Comp = asChild ? Slot : 'div';

  return (
    <Comp
      ref={ref}
      className={cn(
        className,
        'align-super text-sm font-medium text-muted-foreground transition-colors group-hover:text-secondary-foreground',
      )}
      {...props}
    >
      <Slottable>{props.children}</Slottable>
    </Comp>
  );
});

export const CardButtonHeader = React.forwardRef<
  HTMLDivElement,
  {
    className?: string;
    children: React.ReactNode;
    asChild?: boolean;
    displayArrow?: boolean;
  }
>(function CardButtonHeader(
  { className, asChild, displayArrow = true, ...props },
  ref,
) {
  const Comp = asChild ? Slot : 'div';

  return (
    <Comp className={cn(className, 'p-4')} {...props} ref={ref}>
      <Slottable>
        {props.children}

        <ChevronRight
          className={cn(
            'absolute right-2 top-4 h-4 text-muted-foreground transition-colors group-hover:text-secondary-foreground',
            {
              hidden: !displayArrow,
            },
          )}
        />
      </Slottable>
    </Comp>
  );
});

export const CardButtonContent = React.forwardRef<
  HTMLDivElement,
  {
    className?: string;
    asChild?: boolean;
    children: React.ReactNode;
  }
>(function CardButtonContent({ className, asChild, ...props }, ref) {
  const Comp = asChild ? Slot : 'div';

  return (
    <Comp
      className={cn(className, 'flex flex-1 flex-col px-4')}
      {...props}
      ref={ref}
    >
      <Slottable>{props.children}</Slottable>
    </Comp>
  );
});

export const CardButtonFooter = React.forwardRef<
  HTMLDivElement,
  {
    className?: string;
    asChild?: boolean;
    children: React.ReactNode;
  }
>(function CardButtonFooter({ className, asChild, ...props }, ref) {
  const Comp = asChild ? Slot : 'div';

  return (
    <Comp
      className={cn(
        className,
        'mt-auto flex h-0 w-full flex-col justify-center border-t px-4',
      )}
      {...props}
      ref={ref}
    >
      <Slottable>{props.children}</Slottable>
    </Comp>
  );
});

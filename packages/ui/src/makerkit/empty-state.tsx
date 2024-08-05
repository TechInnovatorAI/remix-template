import React from 'react';

import { Button } from '../shadcn/button';
import { cn } from '../utils';

const EmptyStateHeading = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('text-2xl font-bold tracking-tight', className)}
    {...props}
  />
));
EmptyStateHeading.displayName = 'EmptyStateHeading';

const EmptyStateText = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
));
EmptyStateText.displayName = 'EmptyStateText';

const EmptyStateButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof Button>
>(({ className, ...props }, ref) => (
  <Button ref={ref} className={cn('mt-4', className)} {...props} />
));
EmptyStateButton.displayName = 'EmptyStateButton';

const EmptyState = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => {
  const childrenArray = React.Children.toArray(children);

  const heading = childrenArray.find(
    (child) => React.isValidElement(child) && child.type === EmptyStateHeading,
  );

  const text = childrenArray.find(
    (child) => React.isValidElement(child) && child.type === EmptyStateText,
  );

  const button = childrenArray.find(
    (child) => React.isValidElement(child) && child.type === EmptyStateButton,
  );

  const cmps = [EmptyStateHeading, EmptyStateText, EmptyStateButton];

  const otherChildren = childrenArray.filter(
    (child) =>
      React.isValidElement(child) &&
      !cmps.includes(child.type as (typeof cmps)[number]),
  );

  return (
    <div
      ref={ref}
      className={cn(
        'flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm',
        className,
      )}
      {...props}
    >
      <div className="flex flex-col items-center gap-1 text-center">
        {heading}
        {text}
        {button}
        {otherChildren}
      </div>
    </div>
  );
});
EmptyState.displayName = 'EmptyState';

export { EmptyState, EmptyStateHeading, EmptyStateText, EmptyStateButton };

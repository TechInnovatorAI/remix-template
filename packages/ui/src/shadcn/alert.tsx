import * as React from 'react';

import { type VariantProps, cva } from 'class-variance-authority';

import { cn } from '../utils';

const alertVariants = cva(
  'relative w-full bg-gradient-to-r rounded-lg border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7',
  {
    variants: {
      variant: {
        default: 'bg-background text-foreground',
        destructive:
          'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive from-red-50 from-10% via-background to-background dark:from-red-500/10',
        success:
          'border-green-600/50 text-green-600 dark:border-green-600 [&>svg]:text-green-600 from-green-50 from-10% via-background to-background dark:from-green-500/10',
        warning:
          'border-orange-600/50 text-orange-600 dark:border-orange-600 [&>svg]:text-orange-600 from-orange-50 from-10% via-background to-background dark:from-orange-500/10',
        info: 'border-blue-600/50 text-blue-600 dark:border-blue-600 [&>svg]:text-blue-600 from-blue-50 from-10% via-background to-background dark:from-blue-500/10',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
));
Alert.displayName = 'Alert';

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn('mb-1 font-bold leading-none tracking-tight', className)}
    {...props}
  />
));
AlertTitle.displayName = 'AlertTitle';

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-sm font-normal [&_p]:leading-relaxed', className)}
    {...props}
  />
));
AlertDescription.displayName = 'AlertDescription';

export { Alert, AlertTitle, AlertDescription };

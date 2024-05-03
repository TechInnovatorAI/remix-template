import { cn } from '../utils';

type Level = 1 | 2 | 3 | 4 | 5 | 6;

export function Heading({
  level,
  children,
  className,
}: React.PropsWithChildren<{ level?: Level; className?: string }>) {
  switch (level) {
    case 1:
      return (
        <h1
          className={cn(
            `scroll-m-20 font-heading text-4xl font-bold tracking-tight dark:text-white`,
            className,
          )}
        >
          {children}
        </h1>
      );
    case 2:
      return (
        <h2
          className={cn(
            `scroll-m-20 pb-2 font-heading text-3xl font-semibold tracking-tight transition-colors first:mt-0`,
            className,
          )}
        >
          {children}
        </h2>
      );
    case 3:
      return (
        <h3
          className={cn(
            'scroll-m-20 font-heading text-2xl font-semibold tracking-tight',
            className,
          )}
        >
          {children}
        </h3>
      );
    case 4:
      return (
        <h4
          className={cn(
            'scroll-m-20 font-heading text-xl font-semibold tracking-tight',
            className,
          )}
        >
          {children}
        </h4>
      );
    case 5:
      return (
        <h5
          className={cn(
            'scroll-m-20 font-heading text-lg font-medium',
            className,
          )}
        >
          {children}
        </h5>
      );
    case 6:
      return (
        <h6
          className={cn(
            'scroll-m-20 font-heading text-base font-medium',
            className,
          )}
        >
          {children}
        </h6>
      );

    default:
      return <Heading level={1}>{children}</Heading>;
  }
}

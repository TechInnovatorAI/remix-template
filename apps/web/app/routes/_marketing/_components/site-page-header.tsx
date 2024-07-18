import { cn } from '@kit/ui/utils';

export function SitePageHeader(props: {
  title: string;
  subtitle: string;
  className?: string;
}) {
  return (
    <div className={cn('border-b py-8 xl:py-10 2xl:py-12', props.className)}>
      <div className={'container flex flex-col space-y-2 lg:space-y-4'}>
        <h1
          className={
            'font-heading text-3xl font-medium tracking-tighter dark:text-white xl:text-5xl'
          }
        >
          {props.title}
        </h1>

        <h2
          className={
            'text-lg tracking-tight text-muted-foreground 2xl:text-2xl'
          }
        >
          {props.subtitle}
        </h2>
      </div>
    </div>
  );
}
import { cn } from '@kit/ui/utils';

type Props = {
  title: string;
  src: string;
  className?: string;
};

export function CoverImage({ title, src, className }: Props) {
  return (
    <img
      className={cn(
        'duration-250 block rounded-xl object-cover' +
          ' transition-all hover:opacity-90',
        className,
      )}
      src={src}
      alt={`Cover for ${title}`}
    />
  );
}

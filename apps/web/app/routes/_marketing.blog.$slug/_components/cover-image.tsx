import { cn } from '@kit/ui/utils';

type Props = {
  title: string;
  src: string;
  className?: string;
};

export const CoverImage: React.FC<Props> = ({
  title,
  src,
  className,
}) => {
  return (
    <img
      className={cn(
        'duration-250 block rounded-xl object-cover' +
          ' transition-all hover:opacity-90',
          className
      )}
      src={src}
      alt={`Cover Image for ${title}`}
    />
  );
};

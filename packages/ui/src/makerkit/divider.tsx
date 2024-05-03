import { cn } from '../utils/cn';

export function Divider(props: { className?: string }) {
  return <div className={cn('h-[1px] w-full bg-border', props.className)} />;
}

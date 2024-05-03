import { PageHeader } from '@kit/ui/page';

export function HomeLayoutPageHeader(
  props: React.PropsWithChildren<{
    title: string | React.ReactNode;
    description: string | React.ReactNode;
  }>,
) {
  return (
    <PageHeader title={props.title} description={props.description}>
      {props.children}
    </PageHeader>
  );
}

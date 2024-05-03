import { PageHeader } from '@kit/ui/page';

export function TeamAccountLayoutPageHeader(
  props: React.PropsWithChildren<{
    title: string | React.ReactNode;
    description: string | React.ReactNode;
    account: string;
  }>,
) {
  return (
    <PageHeader title={props.title} description={props.description}>
      {props.children}
    </PageHeader>
  );
}

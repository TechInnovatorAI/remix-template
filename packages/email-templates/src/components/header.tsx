import { Container } from '@react-email/components';

export function EmailHeader(props: React.PropsWithChildren) {
  return <Container>{props.children}</Container>;
}

import { Container } from '@react-email/components';
import * as React from 'react';

export function EmailHeader(props: React.PropsWithChildren) {
  return (
    <Container>
      {props.children}
    </Container>
  );
}

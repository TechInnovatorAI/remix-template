import { Container, Text } from '@react-email/components';
import * as React from 'react';

export function EmailFooter(props: React.PropsWithChildren) {
  return (
    <Container>
      <Text className="text-[12px] leading-[24px] text-gray-300 px-4">
        {props.children}
      </Text>
    </Container>
  );
}

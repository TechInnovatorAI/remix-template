import { Container } from '@react-email/components';
import * as React from 'react';

export function EmailContent(
  props: React.PropsWithChildren<{
    className?: string;
  }>,
) {
  return (
    <Container
      className={
        'rounded-xl my-[8px] px-[24px] py-[12px] mx-auto border border-solid border-[#eeeeee] ' +
          props.className || ''
      }
    >
      {props.children}
    </Container>
  );
}

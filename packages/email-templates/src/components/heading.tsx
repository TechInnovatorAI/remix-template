import * as React from 'react';
import { Heading } from '@react-email/components';

export function EmailHeading(props: React.PropsWithChildren) {
  return (
    <Heading className="text-black font-sans tracking-tight text-[20px] font-normal p-0 mx-0">
      {props.children}
    </Heading>
  );
}

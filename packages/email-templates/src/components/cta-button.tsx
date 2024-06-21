import { Button } from '@react-email/components';
import * as React from 'react';

export function CtaButton(
  props: React.PropsWithChildren<{
    href: string;
  }>,
) {
  return (
    <Button
      className="w-full bg-[#000000] rounded text-white text-[14px] font-semibold no-underline text-center py-3"
      href={props.href}
    >
      {props.children}
    </Button>
  );
}

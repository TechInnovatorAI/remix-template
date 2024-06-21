import { Heading } from '@react-email/components';

export function EmailHeading(props: React.PropsWithChildren) {
  return (
    <Heading className="mx-0 p-0 font-sans text-[20px] font-normal tracking-tight text-black">
      {props.children}
    </Heading>
  );
}

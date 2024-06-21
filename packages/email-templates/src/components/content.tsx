import { Container } from '@react-email/components';

export function EmailContent(
  props: React.PropsWithChildren<{
    className?: string;
  }>,
) {
  return (
    <Container
      className={
        'mx-auto my-[8px] rounded-xl border border-solid border-[#eeeeee] px-[24px] py-[12px] ' +
          props.className || ''
      }
    >
      {props.children}
    </Container>
  );
}

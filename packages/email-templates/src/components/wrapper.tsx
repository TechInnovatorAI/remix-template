import { Container } from '@react-email/components';

export function EmailWrapper(
  props: React.PropsWithChildren<{
    className?: string;
  }>,
) {
  return (
    <Container
      style={{
        backgroundColor: '#fff',
        margin: 'auto',
        fontFamily: 'sans-serif',
        color: '#484848',
      }}
    >
      <Container
        style={{
          maxWidth: '535px',
          backgroundColor: '#fff',
          margin: 'auto',
        }}
        className={'mx-auto my-[36px] px-4 ' + props.className || ''}
      >
        {props.children}
      </Container>
    </Container>
  );
}

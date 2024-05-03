import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Tailwind,
  Text,
  render,
} from '@react-email/components';

import { initializeEmailI18n } from '../lib/i18n';

interface Props {
  productName: string;
  userDisplayName: string;
  language?: string;
}

export async function renderAccountDeleteEmail(props: Props) {
  const namespace = 'account-delete-email';

  const { t } = await initializeEmailI18n({
    language: props.language,
    namespace,
  });

  const previewText = t(`${namespace}:previewText`, {
    productName: props.productName,
  });

  const subject = t(`${namespace}:subject`);

  const html = render(
    <Html>
      <Head />
      <Preview>{previewText}</Preview>

      <Tailwind>
        <Body className="mx-auto my-auto bg-[#ffffff] font-sans">
          <Container className="mx-auto my-[40px] w-[465px] rounded-lg border border-solid border-[#eaeaea] bg-white p-[20px]">
            <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-bold text-black">
              {previewText}
            </Heading>

            <Text className="text-[14px] leading-[24px] text-black">
              {t(`${namespace}:hello`, {
                displayName: props.userDisplayName,
              })}
            </Text>

            <Text className="text-[14px] leading-[24px] text-black">
              {t(`${namespace}:paragraph1`, {
                productName: props.productName,
              })}
            </Text>

            <Text className="text-[14px] leading-[24px] text-black">
              {t(`${namespace}:paragraph2`)}
            </Text>

            <Text className="text-[14px] leading-[24px] text-black">
              {t(`${namespace}:paragraph3`, {
                productName: props.productName,
              })}
            </Text>

            <Text className="text-[14px] leading-[24px] text-black">
              {t(`${namespace}:paragraph4`, {
                productName: props.productName,
              })}
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>,
  );

  return {
    html,
    subject,
  };
}

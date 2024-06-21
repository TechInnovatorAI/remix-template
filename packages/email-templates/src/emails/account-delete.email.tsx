import {
  Body,
  Head,
  Html,
  Preview,
  Tailwind,
  Text,
  render,
} from '@react-email/components';

import { BodyStyle } from '../components/body-style';
import { EmailContent } from '../components/content';
import { EmailFooter } from '../components/footer';
import { EmailHeader } from '../components/header';
import { EmailHeading } from '../components/heading';
import { EmailWrapper } from '../components/wrapper';
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

  const subject = t(`${namespace}:subject`, {
    productName: props.productName,
  });

  const html = render(
    <Html>
      <Head>
        <BodyStyle />
      </Head>

      <Preview>{previewText}</Preview>

      <Tailwind>
        <Body>
          <EmailWrapper>
            <EmailHeader>
              <EmailHeading>{previewText}</EmailHeading>
            </EmailHeader>

            <EmailContent>
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
            </EmailContent>

            <EmailFooter>{props.productName}</EmailFooter>
          </EmailWrapper>
        </Body>
      </Tailwind>
    </Html>,
  );

  return {
    html,
    subject,
  };
}

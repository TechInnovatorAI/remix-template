import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
  render,
} from '@react-email/components';

import { initializeEmailI18n } from '../lib/i18n';

interface Props {
  teamName: string;
  teamLogo?: string;
  inviter: string | undefined;
  invitedUserEmail: string;
  link: string;
  productName: string;
  language?: string;
}

export async function renderInviteEmail(props: Props) {
  const namespace = 'invite-email';

  const { t } = await initializeEmailI18n({
    language: props.language,
    namespace,
  });

  const previewText = `Join ${props.invitedUserEmail} on ${props.productName}`;
  const subject = t(`${namespace}:subject`);

  const heading = t(`${namespace}:heading`, {
    teamName: props.teamName,
    productName: props.productName,
  });

  const hello = t(`${namespace}:hello`, {
    invitedUserEmail: props.invitedUserEmail,
  });

  const mainText = t(`${namespace}:mainText`, {
    inviter: props.inviter,
    teamName: props.teamName,
    productName: props.productName,
  });

  const joinTeam = t(`${namespace}:joinTeam`, {
    teamName: props.teamName,
  });

  const html = render(
    <Html>
      <Head />
      <Preview>{previewText}</Preview>

      <Tailwind>
        <Body className="mx-auto my-auto bg-[#ffffff] font-sans">
          <Container className="mx-auto my-[40px] w-[465px] rounded-lg border border-solid border-[#eaeaea] bg-white p-[20px]">
            <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
              {heading}
            </Heading>

            <Text className="text-[14px] leading-[24px] text-black">
              {hello}
            </Text>

            <Text
              className="text-[14px] leading-[24px] text-black"
              dangerouslySetInnerHTML={{ __html: mainText }}
            />

            {props.teamLogo && (
              <Section>
                <Row>
                  <Column align="center">
                    <Img
                      className="rounded-full"
                      src={props.teamLogo}
                      width="64"
                      height="64"
                    />
                  </Column>
                </Row>
              </Section>
            )}

            <Section className="mb-[32px] mt-[32px] text-center">
              <Button
                className="rounded bg-[#000000] px-[20px] py-[12px] text-center text-[12px] font-semibold text-white no-underline"
                href={props.link}
              >
                {joinTeam}
              </Button>
            </Section>

            <Text className="text-[14px] leading-[24px] text-black">
              {t(`${namespace}:copyPasteLink`)}{' '}
              <Link href={props.link} className="text-blue-600 no-underline">
                {props.link}
              </Link>
            </Text>

            <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />

            <Text className="text-[12px] leading-[24px] text-[#666666]">
              {t(`${namespace}:invitationIntendedFor`, {
                invitedUserEmail: props.invitedUserEmail,
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

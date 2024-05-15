import { MetaFunction, useLoaderData } from '@remix-run/react';
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from '@remix-run/server-runtime';

import { Heading } from '@kit/ui/heading';
import { Trans } from '@kit/ui/trans';

import { createI18nServerInstance } from '~/lib/i18n/i18n.server';
import { ContactForm } from '~/routes/_marketing.contact._index/_components/contact-form';
import { SitePageHeader } from '~/routes/_marketing/_components/site-page-header';

import { sendContactEmailAction } from './_lib/server/send-contact-email-action.server';

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    {
      title: data?.title,
      description: data?.subtitle,
    },
  ];
};

export const loader = async function ({ request }: LoaderFunctionArgs) {
  const { t } = await createI18nServerInstance(request);

  return {
    title: t('marketing:contact'),
    subtitle: t('marketing:contactDescription'),
  };
};

export default function ContactPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <SitePageHeader title={data.title} subtitle={data.subtitle} />

      <div className={'container mx-auto'}>
        <div
          className={'flex flex-1 flex-col items-center justify-center py-12'}
        >
          <div
            className={
              'flex w-full max-w-lg flex-col space-y-4 rounded-lg border p-8'
            }
          >
            <div>
              <Heading level={3}>
                <Trans i18nKey={'marketing:contactHeading'} />
              </Heading>

              <p className={'text-muted-foreground'}>
                <Trans i18nKey={'marketing:contactSubheading'} />
              </p>
            </div>

            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}

export const action = async function ({ request }: ActionFunctionArgs) {
  const json = await request.json();

  return sendContactEmailAction(json);
};

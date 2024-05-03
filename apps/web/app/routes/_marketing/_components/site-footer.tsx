import { Link } from '@remix-run/react';

import { Trans } from '@kit/ui/trans';

import { AppLogo } from '~/components/app-logo';
import appConfig from '~/config/app.config';

export function SiteFooter() {
  return (
    <footer className={'mt-auto border-t py-8 2xl:py-14'}>
      <div className={'px-8'}>
        <div className={'flex flex-col space-y-8 lg:flex-row lg:space-y-0'}>
          <div
            className={
              'flex w-full space-x-2 lg:w-4/12 xl:w-4/12' +
              ' xl:space-x-6 2xl:space-x-8'
            }
          >
            <div className={'flex flex-col space-y-4'}>
              <div>
                <AppLogo className={'w-[85px] md:w-[95px]'} />
              </div>

              <div className={'flex flex-col space-y-4'}>
                <div>
                  <p className={'text-muted-foreground text-sm'}>
                    <Trans i18nKey={'marketing:footerDescription'} />
                  </p>
                </div>

                <div className={'text-muted-foreground flex text-xs'}>
                  <p>
                    <Trans
                      i18nKey={'marketing:copyright'}
                      values={{
                        product: appConfig.name,
                        year: new Date().getFullYear(),
                      }}
                    />
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div
            className={
              'flex flex-col space-y-8 lg:space-x-6 lg:space-y-0' +
              ' w-full lg:flex-row lg:justify-end xl:space-x-16'
            }
          >
            <div>
              <div className={'flex flex-col space-y-2.5'}>
                <FooterSectionHeading>
                  <Trans i18nKey={'marketing:about'} />
                </FooterSectionHeading>

                <FooterSectionList>
                  <FooterLink>
                    <Link to={'/blog'}>
                      <Trans i18nKey={'marketing:blog'} />
                    </Link>
                  </FooterLink>
                  <FooterLink>
                    <Link to={'/contact'}>
                      <Trans i18nKey={'marketing:contact'} />
                    </Link>
                  </FooterLink>
                </FooterSectionList>
              </div>
            </div>

            <div>
              <div className={'flex flex-col space-y-2.5'}>
                <FooterSectionHeading>
                  <Trans i18nKey={'marketing:product'} />
                </FooterSectionHeading>

                <FooterSectionList>
                  <FooterLink>
                    <Link to={'/docs'}>
                      <Trans i18nKey={'marketing:documentation'} />
                    </Link>
                  </FooterLink>
                </FooterSectionList>
              </div>
            </div>

            <div>
              <div className={'flex flex-col space-y-2.5'}>
                <FooterSectionHeading>
                  <Trans i18nKey={'marketing:legal'} />
                </FooterSectionHeading>

                <FooterSectionList>
                  <FooterLink>
                    <Link to={'/terms-of-service'}>
                      <Trans i18nKey={'marketing:termsOfService'} />
                    </Link>
                  </FooterLink>
                  <FooterLink>
                    <Link to={'/privacy-policy'}>
                      <Trans i18nKey={'marketing:privacyPolicy'} />
                    </Link>
                  </FooterLink>
                  <FooterLink>
                    <Link to={'/cookie-policy'}>
                      <Trans i18nKey={'marketing:cookiePolicy'} />
                    </Link>
                  </FooterLink>
                </FooterSectionList>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterSectionHeading(props: React.PropsWithChildren) {
  return <span className={'font-heading'}>{props.children}</span>;
}

function FooterSectionList(props: React.PropsWithChildren) {
  return <ul className={'flex flex-col space-y-2.5'}>{props.children}</ul>;
}

function FooterLink(props: React.PropsWithChildren) {
  return (
    <li
      className={
        'text-muted-foreground text-sm hover:underline [&>a]:transition-colors'
      }
    >
      {props.children}
    </li>
  );
}

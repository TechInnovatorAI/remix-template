import { Link } from '@remix-run/react';
import { ArrowRightIcon, LayoutDashboard } from 'lucide-react';

import { PricingTable } from '@kit/billing-gateway/marketing';
import {
  CtaButton,
  FeatureCard,
  FeatureGrid,
  FeatureShowcase,
  FeatureShowcaseIconContainer,
  GradientSecondaryText,
  Hero,
  Pill,
  SecondaryHero,
} from '@kit/ui/marketing';
import { Trans } from '@kit/ui/trans';

import billingConfig from '~/config/billing.config';
import pathsConfig from '~/config/paths.config';

export default function Index() {
  return (
    <div className={'mt-4 flex flex-col space-y-24 py-14'}>
      <Hero
        pill={
          <Pill label={'New'}>
            <span>The leading SaaS Starter Kit for ambitious developers</span>
          </Pill>
        }
        title={
          <>
            <span>The ultimate SaaS Starter</span>
            <span>for your next project</span>
          </>
        }
        subtitle={
          <span>
            Build and Ship a SaaS faster than ever before with the next-gen SaaS
            Starter Kit. Ship your SaaS in days, not months.
          </span>
        }
        cta={<MainCallToActionButton />}
        image={
          <img
            decoding={'async'}
            className={
              'delay-250 animate-in fade-in zoom-in-50 fill-mode-both dark:border-primary/10 rounded-2xl border border-gray-200 duration-1000 ease-out'
            }
            width={3558}
            height={2222}
            src={`/images/dashboard.webp`}
            alt={`App Dashboard`}
          />
        }
      />

      <div className={'container mx-auto'}>
        <div
          className={'flex flex-col space-y-16 xl:space-y-32 2xl:space-y-36'}
        >
          <FeatureShowcase
            heading={
              <>
                <b className="font-semibold dark:text-white">
                  The ultimate SaaS Starter Kit
                </b>
                .{' '}
                <GradientSecondaryText>
                  Unleash your creativity and build your SaaS faster than ever
                  with Makerkit.
                </GradientSecondaryText>
              </>
            }
            icon={
              <FeatureShowcaseIconContainer>
                <LayoutDashboard className="h-5" />
                <span>All-in-one solution</span>
              </FeatureShowcaseIconContainer>
            }
          >
            <FeatureGrid>
              <FeatureCard
                className={
                  'relative col-span-2 overflow-hidden bg-violet-500 text-white lg:h-96'
                }
                label={'Beautiful Dashboard'}
                description={`Makerkit provides a beautiful dashboard to manage your SaaS business.`}
              >
                <img
                  className="border-border absolute right-0 top-0 hidden h-full w-full rounded-tl-2xl border lg:top-36 lg:flex lg:h-auto lg:w-10/12"
                  src={'/images/dashboard-header.webp'}
                  width={'2061'}
                  height={'800'}
                  alt={'Dashboard Header'}
                />
              </FeatureCard>

              <FeatureCard
                className={
                  'relative col-span-2 w-full overflow-hidden lg:col-span-1'
                }
                label={'Authentication'}
                description={`Makerkit provides a variety of providers to allow your users to sign in.`}
              >
                <img
                  className="absolute left-16 top-32 hidden h-auto w-8/12 rounded-l-2xl lg:flex"
                  src={'/images/sign-in.webp'}
                  width={'1760'}
                  height={'1680'}
                  alt={'Sign In'}
                />
              </FeatureCard>

              <FeatureCard
                className={
                  'relative col-span-2 overflow-hidden lg:col-span-1 lg:h-96'
                }
                label={'Multi Tenancy'}
                description={`Multi tenant memberships for your SaaS business.`}
              >
                <img
                  className="absolute right-0 top-0 hidden h-full w-full rounded-tl-2xl border lg:top-28 lg:flex lg:h-auto lg:w-8/12"
                  src={'/images/multi-tenancy.webp'}
                  width={'2061'}
                  height={'800'}
                  alt={'Multi Tenancy'}
                />
              </FeatureCard>

              <FeatureCard
                className={'relative col-span-2 overflow-hidden lg:h-96'}
                label={'Billing'}
                description={`Makerkit supports multiple payment gateways to charge your customers.`}
              >
                <img
                  className="border-border absolute right-0 top-0 hidden h-full w-full rounded-tl-2xl border lg:top-36 lg:flex lg:h-auto lg:w-11/12"
                  src={'/images/billing.webp'}
                  width={'2061'}
                  height={'800'}
                  alt={'Billing'}
                />
              </FeatureCard>
            </FeatureGrid>
          </FeatureShowcase>
        </div>
      </div>

      <div className={'container mx-auto'}>
        <div
          className={
            'flex flex-col items-center justify-center space-y-16 py-16'
          }
        >
          <SecondaryHero
            pill={<Pill>Get started for free. No credit card required.</Pill>}
            heading="Fair pricing for all types of businesses"
            subheading="Get started on our free plan and upgrade when you are ready."
          />

          <div className={'w-full'}>
            <PricingTable
              config={billingConfig}
              paths={{
                signUp: pathsConfig.auth.signUp,
                return: pathsConfig.app.home,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function MainCallToActionButton() {
  return (
    <div className={'flex space-x-4'}>
      <CtaButton>
        <Link to={'/auth/sign-up'}>
          <span className={'flex items-center space-x-0.5'}>
            <span>
              <Trans i18nKey={'common:getStarted'} />
            </span>

            <ArrowRightIcon
              className={
                'animate-in fade-in slide-in-from-left-8 h-4' +
                ' zoom-in fill-mode-both delay-1000 duration-1000'
              }
            />
          </span>
        </Link>
      </CtaButton>

      <CtaButton variant={'link'}>
        <Link to={'/contact'}>
          <Trans i18nKey={'common:contactUs'} />
        </Link>
      </CtaButton>
    </div>
  );
}

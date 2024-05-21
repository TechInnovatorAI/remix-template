import { Link } from '@remix-run/react';
import {
  ChevronRight,
  CreditCard,
  LayoutDashboard,
  Lock,
  Sparkle,
} from 'lucide-react';

import { PricingTable } from '@kit/billing-gateway/marketing';
import { Button } from '@kit/ui/button';
import { Heading } from '@kit/ui/heading';
import { Trans } from '@kit/ui/trans';
import { cn } from '@kit/ui/utils';

import billingConfig from '~/config/billing.config';
import pathsConfig from '~/config/paths.config';

export default function Index() {
  return (
    <div className={'mt-4 flex flex-col space-y-24 py-16'}>
      <div className={'container mx-auto flex flex-col space-y-20'}>
        <div
          className={
            'flex flex-col items-center md:flex-row' +
            ' animate-in fade-in mx-auto flex-1 justify-center ' +
            ' zoom-in-95 slide-in-from-top-24 duration-500'
          }
        >
          <div
            className={
              'flex w-full flex-1 flex-col items-center space-y-8 xl:space-y-12 2xl:space-y-14'
            }
          >
            <Pill>
              <span>The leading SaaS Starter Kit for ambitious developers</span>
            </Pill>

            <div className={'flex flex-col items-center space-y-8'}>
              <HeroTitle>
                <span>The SaaS Starter Kit</span>

                <span>
                  <span>for ambitious developers</span>
                </span>
              </HeroTitle>

              <div className={'flex flex-col'}>
                <Heading
                  level={2}
                  className={
                    'text-muted-foreground p-0 text-center font-sans text-2xl font-normal'
                  }
                >
                  <span>Build and launch a SaaS in days, not months</span>
                </Heading>

                <Heading
                  level={2}
                  className={
                    'text-muted-foreground p-0 text-center font-sans text-2xl font-normal'
                  }
                >
                  <span>Focus on your business, not on the tech</span>
                </Heading>

                <Heading
                  level={2}
                  className={
                    'text-muted-foreground p-0 text-center font-sans text-2xl font-normal'
                  }
                >
                  Ship something great, today.
                </Heading>
              </div>

              <MainCallToActionButton />
            </div>
          </div>
        </div>

        <div
          className={
            'animate-in fade-in mx-auto flex max-w-6xl justify-center py-12 ' +
            ' slide-in-from-top-16 fill-mode-both delay-300 duration-1000'
          }
        >
          <img
            className={
              'delay-250 animate-in fade-in zoom-in-50 fill-mode-both rounded-lg border duration-1000 ease-out'
            }
            width={1689}
            height={1057}
            src={`/images/dashboard-demo.webp`}
            alt={`App`}
          />
        </div>
      </div>

      <div className={'container mx-auto'}>
        <div
          className={
            'flex flex-col items-center justify-center space-y-8 py-8 xl:space-y-16 xl:py-16'
          }
        >
          <div
            className={
              'flex max-w-3xl flex-col items-center space-y-8 text-center'
            }
          >
            <Pill>
              <span>A modern, scalable, and secure SaaS Starter Kit</span>
            </Pill>

            <div className={'flex flex-col space-y-2'}>
              <Heading level={1}>The best tool in the space</Heading>

              <Heading
                level={2}
                className={'text-muted-foreground font-sans font-normal'}
              >
                Unbeatable Features and Benefits for Your SaaS Business
              </Heading>
            </div>
          </div>
        </div>
      </div>

      <div className={'container mx-auto'}>
        <div
          className={'flex flex-col space-y-16 xl:space-y-32 2xl:space-y-36'}
        >
          <FeatureShowcaseContainer>
            <FeatureContainer>
              <div className={'flex flex-col space-y-6'}>
                <IconContainer className={'bg-green-50 dark:bg-green-500/10'}>
                  <Lock className={'h-5 text-green-500'} />
                </IconContainer>

                <div className={'flex flex-col'}>
                  <Heading level={2}>Authentication</Heading>

                  <Heading
                    level={3}
                    className={'text-muted-foreground font-sans font-normal'}
                  >
                    Secure and Easy-to-Use Authentication for Your SaaS Website
                    and API
                  </Heading>
                </div>
              </div>

              <div>
                Our authentication system is built on top of the
                industry-leading PaaS such as Supabase and Firebase. It is
                secure, easy-to-use, and fully customizable. It supports
                email/password, social logins, and more.
              </div>
            </FeatureContainer>

            <FeatureContainer>
              <img
                className="rounded-2xl"
                src={'/images/sign-in.webp'}
                width={'1760'}
                height={'1680'}
                alt={'Sign In'}
              />
            </FeatureContainer>
          </FeatureShowcaseContainer>

          <FeatureShowcaseContainer>
            <FeatureContainer reverse>
              <img
                className="rounded-2xl"
                src={'/images/dashboard.webp'}
                width={'2004'}
                height={'1410'}
                alt={'Dashboard'}
              />
            </FeatureContainer>

            <FeatureContainer>
              <div className={'flex flex-col space-y-6'}>
                <IconContainer className={'bg-indigo-50 dark:bg-indigo-500/10'}>
                  <LayoutDashboard className={'h-5 text-indigo-500'} />
                </IconContainer>

                <div className={'flex flex-col'}>
                  <Heading level={2}>Dashboard</Heading>

                  <Heading
                    level={3}
                    className={'text-muted-foreground font-sans font-normal'}
                  >
                    A fantastic dashboard to manage your SaaS business
                  </Heading>
                </div>
              </div>

              <div>
                Our dashboard offers an overview of your SaaS business. It shows
                at a glance all you need to know about your business. It is
                fully customizable and extendable.
              </div>
            </FeatureContainer>
          </FeatureShowcaseContainer>

          <FeatureShowcaseContainer>
            <FeatureContainer>
              <div className={'flex flex-col space-y-6'}>
                <IconContainer className={'bg-blue-50 dark:bg-blue-500/10'}>
                  <CreditCard className={'h-5 text-blue-500'} />
                </IconContainer>

                <div className={'flex flex-col'}>
                  <Heading level={2}>Billing</Heading>

                  <Heading
                    level={3}
                    className={'text-muted-foreground font-sans font-normal'}
                  >
                    A powerful billing system for your SaaS business
                  </Heading>
                </div>
              </div>

              <div>
                Powerful billing system that supports multiple payment gateways
                such as Stripe, Lemon Squeezy and Paddle. Fully customizable and
                easy to use.
              </div>
            </FeatureContainer>

            <FeatureContainer>
              <img
                className="rounded-2xl"
                src={'/images/billing.webp'}
                width={'1916'}
                height={'1392'}
                alt={'Billing'}
              />
            </FeatureContainer>
          </FeatureShowcaseContainer>
        </div>
      </div>

      <div className={'container mx-auto'}>
        <div
          className={
            'flex flex-col items-center justify-center space-y-16 py-16'
          }
        >
          <div className={'flex flex-col items-center space-y-8 text-center'}>
            <Pill>Get started for free. No credit card required.</Pill>

            <div className={'flex flex-col space-y-2'}>
              <Heading level={1}>
                Fair pricing for all types of businesses
              </Heading>

              <Heading
                level={2}
                className={'text-muted-foreground font-sans font-normal'}
              >
                Get started on our free plan and upgrade when you are ready.
              </Heading>
            </div>
          </div>

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

function HeroTitle({ children }: React.PropsWithChildren) {
  return (
    <h1
      className={
        'font-heading flex flex-col text-center text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl'
      }
    >
      {children}
    </h1>
  );
}

function Pill(props: React.PropsWithChildren) {
  return (
    <h2
      className={
        'text-muted-foreground dark:shadow-primary/20 rounded-full px-4 py-2 text-center text-sm shadow'
      }
    >
      <Sparkle className={'inline-block h-4'} />
      {props.children}
    </h2>
  );
}

function FeatureShowcaseContainer(props: React.PropsWithChildren) {
  return (
    <div
      className={
        'flex flex-col items-center justify-between space-y-8 lg:flex-row lg:space-y-0' +
        ' lg:space-x-24'
      }
    >
      {props.children}
    </div>
  );
}

function FeatureContainer(
  props: React.PropsWithChildren<{
    className?: string;
    reverse?: boolean;
  }>,
) {
  return (
    <div
      className={cn('flex w-full flex-col space-y-6 lg:w-6/12', {
        'order-2 mt-8 lg:order-none lg:mt-0': props.reverse,
      })}
    >
      {props.children}
    </div>
  );
}

function MainCallToActionButton() {
  return (
    <div className={'flex space-x-2'}>
      <Button asChild variant={'link'}>
        <Link to={'/docs'}>
          <Trans i18nKey={'common:documentation'} />
        </Link>
      </Button>

      <Button asChild>
        <Link to={'/auth/sign-up'}>
          <span className={'flex items-center space-x-0.5'}>
            <span>
              <Trans i18nKey={'common:getStarted'} />
            </span>

            <ChevronRight
              className={
                'animate-in fade-in slide-in-from-left-8 h-4' +
                ' delay-800 zoom-in fill-mode-both duration-1000'
              }
            />
          </span>
        </Link>
      </Button>
    </div>
  );
}

function IconContainer(
  props: React.PropsWithChildren<{
    className?: string;
  }>,
) {
  return (
    <div className={'flex'}>
      <span
        className={cn(
          'flex items-center justify-center rounded-lg p-3',
          props.className,
        )}
      >
        {props.children}
      </span>
    </div>
  );
}

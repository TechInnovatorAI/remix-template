import { PlusSquare } from 'lucide-react';
import { z } from 'zod';

import { LineItemSchema } from '@kit/billing';
import { formatCurrency } from '@kit/shared/utils';
import { If } from '@kit/ui/if';
import { Trans } from '@kit/ui/trans';

const className =
  'flex text-secondary-foreground items-center justify-between text-sm';

export function LineItemDetails(
  props: React.PropsWithChildren<{
    lineItems: z.infer<typeof LineItemSchema>[];
    currency: string;
    selectedInterval?: string | undefined;
  }>,
) {
  return (
    <div className={'flex flex-col space-y-1'}>
      {props.lineItems.map((item, index) => {
        // If the item has a description, we render it as a simple text
        // and pass the item as values to the translation so we can use
        // the item properties in the translation.
        if (item.description) {
          return (
            <div key={index} className={className}>
              <span className={'flex items-center space-x-1.5'}>
                <PlusSquare className={'w-4'} />

                <Trans
                  i18nKey={item.description}
                  values={item}
                  defaults={item.description}
                />
              </span>
            </div>
          );
        }

        const SetupFee = () => (
          <If condition={item.setupFee}>
            <div className={className}>
              <span className={'flex items-center space-x-1'}>
                <PlusSquare className={'w-3'} />

                <span>
                  <Trans
                    i18nKey={'billing:setupFee'}
                    values={{
                      setupFee: formatCurrency(
                        props?.currency.toLowerCase(),
                        item.setupFee as number,
                      ),
                    }}
                  />
                </span>
              </span>
            </div>
          </If>
        );

        const FlatFee = () => (
          <div className={'flex flex-col'}>
            <div className={className}>
              <span className={'flex items-center space-x-1'}>
                <span className={'flex items-center space-x-1.5'}>
                  <PlusSquare className={'w-3'} />

                  <span>
                    <Trans i18nKey={'billing:basePlan'} />
                  </span>
                </span>

                <span>-</span>

                <span>
                  <If
                    condition={props.selectedInterval}
                    fallback={<Trans i18nKey={'billing:lifetime'} />}
                  >
                    <Trans
                      i18nKey={`billing:billingInterval.${props.selectedInterval}`}
                    />
                  </If>
                </span>
              </span>

              <span className={'font-semibold'}>
                {formatCurrency(props?.currency.toLowerCase(), item.cost)}
              </span>
            </div>

            <SetupFee />

            <If condition={item.tiers?.length}>
              <span className={'flex items-center space-x-1.5'}>
                <PlusSquare className={'w-3'} />

                <span className={'flex space-x-1 text-sm'}>
                  <span>
                    <Trans
                      i18nKey={'billing:perUnit'}
                      values={{
                        unit: item.unit,
                      }}
                    />
                  </span>
                </span>
              </span>

              <Tiers item={item} currency={props.currency} />
            </If>
          </div>
        );

        const PerSeat = () => (
          <div key={index} className={'flex flex-col'}>
            <div className={className}>
              <span className={'flex items-center space-x-1.5'}>
                <PlusSquare className={'w-3'} />

                <span>
                  <Trans i18nKey={'billing:perTeamMember'} />
                </span>
              </span>

              <If condition={!item.tiers?.length}>
                <span className={'font-semibold'}>
                  {formatCurrency(props.currency.toLowerCase(), item.cost)}
                </span>
              </If>
            </div>

            <SetupFee />

            <If condition={item.tiers?.length}>
              <Tiers item={item} currency={props.currency} />
            </If>
          </div>
        );

        const Metered = () => (
          <div key={index} className={'flex flex-col'}>
            <div className={className}>
              <span className={'flex items-center space-x-1'}>
                <span className={'flex items-center space-x-1.5'}>
                  <PlusSquare className={'w-3'} />

                  <span className={'flex space-x-1'}>
                    <span>
                      <Trans
                        i18nKey={'billing:perUnit'}
                        values={{
                          unit: item.unit,
                        }}
                      />
                    </span>
                  </span>
                </span>
              </span>

              {/* If there are no tiers, there is a flat cost for usage */}
              <If condition={!item.tiers?.length}>
                <span className={'font-semibold'}>
                  {formatCurrency(props?.currency.toLowerCase(), item.cost)}
                </span>
              </If>
            </div>

            <SetupFee />

            {/* If there are tiers, we render them as a list */}
            <If condition={item.tiers?.length}>
              <Tiers item={item} currency={props.currency} />
            </If>
          </div>
        );

        switch (item.type) {
          case 'flat':
            return <FlatFee key={item.id} />;

          case 'per_seat':
            return <PerSeat key={item.id} />;

          case 'metered': {
            return <Metered key={item.id} />;
          }
        }
      })}
    </div>
  );
}

function Tiers({
  currency,
  item,
}: {
  currency: string;
  item: z.infer<typeof LineItemSchema>;
}) {
  const unit = item.unit;

  const tiers = item.tiers?.map((tier, index) => {
    const previousTier = item.tiers?.[index - 1];
    const isNoLimit = tier.upTo === 'unlimited';

    const previousTierFrom =
      previousTier?.upTo === 'unlimited'
        ? 'unlimited'
        : previousTier === undefined
          ? 0
          : previousTier.upTo + 1 || 0;

    const upTo = tier.upTo;
    const isIncluded = tier.cost === 0;

    return (
      <span
        className={'text-secondary-foreground flex space-x-1 text-xs'}
        key={index}
      >
        <span>-</span>

        <If condition={isNoLimit}>
          <span className={'font-bold'}>
            {formatCurrency(currency.toLowerCase(), tier.cost)}
          </span>

          <span>
            <Trans
              i18nKey={'billing:andAbove'}
              values={{ unit, previousTier: (previousTierFrom as number) - 1 }}
            />
          </span>
        </If>

        <If condition={!isNoLimit}>
          <If condition={isIncluded}>
            <span>
              <Trans i18nKey={'billing:includedUpTo'} values={{ unit, upTo }} />
            </span>
          </If>

          <If condition={!isIncluded}>
            <span className={'font-bold'}>
              {formatCurrency(currency.toLowerCase(), tier.cost)}
            </span>

            <span>
              <Trans
                i18nKey={'billing:fromPreviousTierUpTo'}
                values={{ previousTierFrom, unit, upTo }}
              />
            </span>
          </If>
        </If>
      </span>
    );
  });

  return <div className={'my-2.5 flex flex-col space-y-1.5'}>{tiers}</div>;
}

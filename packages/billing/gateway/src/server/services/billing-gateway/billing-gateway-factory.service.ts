import { z } from 'zod';

import {
  BillingProviderSchema,
  BillingStrategyProviderService,
} from '@kit/billing';

export class BillingGatewayFactoryService {
  static async GetProviderStrategy(
    provider: z.infer<typeof BillingProviderSchema>,
  ): Promise<BillingStrategyProviderService> {
    switch (provider) {
      case 'stripe': {
        const { StripeBillingStrategyService } = await import('@kit/stripe');

        return new StripeBillingStrategyService();
      }

      case 'lemon-squeezy': {
        const { LemonSqueezyBillingStrategyService } = await import(
          '@kit/lemon-squeezy'
        );

        return new LemonSqueezyBillingStrategyService();
      }

      case 'paddle': {
        throw new Error('Paddle is not supported yet');
      }

      default:
        throw new Error(`Unsupported billing provider: ${provider as string}`);
    }
  }
}

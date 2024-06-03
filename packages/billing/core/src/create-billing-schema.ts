import { z } from 'zod';

export enum LineItemType {
  Flat = 'flat',
  PerSeat = 'per_seat',
  Metered = 'metered',
}

const BillingIntervalSchema = z.enum(['month', 'year']);
const LineItemTypeSchema = z.enum(['flat', 'per_seat', 'metered']);

export const BillingProviderSchema = z.enum([
  'stripe',
  'paddle',
  'lemon-squeezy',
]);

export const PaymentTypeSchema = z.enum(['one-time', 'recurring']);

export const LineItemSchema = z
  .object({
    id: z
      .string({
        description:
          'Unique identifier for the line item. Defined by the Provider.',
      })
      .min(1),
    name: z
      .string({
        description: 'Name of the line item. Displayed to the user.',
      })
      .min(1),
    description: z
      .string({
        description:
          'Description of the line item. Displayed to the user and will replace the auto-generated description inferred' +
          ' from the line item. This is useful if you want to provide a more detailed description to the user.',
      })
      .optional(),
    cost: z
      .number({
        description: 'Cost of the line item. Displayed to the user.',
      })
      .min(0),
    type: LineItemTypeSchema,
    unit: z
      .string({
        description:
          'Unit of the line item. Displayed to the user. Example "seat" or "GB"',
      })
      .optional(),
    setupFee: z
      .number({
        description: `Lemon Squeezy only: If true, in addition to the cost, a setup fee will be charged.`,
      })
      .positive()
      .optional(),
    tiers: z
      .array(
        z.object({
          cost: z.number().min(0),
          upTo: z.union([z.number().min(0), z.literal('unlimited')]),
        }),
      )
      .optional(),
  })
  .refine(
    (data) =>
      data.type !== LineItemType.Metered ||
      (data.unit && data.tiers !== undefined),
    {
      message: 'Metered line items must have a unit and tiers',
      path: ['type', 'unit', 'tiers'],
    },
  )
  .refine(
    (data) => {
      if (data.type === LineItemType.Metered) {
        return data.cost === 0;
      }

      return true;
    },
    {
      message:
        'Metered line items must have a cost of 0. Please add a different line item type for a flat fee (Stripe)',
      path: ['type', 'cost'],
    },
  );

export const PlanSchema = z
  .object({
    id: z
      .string({
        description: 'Unique identifier for the plan. Defined by yourself.',
      })
      .min(1),
    name: z
      .string({
        description: 'Name of the plan. Displayed to the user.',
      })
      .min(1),
    interval: BillingIntervalSchema.optional(),
    custom: z.boolean().default(false).optional(),
    label: z.string().min(1).optional(),
    buttonLabel: z.string().min(1).optional(),
    href: z.string().min(1).optional(),
    lineItems: z.array(LineItemSchema).refine(
      (schema) => {
        const types = schema.map((item) => item.type);

        const perSeat = types.filter(
          (type) => type === LineItemType.PerSeat,
        ).length;

        const flat = types.filter((type) => type === LineItemType.Flat).length;

        return perSeat <= 1 && flat <= 1;
      },
      {
        message: 'Plans can only have one per-seat and one flat line item',
        path: ['lineItems'],
      },
    ),
    trialDays: z
      .number({
        description:
          'Number of days for the trial period. Leave empty for no trial.',
      })
      .positive()
      .optional(),
    paymentType: PaymentTypeSchema,
  })
  .refine(
    (data) => {
      if (data.custom) {
        return data.lineItems.length === 0;
      }

      return data.lineItems.length > 0;
    },
    {
      message: 'Non-Custom Plans must have at least one line item',
      path: ['lineItems'],
    },
  )
  .refine(
    (data) => {
      if (data.custom) {
        return data.lineItems.length === 0;
      }

      return data.lineItems.length > 0;
    },
    {
      message: 'Custom Plans must have 0 line items',
      path: ['lineItems'],
    },
  )
  .refine(
    (data) => data.paymentType !== 'one-time' || data.interval === undefined,
    {
      message: 'One-time plans must not have an interval',
      path: ['paymentType', 'interval'],
    },
  )
  .refine(
    (data) => data.paymentType !== 'recurring' || data.interval !== undefined,
    {
      message: 'Recurring plans must have an interval',
      path: ['paymentType', 'interval'],
    },
  )
  .refine(
    (item) => {
      const ids = item.lineItems.map((item) => item.id);

      return ids.length === new Set(ids).size;
    },
    {
      message: 'Line item IDs must be unique',
      path: ['lineItems'],
    },
  )
  .refine(
    (data) => {
      if (data.paymentType === 'one-time') {
        const nonFlatLineItems = data.lineItems.filter(
          (item) => item.type !== LineItemType.Flat,
        );

        return nonFlatLineItems.length === 0;
      }

      return true;
    },
    {
      message: 'One-time plans must not have non-flat line items',
      path: ['paymentType', 'lineItems'],
    },
  );

const ProductSchema = z
  .object({
    id: z
      .string({
        description:
          'Unique identifier for the product. Defined by th Provider.',
      })
      .min(1),
    name: z
      .string({
        description: 'Name of the product. Displayed to the user.',
      })
      .min(1),
    description: z
      .string({
        description: 'Description of the product. Displayed to the user.',
      })
      .min(1),
    currency: z
      .string({
        description: 'Currency code for the product. Displayed to the user.',
      })
      .min(3)
      .max(3),
    badge: z
      .string({
        description:
          'Badge for the product. Displayed to the user. Example: "Popular"',
      })
      .optional(),
    features: z
      .array(
        z.string({
          description: 'Features of the product. Displayed to the user.',
        }),
      )
      .nonempty(),
    enableDiscountField: z
      .boolean({
        description: 'Enable discount field for the product in the checkout.',
      })
      .optional(),
    highlighted: z
      .boolean({
        description: 'Highlight this product. Displayed to the user.',
      })
      .optional(),
    plans: z.array(PlanSchema),
  })
  .refine((data) => data.plans.length > 0, {
    message: 'Products must have at least one plan',
    path: ['plans'],
  })
  .refine(
    (item) => {
      const planIds = item.plans.map((plan) => plan.id);

      return planIds.length === new Set(planIds).size;
    },
    {
      message: 'Plan IDs must be unique',
      path: ['plans'],
    },
  );

const BillingSchema = z
  .object({
    provider: BillingProviderSchema,
    products: z.array(ProductSchema).nonempty(),
  })
  .refine(
    (data) => {
      const ids = data.products.flatMap((product) =>
        product.plans.flatMap((plan) => plan.lineItems.map((item) => item.id)),
      );

      return ids.length === new Set(ids).size;
    },
    {
      message: 'Line item IDs must be unique',
      path: ['products'],
    },
  )
  .refine(
    (schema) => {
      if (schema.provider === 'lemon-squeezy') {
        for (const product of schema.products) {
          for (const plan of product.plans) {
            if (plan.lineItems.length > 1) {
              return false;
            }
          }
        }
      }

      return true;
    },
    {
      message: 'Lemon Squeezy only supports one line item per plan',
      path: ['provider', 'products'],
    },
  )
  .refine(
    (schema) => {
      if (schema.provider !== 'lemon-squeezy') {
        // Check if there are any flat fee metered items
        const setupFeeItems = schema.products.flatMap((product) =>
          product.plans.flatMap((plan) =>
            plan.lineItems.filter((item) => item.setupFee),
          ),
        );

        // If there are any flat fee metered items, return an error
        if (setupFeeItems.length > 0) {
          return false;
        }
      }

      return true;
    },
    {
      message:
        'Setup fee metered items are only supported by Lemon Squeezy. For Stripe and Paddle, please use a separate line item for the setup fee.',
      path: ['products', 'plans', 'lineItems'],
    },
  );

export function createBillingSchema(config: z.infer<typeof BillingSchema>) {
  return BillingSchema.parse(config);
}

export type BillingConfig = z.infer<typeof BillingSchema>;
export type ProductSchema = z.infer<typeof ProductSchema>;

export function getPlanIntervals(config: z.infer<typeof BillingSchema>) {
  const intervals = config.products
    .flatMap((product) => product.plans.map((plan) => plan.interval))
    .filter(Boolean);

  return Array.from(new Set(intervals));
}

/**
 * @name getPrimaryLineItem
 * @description Get the primary line item for a plan
 * By default, the primary line item is the first line item in the plan for Lemon Squeezy
 * For other providers, the primary line item is the first flat line item in the plan. If there are no flat line items,
 * the first line item is returned.
 *
 * @param config
 * @param planId
 */
export function getPrimaryLineItem(
  config: z.infer<typeof BillingSchema>,
  planId: string,
) {
  for (const product of config.products) {
    for (const plan of product.plans) {
      if (plan.id === planId) {
        // Lemon Squeezy only supports one line item per plan
        if (config.provider === 'lemon-squeezy') {
          return plan.lineItems[0];
        }

        const flatLineItem = plan.lineItems.find(
          (item) => item.type === LineItemType.Flat,
        );

        if (flatLineItem) {
          return flatLineItem;
        }

        return plan.lineItems[0];
      }
    }
  }

  throw new Error('Base line item not found');
}

export function getProductPlanPair(
  config: z.infer<typeof BillingSchema>,
  planId: string,
) {
  for (const product of config.products) {
    for (const plan of product.plans) {
      if (plan.id === planId) {
        return { product, plan };
      }
    }
  }

  throw new Error('Plan not found');
}

export function getProductPlanPairByVariantId(
  config: z.infer<typeof BillingSchema>,
  planId: string,
) {
  for (const product of config.products) {
    for (const plan of product.plans) {
      for (const lineItem of plan.lineItems) {
        if (lineItem.id === planId) {
          return { product, plan };
        }
      }
    }
  }

  throw new Error('Plan not found');
}

export function getLineItemTypeById(
  config: z.infer<typeof BillingSchema>,
  id: string,
) {
  for (const product of config.products) {
    for (const plan of product.plans) {
      for (const lineItem of plan.lineItems) {
        if (lineItem.id === id) {
          return lineItem.type;
        }
      }
    }
  }

  throw new Error(`Line Item with ID ${id} not found`);
}

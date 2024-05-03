export type OrderWebhook = {
  meta: {
    event_name: string;
    custom_data: {
      account_id: number;
    };
  };

  data: {
    type: string;
    id: string;
    attributes: {
      store_id: number;
      customer_id: number;
      identifier: string;
      order_number: number;
      user_name: string;
      user_email: string;
      currency: string;
      currency_rate: string;
      subtotal: number;
      discount_total: number;
      tax: number;
      total: number;
      subtotal_usd: number;
      discount_total_usd: number;
      tax_usd: number;
      total_usd: number;
      tax_name: string;
      tax_rate: string;
      status: string;
      status_formatted: string;
      refunded: boolean;
      refunded_at: string | null;
      subtotal_formatted: string;
      discount_total_formatted: string;
      tax_formatted: string;
      total_formatted: string;

      first_order_item: {
        id: number;
        order_id: number;
        product_id: number;
        variant_id: number;
        product_name: string;
        variant_name: string;
        price: number;
        created_at: string;
        updated_at: string;
        deleted_at: string | null;
        test_mode: boolean;
      };

      urls: {
        receipt: string;
      };

      created_at: string;
      updated_at: string;
    };

    relationships: {
      store: {
        links: {
          related: string;
          self: string;
        };
      };
      customer: {
        links: {
          related: string;
          self: string;
        };
      };
      'order-items': {
        links: {
          related: string;
          self: string;
        };
      };
      subscriptions: {
        links: {
          related: string;
          self: string;
        };
      };
      'license-keys': {
        links: {
          related: string;
          self: string;
        };
      };
      'discount-redemptions': {
        links: {
          related: string;
          self: string;
        };
      };
    };
    links: {
      self: string;
    };
  };
};

export interface SubscriptionInvoiceWebhook {
  meta: Meta;
  data: Data;
}

interface Data {
  type: string;
  id: string;
  attributes: Attributes;
}

interface Meta {
  event_name: string;
  custom_data: {
    account_id: string;
  };
}

interface Attributes {
  store_id: number;
  subscription_id: number;
  customer_id: number;
  user_name: string;
  user_email: string;
  billing_reason: string;
  card_brand: string;
  card_last_four: string;
  currency: string;
  currency_rate: string;
  status: string;
  status_formatted: string;
  refunded: boolean;
  refunded_at: string | null;
  subtotal: number;
  discount_total: number;
  tax: number;
  tax_inclusive: boolean;
  total: number;
  subtotal_usd: number;
  discount_total_usd: number;
  tax_usd: number;
  total_usd: number;
  subtotal_formatted: string;
  discount_total_formatted: string;
  tax_formatted: string;
  total_formatted: string;
  urls: {
    invoice_url: string;
  };
  created_at: string;
  updated_at: string;
  test_mode: boolean;
}

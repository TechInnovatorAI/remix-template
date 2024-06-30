export interface SubscriptionWebhook {
  meta: Meta;
  data: Data;
}

interface Data {
  type: string;
  id: string;
  attributes: Attributes;
  relationships: Relationships;
  links: DataLinks;
}

interface Attributes {
  store_id: number;
  customer_id: number;
  order_id: number;
  order_item_id: number;
  product_id: number;
  variant_id: number;
  product_name: string;
  variant_name: string;
  user_name: string;
  user_email: string;
  status:
    | 'active'
    | 'cancelled'
    | 'paused'
    | 'on_trial'
    | 'past_due'
    | 'unpaid'
    | 'incomplete';
  status_formatted: string;
  card_brand: string;
  card_last_four: string;
  pause: null;
  cancelled: boolean;
  trial_ends_at: string;
  billing_anchor: number;
  urls: Urls;
  renews_at: string;
  ends_at: string | null;
  created_at: string;
  updated_at: string;
  test_mode: boolean;

  first_subscription_item: {
    id: number;
    subscription_id: number;
    price_id: number;
    quantity: number;
    created_at: string;
    updated_at: string;
  };
}

interface Urls {
  update_payment_method: string;
  customer_portal: string;
}

interface DataLinks {
  self: string;
}

interface Relationships {
  store: Customer;
  customer: Customer;
  order: Customer;
  'order-item': Customer;
  product: Customer;
  variant: Customer;
  'subscription-invoices': Customer;
}

interface Customer {
  links: CustomerLinks;
}

interface CustomerLinks {
  related: string;
  self: string;
}

interface Meta {
  event_name: string;
  custom_data: {
    account_id: string;
  };
}

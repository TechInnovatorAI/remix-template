begin;
create extension "basejump-supabase_test_helpers" version '0.0.6';

select no_plan();

select makerkit.set_identifier('primary_owner', 'test@makerkit.dev');
select makerkit.set_identifier('owner', 'owner@makerkit.dev');
select makerkit.set_identifier('member', 'member@makerkit.dev');
select makerkit.set_identifier('custom', 'custom@makerkit.dev');

INSERT INTO public.billing_customers(account_id, provider, customer_id)
VALUES (makerkit.get_account_id_by_slug('makerkit'), 'stripe', 'cus_test');

-- Call the upsert_order function
SELECT public.upsert_order(makerkit.get_account_id_by_slug('makerkit'), 'cus_test', 'order_test', 'pending', 'stripe', 100, 'usd', '[
    {"id":"order_item_1", "product_id": "prod_test", "variant_id": "var_test", "price_amount": 100, "quantity": 1},
    {"id":"order_item_2", "product_id": "prod_test", "variant_id": "var_test_2", "price_amount": 100, "quantity": 1},
    {"id":"order_item_3", "product_id": "prod_test", "variant_id": "var_test_3", "price_amount": 100, "quantity": 1},
    {"id":"order_item_4", "product_id": "prod_test", "variant_id": "var_test_4", "price_amount": 100, "quantity": 1}
]');

-- Verify that the order was created correctly
SELECT is(
  (SELECT status FROM public.orders WHERE id = 'order_test'),
  'pending',
  'The order status should be pending'
);

-- Verify that the subscription items were created correctly
SELECT row_eq(
    $$ select count(*) from order_items where order_id = 'order_test' $$,
    row(4::bigint),
    'The order items should be created'
);

-- Call the upsert_order function again to update the order
SELECT public.upsert_order(makerkit.get_account_id_by_slug('makerkit'), 'cus_test', 'order_test', 'succeeded', 'stripe', 100, 'usd', '[
    {"id":"order_item_1", "product_id": "prod_test", "variant_id": "var_test", "price_amount": 100, "quantity": 1},
    {"id":"order_item_2", "product_id": "prod_test_2", "variant_id": "var_test_4", "price_amount": 200, "quantity": 10}
]');

-- Verify that the subscription items were created correctly
SELECT row_eq(
    $$ select count(*) from order_items where order_id = 'order_test' $$,
    row(2::bigint),
    'The order items should be updated'
);

-- Verify that the order was updated correctly
SELECT is(
  (SELECT status FROM public.orders WHERE id = 'order_test'),
  'succeeded',
  'The order status should be succeeded'
);

SELECT row_eq(
    $$ select quantity from order_items where variant_id = 'var_test_4' $$,
    row(10::int),
    'The subscription items quantity should be updated'
);

SELECT row_eq(
    $$ select variant_id from order_items where id = 'order_item_2' $$,
    row('var_test_4'::text),
    'The subscription items variant_id should be updated'
);

SELECT row_eq(
    $$ select product_id from order_items where id = 'order_item_2' $$,
    row('prod_test_2'::text),
    'The subscription items prod_test_2 should be updated'
);

SELECT row_eq(
    $$ select price_amount from order_items where variant_id = 'var_test_4' $$,
    row(200::numeric),
    'The subscription items price_amount should be updated'
);

select tests.authenticate_as('member');

-- account can read their own subscription
SELECT isnt_empty(
  $$ select 1 from orders where id = 'order_test' $$,
    'The account can read their own order'
);

SELECT isnt_empty(
  $$ select * from order_items where order_id = 'order_test' $$,
    'The account can read their own order'
);

-- members without permissions

-- foreigners
select tests.create_supabase_user('foreigner');
select tests.authenticate_as('foreigner');

-- account cannot read other's subscription
SELECT is_empty(
  $$ select 1 from orders where id = 'order_test' $$,
    'The account cannot read the other account orders'
);

SELECT is_empty(
  $$ select 1 from order_items where order_id = 'order_test' $$,
    'The account cannot read the other account order items'
);

-- Finish the tests and clean up
SELECT * FROM finish();
ROLLBACK;


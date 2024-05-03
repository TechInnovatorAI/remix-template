BEGIN;
create extension "basejump-supabase_test_helpers" version '0.0.6';

select no_plan();

select has_table('public', 'config', 'Makerkit config table should exist');
select has_table('public', 'accounts', 'Makerkit accounts table should exist');
select has_table('public', 'accounts_memberships', 'Makerkit account_users table should exist');
select has_table('public', 'invitations', 'Makerkit invitations table should exist');
select has_table('public', 'billing_customers', 'Makerkit billing_customers table should exist');
select has_table('public', 'subscriptions', 'Makerkit subscriptions table should exist');
select has_table('public', 'subscription_items', 'Makerkit subscription_items table should exist');
select has_table('public', 'orders', 'Makerkit orders table should exist');
select has_table('public', 'order_items', 'Makerkit order_items table should exist');
select has_table('public', 'roles', 'Makerkit roles table should exist');
select has_table('public', 'role_permissions', 'Makerkit roles_permissions table should exist');

select tests.rls_enabled('public', 'config');
select tests.rls_enabled('public', 'accounts');
select tests.rls_enabled('public', 'accounts_memberships');
select tests.rls_enabled('public', 'invitations');
select tests.rls_enabled('public', 'billing_customers');
select tests.rls_enabled('public', 'subscriptions');
select tests.rls_enabled('public', 'subscription_items');
select tests.rls_enabled('public', 'orders');
select tests.rls_enabled('public', 'order_items');
select tests.rls_enabled('public', 'roles');
select tests.rls_enabled('public', 'role_permissions');

SELECT schema_privs_are('public', 'anon', Array [NULL], 'Anon should not have access to public schema');

-- set the role to anonymous for verifying access tests
set role anon;
select throws_ok('select public.get_config()');
select throws_ok('select public.is_set(''enable_team_accounts'')');

-- set the role to the service_role for testing access
set role service_role;
select ok(public.get_config() is not null),
       'Makerkit get_config should be accessible to the service role';

-- set the role to authenticated for tests
set role authenticated;
select ok(public.get_config() is not null), 'Makerkit get_config should be accessible to authenticated users';
select ok(public.is_set('enable_team_accounts')),
       'Makerkit is_set should be accessible to authenticated users';
select isnt_empty('select * from public.config', 'authenticated users should have access to Makerkit config');

SELECT *
FROM finish();

ROLLBACK;
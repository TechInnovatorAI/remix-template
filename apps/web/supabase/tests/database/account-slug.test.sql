BEGIN;
create extension "basejump-supabase_test_helpers" version '0.0.6';

select no_plan();

--- we insert a user into auth.users and return the id into user_id to use

select tests.create_supabase_user('test1', 'test1@test.com');

select tests.create_supabase_user('test2');

-- Create an team account

select tests.authenticate_as('test1');

select public.create_team_account('Test');
select public.create_team_account('Test');
select public.create_team_account('Test');

-- should automatically create slugs for the accounts
select row_eq(
  $$ select slug from public.accounts where name = 'Test' and slug = 'test' $$,
  row('test'::text),
  'The first team account should automatically create a slug named "test"'
);

select row_eq(
  $$ select slug from public.accounts where name = 'Test' and slug = 'test-1' $$,
  row('test-1'::text),
  'The second team account should automatically create a slug named "test-1"'
);

select row_eq(
  $$ select slug from public.accounts where name = 'Test' and slug = 'test-2' $$,
  row('test-2'::text),
    'The third team account should automatically create a slug named "test-2"'
);

-- Should automatically update the slug if the name is updated
update public.accounts set name = 'Test 4' where slug = 'test-2';

select row_eq(
  $$ select slug from public.accounts where name = 'Test 4' $$,
  row('test-4'::text),
  'Updating the name of a team account should update the slug'
);

-- Should fail if the slug is updated to an existing slug
select throws_ok(
  $$ update public.accounts set slug = 'test-1' where slug = 'test-4' $$,
  'duplicate key value violates unique constraint "accounts_slug_key"'
);

select * from finish();

ROLLBACK;
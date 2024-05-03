begin;

create extension "basejump-supabase_test_helpers" version '0.0.6';

select
  no_plan();

--- we insert a user into auth.users and return the id into user_id to use
select
  tests.create_supabase_user('test1', 'test1@test.com');

select
  tests.create_supabase_user('test2');

-- Create an team account
select
  tests.authenticate_as('test1');

select
  public.create_team_account('Test');

select
  row_eq($$
    select
      primary_owner_user_id, is_personal_account, slug, name from
	makerkit.get_account_by_slug('test') $$, row
	(tests.get_supabase_uid('test1'), false, 'test'::text,
	'Test'::varchar), 'Users can create a team account');

-- Should be the primary owner of the team account by default
select
  row_eq($$
    select
      account_role from public.accounts_memberships
      where
        account_id =(
          select
            id
          from public.accounts
          where
            slug = 'test')
	and user_id = tests.get_supabase_uid('test1') $$, row
	  ('owner'::varchar), 'The primary owner should have the owner role for the team account');

-- Should be able to see the team account
select
  isnt_empty($$
    select
      * from public.accounts
      where
        primary_owner_user_id = tests.get_supabase_uid('test1') $$, 'The primary owner should be able to see the team account');

-- Others should not be able to see the team account
select
  tests.authenticate_as('test2');

select
  is_empty($$
    select
      * from public.accounts
      where
        primary_owner_user_id = tests.get_supabase_uid('test1') $$, 'Other users should not be able to see the team account');

-- should not have any role for the team account
select
  is (public.has_role_on_account((
      select
        id
      from makerkit.get_account_by_slug('test'))),
    false,
    'Foreign users should not have any role for the team account');

select
  *
from
  finish();

rollback;

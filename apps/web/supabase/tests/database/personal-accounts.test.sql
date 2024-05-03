BEGIN;
create extension "basejump-supabase_test_helpers" version '0.0.6';

select no_plan();

--- we insert a user into auth.users and return the id into user_id to use

select tests.create_supabase_user('test1', 'test1@test.com');

select tests.create_supabase_user('test2');

------------
--- Primary Owner
------------
select tests.authenticate_as('test1');

-- should create the personal account automatically with the same ID as the user
SELECT row_eq(
   $$ select primary_owner_user_id, is_personal_account, name from public.accounts order by created_at desc limit 1 $$,
   ROW (tests.get_supabase_uid('test1'), true, 'test1'::varchar),
   'Inserting a user should create a personal account when personal accounts are enabled'
);

-- anon users should not be able to see the personal account

set local role anon;

SELECT throws_ok(
   $$ select * from public.accounts order by created_at desc limit 1 $$,
    'permission denied for schema public'
);

-- the primary owner should be able to see the personal account

select tests.authenticate_as('test1');

SELECT isnt_empty(
   $$ select * from public.accounts where primary_owner_user_id = tests.get_supabase_uid('test1') $$,
    'The primary owner should be able to see the personal account'
);

------------
--- Other Users

-- other users should not be able to see the personal account

select tests.authenticate_as('test2');

SELECT is_empty(
   $$ select * from public.accounts where primary_owner_user_id = tests.get_supabase_uid('test1') $$,
    'Other users should not be able to see the personal account'
);

SELECT *
FROM finish();

ROLLBACK;
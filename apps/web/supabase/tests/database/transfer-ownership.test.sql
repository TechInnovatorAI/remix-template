begin;
create extension "basejump-supabase_test_helpers" version '0.0.6';

select no_plan();

select makerkit.set_identifier('primary_owner', 'test@makerkit.dev');
select makerkit.set_identifier('owner', 'owner@makerkit.dev');
select makerkit.set_identifier('member', 'member@makerkit.dev');
select makerkit.set_identifier('custom', 'custom@makerkit.dev');

-- another user not in the team
select tests.create_supabase_user('test', 'test@supabase.com');

-- auth as a primary owner
select tests.authenticate_as('primary_owner');

-- only the service role can transfer ownership
select throws_ok(
    $$ select public.transfer_team_account_ownership(
        makerkit.get_account_id_by_slug('makerkit'),
        tests.get_supabase_uid('custom')
    ) $$,
    'permission denied for function transfer_team_account_ownership'
);

set local role service_role;

-- the new owner must be a member of the account so this should fail
select throws_ok(
    $$ select public.transfer_team_account_ownership(
        makerkit.get_account_id_by_slug('makerkit'),
        tests.get_supabase_uid('test')
    ) $$,
    'The new owner must be a member of the account'
);

-- this should work because the user is a member of the account
select lives_ok(
    $$ select public.transfer_team_account_ownership(
        makerkit.get_account_id_by_slug('makerkit'),
        tests.get_supabase_uid('owner')
    ) $$
);

-- check the account owner has been updated
select row_eq(
    $$ select primary_owner_user_id from public.accounts where id = makerkit.get_account_id_by_slug('makerkit') $$,
    row(tests.get_supabase_uid('owner')),
    'The account owner should be updated'
);

-- when transferring ownership to an account with a lower role
-- the account will also be updated to the new role
select lives_ok(
    $$ select public.transfer_team_account_ownership(
        makerkit.get_account_id_by_slug('makerkit'),
        tests.get_supabase_uid('member')
    ) $$
);

-- check the account owner has been updated
select row_eq(
    $$ select account_role from public.accounts_memberships
       where account_id = makerkit.get_account_id_by_slug('makerkit')
       and user_id = tests.get_supabase_uid('member');
    $$,
    row('owner'::varchar),
    'The account owner should be updated'
);

select * from finish();

rollback;
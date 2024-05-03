begin;
create extension "basejump-supabase_test_helpers" version '0.0.6';

select no_plan();

select makerkit.set_identifier('primary_owner', 'test@makerkit.dev');
select makerkit.set_identifier('owner', 'owner@makerkit.dev');
select makerkit.set_identifier('member', 'member@makerkit.dev');
select makerkit.set_identifier('custom', 'custom@makerkit.dev');

-- another user not in the team
select tests.create_supabase_user('test', 'test@supabase.com');

-- an owner cannot remove the primary owner
select tests.authenticate_as('owner');

select throws_ok(
   $$ delete from public.accounts_memberships
    where account_id = makerkit.get_account_id_by_slug('makerkit')
    and user_id = '31a03e74-1639-45b6-bfa7-77447f1a4762' $$,
   'The primary account owner cannot be actioned'
);

-- an owner can remove accounts with lower roles
select lives_ok(
   $$ delete from public.accounts_memberships
      where account_id = makerkit.get_account_id_by_slug('makerkit')
      and user_id = '6b83d656-e4ab-48e3-a062-c0c54a427368' $$,
    'Owner should be able to remove a member'
);

-- a member cannot remove a member with a higher role
select tests.authenticate_as('member');

-- delete a membership record where the user is a higher role than the current user
select throws_ok(
   $$ delete from public.accounts_memberships
    where account_id = makerkit.get_account_id_by_slug('makerkit')
    and user_id = '5c064f1b-78ee-4e1c-ac3b-e99aa97c99bf' $$,
    'You do not have permission to action a member from this account'
);

-- an primary_owner cannot remove themselves
select tests.authenticate_as('primary_owner');

select throws_ok(
    $$ delete from public.accounts_memberships
       where account_id = makerkit.get_account_id_by_slug('makerkit')
       and user_id = '31a03e74-1639-45b6-bfa7-77447f1a4762' $$,
    'The primary account owner cannot be removed from the account membership list'
);

-- a primary_owner can remove another member
select lives_ok(
   $$ delete from public.accounts_memberships
    where account_id = makerkit.get_account_id_by_slug('makerkit')
    and user_id = 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4'; $$,
    'Primary owner should be able to remove another member'
);

-- foreigners

-- a user not in the account cannot remove a member

select tests.authenticate_as('test');

select throws_ok(
    $$ delete from public.accounts_memberships
      where account_id = '5deaa894-2094-4da3-b4fd-1fada0809d1c'
      and user_id = tests.get_supabase_uid('owner'); $$,
      'You do not have permission to action a member from this account'
 );

select tests.authenticate_as('owner');

select isnt_empty(
    $$ select 1 from public.accounts_memberships
    where account_id = '5deaa894-2094-4da3-b4fd-1fada0809d1c'
    and user_id = tests.get_supabase_uid('owner'); $$,
    'Foreigners should not be able to remove members');

select tests.authenticate_as('test');

-- a user not in the account cannot remove themselves
select throws_ok(
   $$ delete from public.accounts_memberships
   where account_id = makerkit.get_account_id_by_slug('makerkit')
   and user_id = auth.uid(); $$,
    'You do not have permission to action a member from this account'
);

select * from finish();

rollback;
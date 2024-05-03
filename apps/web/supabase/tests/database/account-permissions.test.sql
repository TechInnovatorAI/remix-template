BEGIN;
create extension "basejump-supabase_test_helpers" version '0.0.6';

select no_plan();

--- we insert a user into auth.users and return the id into user_id to use

select tests.create_supabase_user('test1', 'test1@test.com');

select tests.create_supabase_user('test2');

-- Create an team account

select tests.authenticate_as('test1');

select public.create_team_account('Test');

-- the owner account has permissions to manage members
select row_eq(
  $$ select public.has_permission(
  auth.uid(), makerkit.get_account_id_by_slug('test'), 'members.manage'::app_permissions) $$,
    row(true::boolean),
    'The owner of the team account should have the members.manage permission'
);

-- the owner account has permissions to manage billing
select row_eq(
  $$ select public.has_permission(
  auth.uid(), makerkit.get_account_id_by_slug('test'), 'billing.manage'::app_permissions) $$,
    row(true::boolean),
    'The owner of the team account should have the billing.manage permission'
);

-- Foreigner should not have permissions to manage members

select tests.authenticate_as('test2');

select row_eq(
  $$ select public.has_permission(
  auth.uid(), makerkit.get_account_id_by_slug('test'), 'members.manage'::app_permissions) $$,
    row(false::boolean),
    'Foreigners should not have the members.manage permission'
);

-- Custom roles
-- New roles created for the app

set local role postgres;

-- the name should be unique

select throws_ok(
  $$ insert into public.roles (name, hierarchy_level) values ('owner', 4) $$,
  'duplicate key value violates unique constraint "roles_pkey"'
);

-- the hierarchy level should be unique
select throws_ok(
  $$ insert into public.roles (name, hierarchy_level) values ('custom-role-2', 1) $$,
  'duplicate key value violates unique constraint "roles_hierarchy_level_key"'
);

-- Custom Account Role

set local role postgres;

-- the names should be unique
select throws_ok(
  $$ insert into public.roles (name, hierarchy_level) values ('owner', 1) $$,
  'duplicate key value violates unique constraint "roles_pkey"'
);

-- update user role to custom role
update public.accounts_memberships
    set account_role = 'custom-role'
    where account_id = makerkit.get_account_id_by_slug('test')
        and user_id = tests.get_supabase_uid('test1');

set local role postgres;

-- insert permissions for the custom role
insert into public.role_permissions (role, permission) values ('custom-role', 'members.manage');

select tests.authenticate_as('test1');

-- the custom role does not have permissions to manage billing
select row_eq(
  $$ select public.has_permission(
  auth.uid(), makerkit.get_account_id_by_slug('test'), 'billing.manage'::app_permissions) $$,
    row(false::boolean),
    'The custom role should not have the billing.manage permission'
);

-- the custom role can manage members
select row_eq(
  $$ select public.has_permission(
  auth.uid(), makerkit.get_account_id_by_slug('test'), 'members.manage'::app_permissions) $$,
    row(true::boolean),
    'The custom role should have the members.manage permission'
);

select * from finish();

rollback;
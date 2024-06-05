begin;
create extension "basejump-supabase_test_helpers" version '0.0.6';

select no_plan();

select makerkit.set_identifier('primary_owner', 'test@makerkit.dev');
select makerkit.set_identifier('owner', 'owner@makerkit.dev');
select makerkit.set_identifier('member', 'member@makerkit.dev');
select makerkit.set_identifier('custom', 'custom@makerkit.dev');

select tests.authenticate_as('member');

select throws_ok(
    $$ insert into storage.objects ("bucket_id", "metadata", "name", "owner", "owner_id", "version") values
        ('account_image', '{"key": "value"}', tests.get_supabase_uid('primary_owner'), tests.get_supabase_uid('primary_owner'), tests.get_supabase_uid('primary_owner'), 1); $$,
        'new row violates row-level security policy for table "objects"'
);

select tests.authenticate_as('primary_owner');

select lives_ok(
    $$ insert into storage.objects ("bucket_id", "metadata", "name", "owner", "owner_id", "version") values
        ('account_image', '{"key": "value"}', tests.get_supabase_uid('primary_owner'), tests.get_supabase_uid('primary_owner'), tests.get_supabase_uid('primary_owner'), 1); $$,
        'The owner should be able to insert a new object'
);

select isnt_empty(
    $$ select * from storage.objects where owner = tests.get_supabase_uid('primary_owner') $$,
    'The object should be inserted'
);

select tests.authenticate_as('owner');

select is_empty(
    $$ select * from storage.objects where owner = tests.get_supabase_uid('primary_owner') $$,
    'The owner should not be able to see the object'
);

-- create a new bucket
--
set local role postgres;

select lives_ok(
    $$ insert into storage.buckets ("name", "id", public) values ('new_bucket', 'new_bucket', true); $$
);

-- we create a mock policy allowing only the primary_owner to access the new bucket
-- this is a mock policy to check the existing policy system does not interfere with the new bucket
create policy new_bucket_policy on storage.objects for all using (
  bucket_id = 'new_bucket'
  and auth.uid() = tests.get_supabase_uid('primary_owner')
)
with check (
  bucket_id = 'new_bucket'
  and auth.uid() = tests.get_supabase_uid('primary_owner')
);

select tests.authenticate_as('member');

-- user should not be able to insert into the new bucket according to the new policy
select throws_ok(
    $$ insert into storage.objects ("bucket_id", "metadata", "name", "owner", "owner_id", "version") values
        ('new_bucket', '{"key": "value"}', 'some name', tests.get_supabase_uid('primary_owner'), tests.get_supabase_uid('primary_owner'), 1); $$,
        'new row violates row-level security policy for table "objects"'
);

select tests.authenticate_as('primary_owner');

-- primary_owner should be able to insert into the new bucket according to the new policy
-- this is to check the new policy system is working
--
select lives_ok(
    $$ insert into storage.objects ("bucket_id", "metadata", "name", "owner", "owner_id", "version") values
        ('new_bucket', '{"key": "value"}', 'some name', tests.get_supabase_uid('primary_owner'), tests.get_supabase_uid('primary_owner'), 1); $$,
        'new row violates row-level security policy for table "objects"'
);

select
  *
from
  finish();

rollback;

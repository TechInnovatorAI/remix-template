create schema if not exists makerkit;

-- anon, authenticated, and service_role should have access to makerkit schema
grant USAGE on schema makerkit to anon, authenticated, service_role;

-- Don't allow public to execute any functions in the makerkit schema
alter default PRIVILEGES in schema makerkit revoke execute on FUNCTIONS from public;

-- Grant execute to anon, authenticated, and service_role for testing purposes
alter default PRIVILEGES in schema makerkit grant execute on FUNCTIONS to anon,
  authenticated, service_role;

create or replace function makerkit.set_identifier(
  identifier text,
  user_email text
)
  returns text
  security definer
  set search_path = auth, pg_temp
  as $$
begin
 update auth.users set raw_user_meta_data = jsonb_build_object('test_identifier', identifier)
 where email = user_email;

 return identifier;

end;

$$ language PLPGSQL;

create or replace function makerkit.get_account_by_slug(
  account_slug text
)
  returns setof accounts
  as $$
begin

    return query
      select
        *
      from
        accounts
      where
        slug = account_slug;

end;

$$ language PLPGSQL;

create or replace function makerkit.get_account_id_by_slug(
  account_slug text
)
  returns uuid
  as $$

begin

    return
      (select
         id
       from
         accounts
       where
         slug = account_slug);

end;

$$ language PLPGSQL;

begin;

select plan(1);

select is_empty($$
  select
    *
  from
    makerkit.get_account_by_slug('test') $$,
  'get_account_by_slug should return an empty set when the account does not exist'
);

select
  *
from
  finish();

rollback;

create extension if not exists http with schema extensions;
create extension if not exists pg_tle;

select
    no_plan ();

create or replace function install_extensions()
    returns void
    as $$
declare
    installed boolean;
begin
    select exists (
        select
            1
        from
            pg_catalog.pg_extension
        where
            extname = 'supabase-dbdev'
    ) into installed;

    if installed then
        return;
    end if;

    perform
        pgtle.install_extension(
            'supabase-dbdev',
            resp.contents ->> 'version',
            'PostgreSQL package manager',
            resp.contents ->> 'sql'
        )
    from http(
        (
            'GET',
            'https://api.database.dev/rest/v1/'
            || 'package_versions?select=sql,version'
            || '&package_name=eq.supabase-dbdev'
            || '&order=version.desc'
            || '&limit=1',
            array[
                ('apiKey', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtdXB0cHBsZnZpaWZyYndtbXR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODAxMDczNzIsImV4cCI6MTk5NTY4MzM3Mn0.z2CN0mvO2No8wSi46Gw59DFGCTJrzM0AQKsu_5k134s')::http_header
            ],
            null,
            null
        )
    ) x,
    lateral (
        select
            ((row_to_json(x) -> 'content') #>> '{}')::json -> 0
    ) resp(contents);

    create extension if not exists "supabase-dbdev";

    perform dbdev.install('supabase-dbdev');
    perform dbdev.install('basejump-supabase_test_helpers');
end
$$ language plpgsql;

select install_extensions();

select has_column(
    'auth',
    'users',
    'id',
    'id should exist'
);

select
  *
from
  finish ();

rollback;
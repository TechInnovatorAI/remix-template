begin;

create extension "basejump-supabase_test_helpers" version '0.0.6';

select
  no_plan();

CREATE OR REPLACE FUNCTION check_schema_conditions()
RETURNS void AS
$$
DECLARE
  _table RECORD;
  _column RECORD;
  columnCheckCount INTEGER;
BEGIN
  FOR _table IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public')
  LOOP
    -- 1. Check if every table has RLS enabled
    IF (
      SELECT relrowsecurity FROM pg_class
      INNER JOIN pg_namespace n ON n.oid = pg_class.relnamespace
      WHERE n.nspname = 'public' AND relname = _table.tablename
    ) IS FALSE THEN
      RAISE EXCEPTION 'Table "%" does not have RLS enabled.', _table.tablename;
    END IF;

    -- 2. Check that every text column in the current table has a constraint
    FOR _column IN (SELECT column_name FROM information_schema.columns WHERE table_schema = 'public' AND table_name = _table.tablename AND data_type = 'text')
    LOOP
      SELECT COUNT(*)
      INTO columnCheckCount
      FROM information_schema.constraint_column_usage
      WHERE table_schema = 'public' AND table_name = _table.tablename AND column_name = _column.column_name;

      IF columnCheckCount = 0 THEN
        RAISE NOTICE 'Text column "%.%" does not have a constraint
        .',
        _table.tablename, _column.column_name;
      END IF;
    END LOOP;
  END LOOP;

  RAISE NOTICE 'Schema check completed.';
END
$$ LANGUAGE plpgsql;

select lives_ok($$
  select
    check_schema_conditions();
$$, 'check_schema_conditions()');

select
  *
from
  finish();

rollback;

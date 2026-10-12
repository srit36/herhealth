-- Hand-written migration: things the Prisma schema language cannot express.
--
-- 1. Row Level Security on EVERY table, with no policies.
--    The app connects with a role that bypasses RLS (Supabase's `postgres`
--    role), so this does not affect it. It blocks anyone who reaches the
--    database through Supabase's public API with the publishable key.
--    docs/DECISIONS.md section 5, point 2.
-- 2. Revoke default privileges from Supabase's public API roles (when present).
-- 3. CHECK constraints so bad rating values cannot be stored even if a bug in
--    the app lets one through.
--
-- When you add a table in a later migration, enable RLS on it in that migration.
-- src/db/schema-guards.test.ts fails if a table is missing from this approach.

ALTER TABLE "profiles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "consent_records" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "symptom_types" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "check_ins" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "check_in_symptoms" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "rate_limit_hits" ENABLE ROW LEVEL SECURITY;

-- The roles below exist on Supabase but not on a plain Postgres (local tests).
DO $$
DECLARE
  role_name text;
BEGIN
  FOREACH role_name IN ARRAY ARRAY['anon', 'authenticated'] LOOP
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = role_name) THEN
      EXECUTE format('REVOKE ALL ON TABLE "profiles", "consent_records", "symptom_types", "check_ins", "check_in_symptoms", "rate_limit_hits" FROM %I', role_name);
    END IF;
  END LOOP;
END
$$;

ALTER TABLE "check_ins" ADD CONSTRAINT "check_ins_mood_range" CHECK ("mood" BETWEEN 1 AND 5);
ALTER TABLE "check_ins" ADD CONSTRAINT "check_ins_energy_range" CHECK ("energy" BETWEEN 1 AND 5);
ALTER TABLE "check_ins" ADD CONSTRAINT "check_ins_stress_range" CHECK ("stress" BETWEEN 1 AND 5);
ALTER TABLE "check_ins" ADD CONSTRAINT "check_ins_sleep_quality_range" CHECK ("sleep_quality" IS NULL OR "sleep_quality" BETWEEN 1 AND 5);
ALTER TABLE "check_ins" ADD CONSTRAINT "check_ins_sleep_minutes_range" CHECK ("sleep_minutes" IS NULL OR "sleep_minutes" BETWEEN 0 AND 1440);

ALTER TABLE "rate_limit_hits" ADD CONSTRAINT "rate_limit_hits_count_positive" CHECK ("count" > 0);

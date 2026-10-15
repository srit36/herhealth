// @vitest-environment node
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { symptomSeeds, OTHER_SYMPTOM_SLUG } from '../../prisma/reference-data';

/**
 * Static guards on the schema and migrations. They need no database, so they run
 * in every `npm run test`. They catch the mistakes that are easy to make and
 * costly to miss: a table without Row Level Security, a scale without a range
 * check, a migration folder that is not in order.
 */
const root = process.cwd();
const schema = readFileSync(join(root, 'prisma/schema.prisma'), 'utf8');
const migrationsDir = join(root, 'prisma/migrations');
const migrationFolders = readdirSync(migrationsDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();
const allSql = migrationFolders
  .map((folder) =>
    readFileSync(join(migrationsDir, folder, 'migration.sql'), 'utf8'),
  )
  .join('\n');

const tableNames = [...schema.matchAll(/@@map\("([a-z_]+)"\)/g)]
  .map((match) => match[1])
  // enums are also mapped with @@map; keep only real tables (created with CREATE TABLE)
  .filter((name) => allSql.includes(`CREATE TABLE "${name}"`));

describe('schema and migrations', () => {
  it('finds the tables declared in the schema', () => {
    expect(tableNames.length).toBeGreaterThanOrEqual(6);
    expect(tableNames).toContain('check_ins');
  });

  it('enables Row Level Security on every table', () => {
    for (const table of tableNames) {
      expect(allSql, `RLS missing for ${table}`).toContain(
        `ALTER TABLE "${table}" ENABLE ROW LEVEL SECURITY`,
      );
    }
  });

  it('has a CHECK constraint for every 1 to 5 scale column', () => {
    for (const column of ['mood', 'energy', 'stress', 'sleep_quality']) {
      expect(allSql, `range check missing for ${column}`).toMatch(
        new RegExp(`CHECK \\("${column}"[^)]*BETWEEN 1 AND 5`),
      );
    }
    expect(allSql).toMatch(/CHECK \("sleep_minutes"[^)]*BETWEEN 0 AND 1440/);
  });

  it('keeps migration folders in timestamp order with a lock file', () => {
    expect(migrationFolders[0]).toMatch(/^\d{14}_init$/);
    for (const folder of migrationFolders) {
      expect(folder).toMatch(/^\d{14}_[a-z0-9_]+$/);
    }
    const lock = readFileSync(
      join(migrationsDir, 'migration_lock.toml'),
      'utf8',
    );
    expect(lock).toContain('provider = "postgresql"');
  });

  it('enforces one check-in per user per date', () => {
    expect(schema).toMatch(/@@unique\(\[userId, date\]\)/);
    expect(allSql).toContain('"check_ins_user_id_date_key"');
  });

  it('does not set a datasource url in the schema (it lives in prisma.config.ts)', () => {
    const datasourceBlock = schema.match(/datasource db \{[^}]*\}/)?.[0] ?? '';
    expect(datasourceBlock).not.toMatch(/url\s*=/);
  });
});

describe('symptom reference data', () => {
  it('has unique slugs', () => {
    const slugs = symptomSeeds.map((symptom) => symptom.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('includes the free-text "other" option for check-ins', () => {
    const other = symptomSeeds.find((s) => s.slug === OTHER_SYMPTOM_SLUG);
    expect(other?.useInCheckIn).toBe(true);
  });

  it('offers at least one symptom per module', () => {
    expect(symptomSeeds.some((s) => s.useInCheckIn)).toBe(true);
    expect(symptomSeeds.some((s) => s.useInPeriods)).toBe(true);
  });
});

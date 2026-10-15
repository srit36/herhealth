/**
 * DEVELOPMENT FIXTURE ONLY: `npm run db:seed:demo`.
 *
 * Fills ONE existing account with 30 days of clearly artificial check-ins so the
 * dashboard, timeline and charts can be exercised without typing in data by hand.
 * It is deliberately hard to run by accident:
 *
 *   - refuses when NODE_ENV is "production",
 *   - needs ALLOW_DEMO_SEED=true,
 *   - needs DEMO_SEED_USER_ID (a user who already signed up and finished the
 *     consent step, so a profile row exists),
 *   - refuses to touch an account that already has check-ins, unless
 *     DEMO_SEED_REPLACE=true (which deletes that account's check-ins first).
 *
 * It never ships to production as app functionality: nothing in src/ imports it.
 * The values come from a seeded pseudo-random generator, so every run produces the
 * same series.
 */
import { createSeedClient } from './seed-client';

const DAYS = 30;

/** Small deterministic PRNG (mulberry32) so the demo series is repeatable. */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

/** Today's calendar date in an IANA time zone, as YYYY-MM-DD. */
function todayIn(timeZone: string): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
  return parts; // en-CA formats as YYYY-MM-DD
}

function addDays(date: string, days: number): string {
  const d = new Date(`${date}T00:00:00.000Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

async function main() {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Refusing to seed demo data when NODE_ENV=production.');
  }
  if (process.env.ALLOW_DEMO_SEED !== 'true') {
    throw new Error('Set ALLOW_DEMO_SEED=true to run the demo seed.');
  }
  const userId = process.env.DEMO_SEED_USER_ID;
  if (!userId) {
    throw new Error('Set DEMO_SEED_USER_ID to the id of an existing account.');
  }

  const prisma = createSeedClient();
  try {
    const profile = await prisma.profile.findUnique({ where: { id: userId } });
    if (!profile) {
      throw new Error(
        'No profile for that user id. Sign up and finish the consent step first.',
      );
    }

    const existing = await prisma.checkIn.count({ where: { userId } });
    if (existing > 0) {
      if (process.env.DEMO_SEED_REPLACE !== 'true') {
        throw new Error(
          `That account already has ${existing} check-ins. Set DEMO_SEED_REPLACE=true to replace them.`,
        );
      }
      await prisma.checkIn.deleteMany({ where: { userId } });
    }

    const types = await prisma.symptomType.findMany({
      where: { useInCheckIn: true, slug: { not: 'other' } },
      orderBy: { sortOrder: 'asc' },
    });
    if (types.length === 0) {
      throw new Error('No symptom types found. Run `npm run db:seed` first.');
    }

    const random = mulberry32(20261012);
    const today = todayIn(profile.timeZone);
    const severities = ['MILD', 'MODERATE', 'SEVERE'] as const;

    for (let offset = DAYS - 1; offset >= 0; offset -= 1) {
      // Skip about one day in five so streaks and gaps both appear.
      if (random() < 0.2) continue;
      const date = addDays(today, -offset);
      const sleepMinutes = Math.round(
        clamp(420 + (random() - 0.5) * 240, 240, 600),
      );
      const sleepQuality = clamp(
        Math.round(sleepMinutes / 120 + random() - 0.5),
        1,
        5,
      );
      const symptomCount = random() < 0.45 ? 1 + Math.floor(random() * 2) : 0;
      const picked = [...types]
        .sort(() => random() - 0.5)
        .slice(0, symptomCount);

      await prisma.checkIn.create({
        data: {
          userId,
          date: new Date(`${date}T00:00:00.000Z`),
          mood: clamp(Math.round(3 + (random() - 0.5) * 3), 1, 5),
          energy: clamp(Math.round(sleepQuality - 1 + random() * 2), 1, 5),
          stress: clamp(Math.round(2 + (random() - 0.4) * 3), 1, 5),
          sleepMinutes,
          sleepQuality,
          note: random() < 0.3 ? 'Demo fixture entry.' : null,
          symptoms: {
            create: picked.map((type) => ({
              symptomTypeId: type.id,
              severity: severities[Math.floor(random() * severities.length)],
            })),
          },
        },
      });
    }

    const total = await prisma.checkIn.count({ where: { userId } });
    console.log(`Demo seed finished. The account now has ${total} check-ins.`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

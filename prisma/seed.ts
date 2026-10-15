/**
 * `npx prisma db seed` (also `npm run db:seed`).
 *
 * Seeds REFERENCE data only (the symptom list). It is idempotent: running it
 * again updates labels and ordering and never creates duplicates. It creates no
 * users and no health records.
 */
import { createSeedClient } from './seed-client';
import { symptomSeeds } from './reference-data';

async function main() {
  const prisma = createSeedClient();
  try {
    for (const [index, symptom] of symptomSeeds.entries()) {
      await prisma.symptomType.upsert({
        where: { slug: symptom.slug },
        update: {
          label: symptom.label,
          sortOrder: index,
          useInCheckIn: symptom.useInCheckIn,
          useInPeriods: symptom.useInPeriods,
        },
        create: {
          slug: symptom.slug,
          label: symptom.label,
          sortOrder: index,
          useInCheckIn: symptom.useInCheckIn,
          useInPeriods: symptom.useInPeriods,
        },
      });
    }
    const count = await prisma.symptomType.count();
    console.log(`Seeded symptom types. Table now has ${count} rows.`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

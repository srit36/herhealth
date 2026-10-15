import { config } from 'dotenv';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';

// Shared by the seed scripts. They run outside Next.js, through `tsx`, so they
// load the env files themselves and use relative imports (no `@/` alias).
config({ path: ['.env.local', '.env'] });

export function createSeedClient(): PrismaClient {
  const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      'Set DIRECT_URL (or DATABASE_URL) in .env.local before running a seed script.',
    );
  }
  return new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
}

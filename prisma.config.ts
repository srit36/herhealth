import { config } from 'dotenv';
import { defineConfig } from 'prisma/config';

// The Prisma CLI does not read Next.js's .env.local, so load it explicitly.
// .env.local wins over .env (dotenv never overrides a variable that is already set).
config({ path: ['.env.local', '.env'] });

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    // Migrations and `prisma db seed` use the DIRECT connection (port 5432).
    // The running app uses the pooled DATABASE_URL through a driver adapter
    // (src/lib/prisma.ts). The fallback to '' lets `prisma generate` work on
    // machines with no database configured (CI, first install); any command
    // that actually needs a database then fails with Prisma's own clear error.
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? '',
  },
});

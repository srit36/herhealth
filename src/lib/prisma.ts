import 'server-only';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@/generated/prisma/client';

/**
 * The one Prisma client for the running app.
 *
 * - Connects through the POOLED url (DATABASE_URL, Supabase pooler, port 6543).
 *   Migrations use DIRECT_URL instead (prisma.config.ts).
 * - Created lazily on first use, so importing this module (for example while
 *   `next build` collects route modules) never needs a database.
 * - Cached on `globalThis` in development so hot reloads do not open a new pool
 *   each time.
 *
 * This role bypasses Row Level Security, which is why EVERY query in src/server
 * filters by the signed-in user's id. See docs/DECISIONS.md section 5.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      'DATABASE_URL is not set. Copy .env.example to .env.local and fill it in.',
    );
  }
  // A small pool per serverless instance: the Supabase pooler does the real pooling.
  const adapter = new PrismaPg({ connectionString, max: 5 });
  return new PrismaClient({ adapter });
}

function getClient(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createClient();
  }
  return globalForPrisma.prisma;
}

export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, property) {
    const client = getClient();
    const value = Reflect.get(client, property, client);
    return typeof value === 'function' ? value.bind(client) : value;
  },
});

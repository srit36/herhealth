import 'server-only';
import { createHash } from 'node:crypto';
import { prisma } from '@/lib/prisma';

/**
 * Fixed-window rate limiting, stored in Postgres (table rate_limit_hits) so it
 * works across serverless instances. One row per (key, window).
 *
 * Keys never contain raw personal data: use hashKeyPart() for email addresses.
 */
export type RateLimitRule = {
  /** For example `login:ip:203.0.113.7`. */
  key: string;
  limit: number;
  windowSeconds: number;
};

export type RateLimitResult = {
  allowed: boolean;
  /** Seconds until the current window ends (0 when allowed). */
  retryAfterSeconds: number;
};

/** Start (in ms since epoch) of the fixed window containing `nowMs`. */
export function windowStartFor(nowMs: number, windowSeconds: number): number {
  const windowMs = windowSeconds * 1000;
  return Math.floor(nowMs / windowMs) * windowMs;
}

/** A short, stable, non-reversible token for use inside a rate-limit key. */
export function hashKeyPart(value: string): string {
  return createHash('sha256')
    .update(value.trim().toLowerCase())
    .digest('hex')
    .slice(0, 32);
}

async function consume(
  rule: RateLimitRule,
  now: Date,
): Promise<RateLimitResult> {
  const windowStartMs = windowStartFor(now.getTime(), rule.windowSeconds);
  const windowStart = new Date(windowStartMs);

  const rows = await prisma.$queryRaw<Array<{ count: number }>>`
    INSERT INTO "rate_limit_hits" ("key", "window_start", "count")
    VALUES (${rule.key}, ${windowStart}::timestamptz, 1)
    ON CONFLICT ("key", "window_start")
    DO UPDATE SET "count" = "rate_limit_hits"."count" + 1
    RETURNING "count"
  `;
  const count = Number(rows[0]?.count ?? 1);

  if (count <= rule.limit) return { allowed: true, retryAfterSeconds: 0 };

  const windowEndMs = windowStartMs + rule.windowSeconds * 1000;
  return {
    allowed: false,
    retryAfterSeconds: Math.max(
      1,
      Math.ceil((windowEndMs - now.getTime()) / 1000),
    ),
  };
}

/**
 * Count one hit against every rule. The request is allowed only if it is within
 * ALL limits. When blocked, the longest wait is reported.
 */
export async function enforceRateLimits(
  rules: readonly RateLimitRule[],
  now: Date = new Date(),
): Promise<RateLimitResult> {
  let blocked = false;
  let retryAfterSeconds = 0;
  for (const rule of rules) {
    const result = await consume(rule, now);
    if (!result.allowed) {
      blocked = true;
      retryAfterSeconds = Math.max(retryAfterSeconds, result.retryAfterSeconds);
    }
  }

  // Housekeeping: about 1% of calls remove windows older than two days.
  if (Math.random() < 0.01) {
    const cutoff = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
    await prisma.rateLimitHit
      .deleteMany({ where: { windowStart: { lt: cutoff } } })
      .catch(() => undefined);
  }

  return { allowed: !blocked, retryAfterSeconds };
}

export function waitMessage(retryAfterSeconds: number): string {
  const minutes = Math.ceil(retryAfterSeconds / 60);
  return minutes <= 1
    ? 'Too many attempts. Please wait a minute and try again.'
    : `Too many attempts. Please try again in about ${minutes} minutes.`;
}

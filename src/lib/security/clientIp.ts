import 'server-only';
import { headers } from 'next/headers';

/**
 * Best-effort client address, used ONLY to build rate-limit keys.
 * On Vercel, x-forwarded-for is set by the platform. Elsewhere it can be spoofed
 * unless a trusted proxy overwrites it, so rate limits also key on the target
 * account (hashed email) rather than relying on the address alone.
 */
export async function getClientIp(): Promise<string> {
  const requestHeaders = await headers();
  const forwarded = requestHeaders.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim();
    if (first) return first.slice(0, 64);
  }
  return requestHeaders.get('x-real-ip')?.slice(0, 64) ?? 'unknown';
}

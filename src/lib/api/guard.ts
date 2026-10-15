import 'server-only';
import { ApiError } from '@/lib/api/errors';
import { getAppUserState, type ProfileRecord } from '@/lib/auth/session';
import { isSameOrigin, needsOriginCheck } from '@/lib/security/origin';
import { enforceRateLimits } from '@/lib/security/rateLimit';

export type ApiUser = {
  userId: string;
  email: string | null;
  profile: ProfileRecord;
};

/**
 * The first line of every data endpoint. In order:
 *
 *  1. State-changing requests must come from this site's own origin (CSRF).
 *  2. There must be a valid session (401 otherwise).
 *  3. The person must have a profile and have given every required consent
 *     (403 `consent_required` otherwise), so no health data is processed before
 *     consent.
 *
 * The returned `userId` is the ONLY id a query may use. Never read a user id
 * from the URL, query string or body.
 */
export async function requireApiUser(request: Request): Promise<ApiUser> {
  if (needsOriginCheck(request.method) && !isSameOrigin(request)) {
    throw ApiError.forbidden();
  }

  const state = await getAppUserState();
  if (state.status === 'anonymous') throw ApiError.unauthorized();
  if (state.status === 'needs-consent') throw ApiError.consentRequired();

  return {
    userId: state.user.id,
    email: state.user.email,
    profile: state.profile,
  };
}

/** Per-user limit for expensive or sensitive endpoints (export, delete, AI). */
export async function limitPerUser(
  userId: string,
  action: string,
  limit: number,
  windowSeconds: number,
): Promise<void> {
  const result = await enforceRateLimits([
    { key: `${action}:user:${userId}`, limit, windowSeconds },
  ]);
  if (!result.allowed) throw ApiError.tooManyRequests(result.retryAfterSeconds);
}

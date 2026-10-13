/**
 * CSRF defence for cookie-authenticated JSON endpoints.
 *
 * Session cookies are SameSite=Lax, which already blocks most cross-site
 * requests. This adds the second layer: a state-changing request must come from
 * this site's own origin. Browsers always send `Origin` on fetch() POST, PUT,
 * PATCH and DELETE. When it is missing, `Sec-Fetch-Site` decides. A request with
 * neither (curl, scripts) is rejected, because these endpoints exist for the
 * browser app only.
 *
 * Server Actions (the auth forms) have a built-in equivalent check in Next.js.
 */
const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  const host =
    request.headers.get('x-forwarded-host') ?? request.headers.get('host');

  if (origin) {
    try {
      return host !== null && new URL(origin).host === host;
    } catch {
      return false;
    }
  }

  const fetchSite = request.headers.get('sec-fetch-site');
  return fetchSite === 'same-origin' || fetchSite === 'none';
}

/** True when the request must pass the same-origin check. */
export function needsOriginCheck(method: string): boolean {
  return !SAFE_METHODS.has(method.toUpperCase());
}

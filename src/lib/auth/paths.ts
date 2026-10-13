/**
 * Which URLs need a session, and where to send people afterwards.
 * Pure functions, shared by proxy.ts and the auth actions, so they are easy to test.
 */

/** Pages a signed-in person has no reason to see: they are sent to Home. */
export const AUTH_ONLY_ANONYMOUS_PATHS = ['/login', '/sign-up', '/forgot-password'];

/** Pages reachable without a session. */
const PUBLIC_PATHS = [...AUTH_ONLY_ANONYMOUS_PATHS, '/auth/confirm'];

export function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}

export function isAnonymousOnlyPath(pathname: string): boolean {
  return AUTH_ONLY_ANONYMOUS_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}

export function isApiPath(pathname: string): boolean {
  return pathname === '/api' || pathname.startsWith('/api/');
}

/**
 * Only allow redirects to a path inside this app. Anything else (an absolute URL,
 * a protocol-relative "//evil.example", a backslash trick) falls back to `fallback`.
 */
export function safeNextPath(
  value: string | null | undefined,
  fallback = '/',
): string {
  if (!value) return fallback;
  if (!value.startsWith('/')) return fallback;
  if (value.startsWith('//') || value.includes('\\')) return fallback;
  // Control characters and spaces can confuse URL parsing in some browsers.
  for (const character of value) {
    const code = character.charCodeAt(0);
    if (code <= 0x20 || code === 0x7f) return fallback;
  }
  return value;
}

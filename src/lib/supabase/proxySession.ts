import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { supabaseConfig } from '@/lib/env';
import {
  isAnonymousOnlyPath,
  isApiPath,
  isPublicPath,
  safeNextPath,
} from '@/lib/auth/paths';
import { hardenCookieOptions } from '@/lib/supabase/cookies';

/**
 * Runs from src/proxy.ts on every matched request.
 *
 * 1. Refreshes the session: if the access token is close to expiry it is renewed
 *    and the new cookies are written to the response. Without this, sessions end
 *    unexpectedly.
 * 2. Sends anonymous visitors of non-public PAGES to /login, and signed-in
 *    visitors away from /login and /sign-up.
 *
 * This is a convenience layer, NOT the security boundary. Server Actions are
 * POSTs to the page URL, and a matcher change can silently drop coverage, so every
 * route handler and server action checks the session again itself
 * (src/lib/auth/session.ts, src/lib/api/guard.ts).
 */
export async function updateSession(request: NextRequest): Promise<NextResponse> {
  let response = NextResponse.next({ request });
  const { url, publishableKey } = supabaseConfig();

  const supabase = createServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, hardenCookieOptions(options));
        }
      },
    },
  });

  // getClaims() verifies the token's signature. Never trust getSession() here.
  const { data } = await supabase.auth.getClaims();
  const signedIn = Boolean(data?.claims?.sub);
  const { pathname, search } = request.nextUrl;

  const redirectTo = (target: string): NextResponse => {
    const redirectResponse = NextResponse.redirect(new URL(target, request.url));
    // Keep any refreshed session cookies on the redirect.
    for (const cookie of response.cookies.getAll()) {
      redirectResponse.cookies.set(cookie);
    }
    return redirectResponse;
  };

  // API routes answer for themselves (401 JSON); never redirect them.
  if (isApiPath(pathname)) return response;

  if (!signedIn) {
    if (isPublicPath(pathname)) return response;
    if (pathname === '/reset-password') return redirectTo('/forgot-password');
    const next = safeNextPath(`${pathname}${search}`, '/');
    return redirectTo(next === '/' ? '/login' : `/login?next=${encodeURIComponent(next)}`);
  }

  if (isAnonymousOnlyPath(pathname)) return redirectTo('/');

  return response;
}

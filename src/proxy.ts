import type { NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/proxySession';

/**
 * Next.js 16 renamed `middleware` to `proxy`. It runs on the Node.js runtime.
 * See src/lib/supabase/proxySession.ts for what it does and, just as important,
 * what it does NOT replace.
 */
export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    // Everything except static assets and image optimisation.
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};

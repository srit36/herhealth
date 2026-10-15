import 'server-only';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { supabaseConfig } from '@/lib/env';
import { hardenCookieOptions } from '@/lib/supabase/cookies';

/**
 * A Supabase client bound to the current request's cookies. Use it in Server
 * Actions, Route Handlers and Server Components.
 *
 * Do not keep it in a module-level variable: it holds one request's cookies.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  const { url, publishableKey } = supabaseConfig();

  return createServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, hardenCookieOptions(options));
          }
        } catch {
          // Called from a Server Component, where cookies are read-only. That is
          // fine: proxy.ts refreshes the session on every request.
        }
      },
    },
  });
}

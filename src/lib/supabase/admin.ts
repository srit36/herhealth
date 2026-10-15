import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { supabaseConfig, supabaseSecretKey } from '@/lib/env';

/**
 * Supabase client with the SECRET key: it bypasses every access rule. It is used
 * for exactly one thing, deleting a user's own auth account after they ask for it
 * (src/server/account.ts). Never import it from client code, never pass it
 * user-supplied ids, and never log its responses.
 */
export function createSupabaseAdminClient() {
  const { url } = supabaseConfig();
  return createClient(url, supabaseSecretKey(), {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

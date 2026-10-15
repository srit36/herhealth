/**
 * Environment access in one place, with clear errors when something is missing.
 *
 * `NEXT_PUBLIC_*` variables must be read with the literal `process.env.NAME`
 * form so Next.js can inline them; do not build the name dynamically.
 * Secrets (no NEXT_PUBLIC_ prefix) are only ever read in server-only modules.
 */

export function supabaseConfig(): { url: string; publishableKey: string } {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !publishableKey) {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY must be set (see .env.example).',
    );
  }
  return { url, publishableKey };
}

/** Public base URL of the app, without a trailing slash. */
export function appUrl(): string {
  const value = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
  return value.replace(/\/+$/, '');
}

/** Server-only secret used for account deletion. Never expose to the browser. */
export function supabaseSecretKey(): string {
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!key) {
    throw new Error('SUPABASE_SECRET_KEY must be set (see .env.example).');
  }
  return key;
}

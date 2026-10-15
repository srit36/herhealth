import 'server-only';
import { cache } from 'react';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import {
  latestConsents,
  missingRequiredConsents,
  type ConsentRow,
  type LatestConsents,
} from '@/lib/consents';

/**
 * Server-side identity. Everything that reads or writes a person's data starts
 * here, never from an id sent by the browser.
 */
export type AuthUser = {
  id: string;
  email: string | null;
  /** user_metadata from sign-up. Set by the person, so treat as untrusted input. */
  metadata: Record<string, unknown>;
};

/**
 * The signed-in user, from the verified JWT in the session cookie. Cheap (no
 * network call when the project uses asymmetric signing keys) but it does not
 * notice a session that was revoked or a user that was deleted until the token
 * expires. Use getVerifiedUser() for actions where that matters.
 */
export const getAuthUser = cache(async (): Promise<AuthUser | null> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) return null;
  const claims = data.claims as Record<string, unknown>;
  const id = claims.sub;
  if (typeof id !== 'string' || id.length === 0) return null;
  const metadata = claims.user_metadata;
  return {
    id,
    email: typeof claims.email === 'string' ? claims.email : null,
    metadata:
      metadata && typeof metadata === 'object'
        ? (metadata as Record<string, unknown>)
        : {},
  };
});

/**
 * Like getAuthUser(), but asks the Supabase Auth server, so a deleted user or a
 * revoked session is rejected immediately. Use for account-level actions: giving
 * consent, changing a password, deleting data or the account.
 */
export async function getVerifiedUser(): Promise<AuthUser | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  return {
    id: data.user.id,
    email: data.user.email ?? null,
    metadata: (data.user.user_metadata ?? {}) as Record<string, unknown>,
  };
}

function findProfile(id: string) {
  return prisma.profile.findUnique({ where: { id } });
}

/** A row of the `profiles` table (type derived from the query, not imported). */
export type ProfileRecord = NonNullable<
  Awaited<ReturnType<typeof findProfile>>
>;

export type AppUserState =
  | { status: 'anonymous' }
  | {
      status: 'needs-consent';
      user: AuthUser;
      profile: ProfileRecord | null;
      latest: LatestConsents;
    }
  | {
      status: 'ready';
      user: AuthUser;
      profile: ProfileRecord;
      latest: LatestConsents;
    };

/**
 * Who is making this request, and are they allowed to use the app?
 * "Ready" means: signed in, has a profile, and every required consent is given
 * for the current wording.
 */
export const getAppUserState = cache(async (): Promise<AppUserState> => {
  const user = await getAuthUser();
  if (!user) return { status: 'anonymous' };

  const profile = await findProfile(user.id);
  if (!profile) {
    return { status: 'needs-consent', user, profile: null, latest: {} };
  }

  const rows = await prisma.consentRecord.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
  });
  const latest = latestConsents(rows as ConsentRow[]);
  if (missingRequiredConsents(latest).length > 0) {
    return { status: 'needs-consent', user, profile, latest };
  }
  return { status: 'ready', user, profile, latest };
});

/** For pages and layouts: redirects anonymous visitors and people who still need to consent. */
export async function requireAppUser() {
  const state = await getAppUserState();
  if (state.status === 'anonymous') redirect('/login');
  if (state.status === 'needs-consent') redirect('/consent');
  return state;
}

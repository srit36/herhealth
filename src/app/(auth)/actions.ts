'use server';

import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { appUrl } from '@/lib/env';
import { isValidTimeZone } from '@/lib/dates';
import { logError, logEvent } from '@/lib/log';
import { getVerifiedUser } from '@/lib/auth/session';
import { safeNextPath } from '@/lib/auth/paths';
import type { ActionState } from '@/lib/auth/actionState';
import { CONSENT_VERSION, consentDefinitions } from '@/lib/consents';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getClientIp } from '@/lib/security/clientIp';
import {
  enforceRateLimits,
  hashKeyPart,
  waitMessage,
} from '@/lib/security/rateLimit';
import {
  emailOnlySchema,
  fieldErrors,
  loginSchema,
  normalizeEmail,
  resetPasswordSchema,
  signUpSchema,
} from '@/lib/validation/auth';

/**
 * Server Actions for the auth screens.
 *
 * Next.js checks the Origin header of every Server Action request (CSRF), but
 * Server Actions are public HTTP endpoints, so each one validates its own input
 * and checks the session itself. Nothing here trusts the proxy or the page it was
 * called from.
 *
 * Messages are deliberately vague where a precise one would let someone find out
 * whether an email address has an account (sign-up, login, password reset).
 */

const HOUR = 60 * 60;
const FIFTEEN_MINUTES = 15 * 60;

function failure(
  message: string,
  extra: Partial<ActionState> = {},
): ActionState {
  return { status: 'error', message, ...extra };
}

// ---------------------------------------------------------------------------
// Sign up
// ---------------------------------------------------------------------------

export async function signUpAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = signUpSchema.safeParse({
    name: formData.get('name'),
    email: normalizeEmail(formData.get('email')),
    password: formData.get('password'),
    ageConfirmed: formData.get('ageConfirmed') === 'on',
    timeZone: formData.get('timeZone'),
  });
  if (!parsed.success) {
    return failure('Please check the highlighted fields.', {
      fieldErrors: fieldErrors(parsed.error),
    });
  }
  const { name, email, password, timeZone } = parsed.data;

  const ip = await getClientIp();
  const limit = await enforceRateLimits([
    { key: `signup:ip:${ip}`, limit: 10, windowSeconds: HOUR },
    // Stops the form being used to flood one address with verification emails.
    {
      key: `signup:email:${hashKeyPart(email)}`,
      limit: 5,
      windowSeconds: HOUR,
    },
  ]);
  if (!limit.allowed) return failure(waitMessage(limit.retryAfterSeconds));

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // user_metadata is read once, at the consent step, to create the profile.
      data: {
        display_name: name,
        time_zone: timeZone,
        age_confirmed_at: new Date().toISOString(),
      },
      emailRedirectTo: `${appUrl()}/auth/confirm`,
    },
  });

  if (error) {
    if (error.code === 'weak_password') {
      return failure('Please choose a stronger password.', {
        fieldErrors: { password: 'This password is too easy to guess.' },
      });
    }
    // An existing account must look the same as a new one (no enumeration).
    if (error.code !== 'user_already_exists') {
      logError('auth.signup_failed', error, { code: error.code ?? 'unknown' });
      return failure('We could not create your account. Please try again.');
    }
  }

  // If the project has email confirmation turned off, Supabase signs the person in
  // straight away and the next step is consent.
  if (data?.session) redirect('/consent');

  logEvent('auth.signup_submitted');
  return {
    status: 'success',
    email,
    message:
      'Check your email. If this address can be used, we have sent a link to confirm your account.',
  };
}

// ---------------------------------------------------------------------------
// Log in / out
// ---------------------------------------------------------------------------

export async function loginAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const email = normalizeEmail(formData.get('email'));
  const parsed = loginSchema.safeParse({
    email,
    password: formData.get('password'),
  });
  if (!parsed.success) {
    return failure('Enter your email and password.', {
      fieldErrors: fieldErrors(parsed.error),
    });
  }
  const next = safeNextPath(String(formData.get('next') ?? ''), '/');

  const ip = await getClientIp();
  const limit = await enforceRateLimits([
    { key: `login:ip:${ip}`, limit: 20, windowSeconds: FIFTEEN_MINUTES },
    // Per account, so a botnet cannot guess one person's password from many addresses.
    {
      key: `login:email:${hashKeyPart(parsed.data.email)}`,
      limit: 8,
      windowSeconds: FIFTEEN_MINUTES,
    },
  ]);
  if (!limit.allowed) return failure(waitMessage(limit.retryAfterSeconds));

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    if (error.code === 'email_not_confirmed') {
      return failure(
        'Please confirm your email address first. Check your inbox for the link.',
        {
          needsVerification: true,
          email: parsed.data.email,
        },
      );
    }
    if (error.code !== 'invalid_credentials') {
      logError('auth.login_failed', error, { code: error.code ?? 'unknown' });
    }
    return failure('That email and password do not match.');
  }

  redirect(next);
}

export async function logoutAction(): Promise<void> {
  const supabase = await createSupabaseServerClient();
  // Ends this device's session and clears the cookies.
  await supabase.auth.signOut();
  redirect('/login');
}

// ---------------------------------------------------------------------------
// Email verification and password reset
// ---------------------------------------------------------------------------

export async function resendVerificationAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = emailOnlySchema.safeParse({
    email: normalizeEmail(formData.get('email')),
  });
  const genericOk: ActionState = {
    status: 'success',
    message:
      'If that address is waiting for confirmation, we have sent a new link.',
  };
  if (!parsed.success) return genericOk;

  const ip = await getClientIp();
  const limit = await enforceRateLimits([
    { key: `resend:ip:${ip}`, limit: 5, windowSeconds: HOUR },
    {
      key: `resend:email:${hashKeyPart(parsed.data.email)}`,
      limit: 3,
      windowSeconds: HOUR,
    },
  ]);
  if (!limit.allowed) return failure(waitMessage(limit.retryAfterSeconds));

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.resend({
    type: 'signup',
    email: parsed.data.email,
    options: { emailRedirectTo: `${appUrl()}/auth/confirm` },
  });
  if (error)
    logError('auth.resend_failed', error, { code: error.code ?? 'unknown' });
  return genericOk;
}

export async function forgotPasswordAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = emailOnlySchema.safeParse({
    email: normalizeEmail(formData.get('email')),
  });
  if (!parsed.success) {
    return failure('Enter a valid email address.', {
      fieldErrors: fieldErrors(parsed.error),
    });
  }

  const ip = await getClientIp();
  const limit = await enforceRateLimits([
    { key: `reset:ip:${ip}`, limit: 5, windowSeconds: HOUR },
    {
      key: `reset:email:${hashKeyPart(parsed.data.email)}`,
      limit: 3,
      windowSeconds: HOUR,
    },
  ]);
  if (!limit.allowed) return failure(waitMessage(limit.retryAfterSeconds));

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.resetPasswordForEmail(
    parsed.data.email,
    {
      redirectTo: `${appUrl()}/auth/confirm?next=/reset-password`,
    },
  );
  if (error)
    logError('auth.reset_request_failed', error, {
      code: error.code ?? 'unknown',
    });

  // Same answer whether or not the address has an account.
  return {
    status: 'success',
    message:
      'If an account exists for that address, we have sent a link to reset the password.',
  };
}

export async function resetPasswordAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  // The reset link signs the person in (see /auth/confirm), so a session must exist.
  const user = await getVerifiedUser();
  if (!user) {
    return failure('This reset link has expired. Please request a new one.');
  }

  const parsed = resetPasswordSchema.safeParse({
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  });
  if (!parsed.success) {
    return failure('Please check the highlighted fields.', {
      fieldErrors: fieldErrors(parsed.error),
    });
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });
  if (error) {
    if (error.code === 'same_password') {
      return failure('Choose a password you have not used on this account.', {
        fieldErrors: { password: 'This is already your password.' },
      });
    }
    if (error.code === 'weak_password') {
      return failure('Please choose a stronger password.', {
        fieldErrors: { password: 'This password is too easy to guess.' },
      });
    }
    logError('auth.reset_failed', error, { code: error.code ?? 'unknown' });
    return failure('We could not change your password. Please try again.');
  }

  // A reset usually means "someone else may have my password": end all other sessions.
  await supabase.auth.signOut({ scope: 'others' });
  logEvent('auth.password_reset', { userId: user.id });
  redirect('/');
}

// ---------------------------------------------------------------------------
// Consent
// ---------------------------------------------------------------------------

export async function submitConsentAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  // Verified against the Auth server: never create data for a deleted account.
  const user = await getVerifiedUser();
  if (!user) redirect('/login');

  const granted = Object.fromEntries(
    consentDefinitions.map((definition) => [
      definition.type,
      formData.get(definition.field) === 'on',
    ]),
  ) as Record<(typeof consentDefinitions)[number]['type'], boolean>;

  if (!granted.TERMS || !granted.HEALTH_DATA) {
    return failure(
      'The Terms and the health-data consent are needed to use HerHealth. You can choose the optional ones freely.',
    );
  }

  // The age confirmation was recorded at sign-up (a required checkbox).
  const confirmedAt = new Date(String(user.metadata.age_confirmed_at ?? ''));
  if (Number.isNaN(confirmedAt.getTime())) {
    return failure(
      'We could not find your age confirmation. Please sign out and create your account again from the sign-up page.',
    );
  }

  const rawName =
    typeof user.metadata.display_name === 'string'
      ? user.metadata.display_name.trim()
      : '';
  const displayName = (rawName || user.email?.split('@')[0] || 'there').slice(
    0,
    80,
  );
  const rawZone = user.metadata.time_zone;
  const timeZone = isValidTimeZone(rawZone) ? rawZone : 'UTC';

  try {
    await prisma.$transaction([
      // Create the profile on first consent; leave an existing one untouched.
      prisma.profile.upsert({
        where: { id: user.id },
        update: {},
        create: {
          id: user.id,
          displayName,
          timeZone,
          ageConfirmedAt: confirmedAt,
        },
      }),
      prisma.consentRecord.createMany({
        data: consentDefinitions.map((definition) => ({
          userId: user.id,
          type: definition.type,
          version: CONSENT_VERSION,
          granted: granted[definition.type],
        })),
      }),
    ]);
  } catch (error) {
    logError('auth.consent_failed', error);
    return failure('We could not save your choices. Please try again.');
  }

  logEvent('auth.consent_saved', { userId: user.id, version: CONSENT_VERSION });
  redirect('/');
}

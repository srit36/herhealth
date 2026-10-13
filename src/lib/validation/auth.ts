import { z } from 'zod';
import { isValidTimeZone } from '@/lib/dates';

/**
 * Validation for the auth forms. These run on the SERVER in the actions; the
 * browser's own `required`/`minLength` attributes are only a convenience.
 */
export const PASSWORD_MIN_LENGTH = 8;
// bcrypt, which Supabase uses, ignores everything after 72 bytes.
export const PASSWORD_MAX_LENGTH = 72;

export function normalizeEmail(value: FormDataEntryValue | null): string {
  return typeof value === 'string' ? value.trim().toLowerCase() : '';
}

const email = z
  .string()
  .max(254, 'Enter a valid email address.')
  .pipe(z.email('Enter a valid email address.'));

const newPassword = z
  .string()
  .min(PASSWORD_MIN_LENGTH, `Use at least ${PASSWORD_MIN_LENGTH} characters.`)
  .max(PASSWORD_MAX_LENGTH, `Use at most ${PASSWORD_MAX_LENGTH} characters.`);

export const signUpSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Enter your name.')
    .max(80, 'Use at most 80 characters.'),
  email,
  password: newPassword,
  ageConfirmed: z.literal(true, {
    error: 'Please confirm that you are 18 or older.',
  }),
  timeZone: z
    .string()
    .refine(isValidTimeZone, 'Unknown time zone.')
    .catch('UTC'),
});

export const loginSchema = z.object({
  email,
  // Do not enforce the new-password rules here: accounts keep working if the
  // rules change. Just bound the size.
  password: z.string().min(1, 'Enter your password.').max(256),
});

export const emailOnlySchema = z.object({ email });

export const resetPasswordSchema = z
  .object({
    password: newPassword,
    confirmPassword: z.string(),
  })
  .refine((value) => value.password === value.confirmPassword, {
    path: ['confirmPassword'],
    message: 'The passwords do not match.',
  });

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Enter your current password.').max(256),
    password: newPassword,
    confirmPassword: z.string(),
  })
  .refine((value) => value.password === value.confirmPassword, {
    path: ['confirmPassword'],
    message: 'The passwords do not match.',
  });

/** First message per field from a zod error. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const result: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? 'form');
    if (!(key in result)) result[key] = issue.message;
  }
  return result;
}

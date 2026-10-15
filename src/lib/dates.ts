/**
 * Calendar-date helpers.
 *
 * A check-in belongs to a CALENDAR DATE in the person's own time zone
 * (docs/DECISIONS.md section 3). Dates therefore travel through the app as
 * 'YYYY-MM-DD' strings and are never converted through the server's local time.
 * `new Date('2026-10-05T00:00:00.000Z')` is only used at the database boundary,
 * where Postgres `date` columns are read and written as UTC midnight.
 */

export type DateString = string; // 'YYYY-MM-DD'

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/** True for a real calendar date written as YYYY-MM-DD (rejects 2026-02-31). */
export function isDateString(value: unknown): value is DateString {
  if (typeof value !== 'string' || !DATE_PATTERN.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return (
    !Number.isNaN(parsed.getTime()) &&
    parsed.toISOString().slice(0, 10) === value
  );
}

/** True when the name is a time zone this runtime knows (for example "Asia/Kolkata"). */
export function isValidTimeZone(value: unknown): value is string {
  if (typeof value !== 'string' || value.length === 0 || value.length > 64) {
    return false;
  }
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: value });
    return true;
  } catch {
    return false;
  }
}

/** The calendar date it is right now in `timeZone`. */
export function todayInZone(
  timeZone: string,
  now: Date = new Date(),
): DateString {
  // The en-CA locale formats dates as YYYY-MM-DD.
  return new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
}

/** The hour of day (0 to 23) it is right now in `timeZone`. */
export function hourInZone(timeZone: string, now: Date = new Date()): number {
  const hour = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour: 'numeric',
    hourCycle: 'h23',
  }).format(now);
  return Number.parseInt(hour, 10) % 24;
}

export function addDays(date: DateString, days: number): DateString {
  const result = new Date(`${date}T00:00:00.000Z`);
  result.setUTCDate(result.getUTCDate() + days);
  return result.toISOString().slice(0, 10);
}

/** Whole days from `from` to `to` (positive when `to` is later). */
export function daysBetween(from: DateString, to: DateString): number {
  const ms =
    new Date(`${to}T00:00:00.000Z`).getTime() -
    new Date(`${from}T00:00:00.000Z`).getTime();
  return Math.round(ms / 86_400_000);
}

/** Database boundary: a Postgres `date` column value. */
export function toDbDate(date: DateString): Date {
  return new Date(`${date}T00:00:00.000Z`);
}

/** Database boundary: back to a YYYY-MM-DD string. */
export function fromDbDate(date: Date): DateString {
  return date.toISOString().slice(0, 10);
}

/** "Monday, 5 October" style label for the top bar, in the person's zone. */
export function formatTodayLabel(
  timeZone: string,
  now: Date = new Date(),
): string {
  return new Intl.DateTimeFormat('en-US', {
    timeZone,
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(now);
}

/**
 * Format a calendar date. The date has no time zone, so it is formatted as UTC
 * to stop the browser's own zone from shifting it by a day.
 */
export function formatCalendarDate(
  date: DateString,
  options: Intl.DateTimeFormatOptions,
): string {
  return new Intl.DateTimeFormat('en-US', {
    ...options,
    timeZone: 'UTC',
  }).format(new Date(`${date}T00:00:00.000Z`));
}

export function greetingFor(hour: number): 'morning' | 'afternoon' | 'evening' {
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
}

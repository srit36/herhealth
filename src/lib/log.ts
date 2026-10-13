/**
 * Minimal structured logging.
 *
 * RULE (docs/DECISIONS.md section 5, point 8): logs hold event names, ids and
 * timings. They never hold check-in content, notes, prompts, AI output, document
 * text, email addresses or passwords. Pass only fields that are safe to keep.
 */
type LogFields = Record<string, string | number | boolean | null | undefined>;

export function logEvent(event: string, fields: LogFields = {}): void {
  console.info(JSON.stringify({ level: 'info', event, ...fields }));
}

export function logError(event: string, error: unknown, fields: LogFields = {}): void {
  // Only the error's name and a short code, never its message: messages from
  // database and auth libraries can echo input values.
  const name = error instanceof Error ? error.name : typeof error;
  console.error(JSON.stringify({ level: 'error', event, error: name, ...fields }));
}

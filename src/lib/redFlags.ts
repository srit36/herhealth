export type RedFlagResult = {
  isEmergency: boolean;
  matched: string[];
};

/**
 * STUB — Person A owns the real implementation (server-side red-flag check).
 * The UI only depends on this signature, so swapping it in is a one-file change.
 *
 * Until then it keeps the design's original phrase list as a safety net
 * so emergency wording still reaches the emergency screen.
 */
const PLACEHOLDER_PATTERN =
  /chest pain|can't breathe|suicide|immediate danger/i;

export async function checkRedFlags(text: string): Promise<RedFlagResult> {
  // TODO(Person A): replace with a call to the real red-flag service.
  const match = text.match(PLACEHOLDER_PATTERN);
  return { isEmergency: Boolean(match), matched: match ? [match[0]] : [] };
}

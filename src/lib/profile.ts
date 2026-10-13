/** "Ananya Sharma" -> "AS", "Ananya" -> "A", "" -> "?". */
export function initialsFor(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '?';
  const first = words[0][0] ?? '';
  const last = words.length > 1 ? (words[words.length - 1][0] ?? '') : '';
  return `${first}${last}`.toUpperCase();
}

/** The first word of a display name, for greetings. */
export function firstName(name: string): string {
  return name.trim().split(/\s+/)[0] ?? name;
}

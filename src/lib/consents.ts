/**
 * Consents.
 *
 * The wording below is static UI copy. What is stored per person is an
 * append-only history in `consent_records`, each row carrying the version of the
 * wording they agreed to. Change CONSENT_VERSION whenever the meaning of a consent
 * changes: required consents are then asked for again.
 *
 * Have the wording reviewed by a qualified person before public launch
 * (docs/DECISIONS.md section 5, point 10).
 */
export const CONSENT_VERSION = '2026-10-12';

export type ConsentTypeName = 'TERMS' | 'HEALTH_DATA' | 'AI' | 'RESEARCH';

export type ConsentDefinition = {
  type: ConsentTypeName;
  /** Form field name. */
  field: 'terms' | 'healthData' | 'ai' | 'research';
  required: boolean;
  text: string;
};

export const consentDefinitions: readonly ConsentDefinition[] = [
  {
    type: 'TERMS',
    field: 'terms',
    required: true,
    text: 'I agree to the Terms of Use and Privacy Policy.',
  },
  {
    type: 'HEALTH_DATA',
    field: 'healthData',
    required: true,
    text: 'I consent to HerHealth storing and processing the health information I enter.',
  },
  {
    type: 'AI',
    field: 'ai',
    required: false,
    text: 'I would like AI-generated summaries and insights based on my data (optional).',
  },
  {
    type: 'RESEARCH',
    field: 'research',
    required: false,
    text: "Share de-identified data to help improve women's health research (optional).",
  },
];

export const requiredConsentTypes: readonly ConsentTypeName[] =
  consentDefinitions.filter((c) => c.required).map((c) => c.type);

export type ConsentRow = {
  type: ConsentTypeName;
  granted: boolean;
  version: string;
  createdAt: Date;
};

export type LatestConsents = Partial<
  Record<ConsentTypeName, { granted: boolean; version: string }>
>;

/** The newest row per consent type. */
export function latestConsents(rows: readonly ConsentRow[]): LatestConsents {
  const newest: Partial<Record<ConsentTypeName, ConsentRow>> = {};
  for (const row of rows) {
    const current = newest[row.type];
    if (!current || row.createdAt.getTime() > current.createdAt.getTime()) {
      newest[row.type] = row;
    }
  }
  const result: LatestConsents = {};
  for (const type of Object.keys(newest) as ConsentTypeName[]) {
    const row = newest[type];
    if (row) result[type] = { granted: row.granted, version: row.version };
  }
  return result;
}

/**
 * Required consents that are missing, withdrawn, or were given for an older
 * version of the wording.
 */
export function missingRequiredConsents(
  latest: LatestConsents,
  currentVersion: string = CONSENT_VERSION,
): ConsentTypeName[] {
  return requiredConsentTypes.filter((type) => {
    const entry = latest[type];
    return !entry || !entry.granted || entry.version !== currentVersion;
  });
}

/** Is an optional consent currently granted (for the current wording)? */
export function isConsentGranted(
  latest: LatestConsents,
  type: ConsentTypeName,
  currentVersion: string = CONSENT_VERSION,
): boolean {
  const entry = latest[type];
  return Boolean(entry && entry.granted && entry.version === currentVersion);
}

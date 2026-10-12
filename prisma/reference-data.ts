/**
 * Reference data: the symptoms a person can choose from.
 *
 * This is configuration, not user data. `prisma db seed` upserts it into the
 * `symptom_types` table, and the app reads it from there (GET /api/symptom-types).
 * The slug is the stable identifier; labels can be reworded without breaking
 * stored check-ins, which reference the row id.
 *
 * `other` lets a person name a symptom that is not in the list (stored as
 * `custom_label` on their own check-in, never added to this table).
 */
export type SymptomSeed = {
  slug: string;
  label: string;
  useInCheckIn: boolean;
  useInPeriods: boolean;
};

export const symptomSeeds: SymptomSeed[] = [
  { slug: 'headache', label: 'Headache', useInCheckIn: true, useInPeriods: true },
  { slug: 'cramps', label: 'Cramps', useInCheckIn: true, useInPeriods: true },
  { slug: 'fatigue', label: 'Fatigue', useInCheckIn: true, useInPeriods: true },
  { slug: 'bloating', label: 'Bloating', useInCheckIn: true, useInPeriods: true },
  { slug: 'nausea', label: 'Nausea', useInCheckIn: true, useInPeriods: false },
  { slug: 'back-pain', label: 'Back pain', useInCheckIn: true, useInPeriods: true },
  {
    slug: 'breast-tenderness',
    label: 'Breast tenderness',
    useInCheckIn: false,
    useInPeriods: true,
  },
  {
    slug: 'acne-skin-changes',
    label: 'Acne / skin changes',
    useInCheckIn: true,
    useInPeriods: true,
  },
  {
    slug: 'mood-changes',
    label: 'Mood changes',
    useInCheckIn: true,
    useInPeriods: true,
  },
  { slug: 'other', label: 'Other', useInCheckIn: true, useInPeriods: true },
];

/** Slug of the free-text symptom type. */
export const OTHER_SYMPTOM_SLUG = 'other';

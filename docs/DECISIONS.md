# HerHealth: Decisions (v1)

Status: **Locked for v1.** Changing a decision here means updating this file in
the same pull request as the code change.

## 1. Scope of v1

### In scope

| Area                    | What v1 delivers                                                                                                               |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Accounts                | Sign-up, login, logout, email verification, password reset, change password, sign out of other devices, 18+ age confirmation   |
| Consent                 | Required consents (terms, health-data processing) and optional ones (AI, de-identified research), stored with a version number |
| Daily check-in          | One check-in per day, editable: mood, energy, sleep (duration and quality), stress, symptoms with severity, note               |
| Health timeline         | A single history of check-ins, symptoms, periods, consultations, records and notes, with filters                               |
| Home dashboard          | Today's check-in status, streak, recent metrics, next appointment, latest insight, all computed from stored records            |
| Insights                | Trends and patterns computed in code from stored check-ins; plain-language wording only                                        |
| Periods (optional)      | The user can switch the module on or off. Period logs, cycle history and estimated next period                                 |
| Nutrition and lifestyle | Water, activity, goals and recommendations the user saves                                                                      |
| Health vault            | Upload, view, download and delete documents; AI extraction with a review screen before anything is saved                       |
| Consultations           | Log visits, notes and follow-ups; upcoming appointment on Home                                                                 |
| AI companion            | Ask, Analyze My Health, and Nutrition and Lifestyle Plan, plus a post-visit plan, all governed by `AI_SAFETY_RULES.md`         |
| Safety layer            | Server-side red-flag check, emergency screen, region-aware emergency numbers                                                   |
| Privacy controls        | Export all my data (JSON), delete all my data, delete my account, consent changes in Settings                                  |

### Out of scope for v1

- Push, email or SMS reminders and the notification bell. Both are removed from
  the UI in Phase 5 rather than left as buttons that do nothing.
- Two-factor authentication, theme and unit preferences. They are hidden until
  they work.
- Sharing records with a clinician, multiple profiles, partner or family access.
- Wearable or third-party health integrations.
- Pregnancy tracking and fertility or contraception predictions. Period
  predictions are labelled as estimates only.
- Native mobile apps. The web app gets a responsive layout in Phase 10.
- Field-level encryption of notes. See section 5.

### The rule for existing UI

Every control in the current design must end v1 in one of two states: working
against the real backend, or removed. Controls that only appear to work are not
allowed.

## 2. Scales

All rating scales are integers from 1 to 5. The database stores the integer. The
label shown on screen comes from one shared config file, never from the database.

| Field         | 1         | 2    | 3        | 4    | 5         | Higher means    |
| ------------- | --------- | ---- | -------- | ---- | --------- | --------------- |
| Mood          | Very low  | Low  | Okay     | Good | Great     | Better          |
| Energy        | Very low  | Low  | Moderate | Good | High      | More energy     |
| Sleep quality | Very poor | Poor | Okay     | Good | Great     | Better          |
| Stress        | Very low  | Low  | Moderate | High | Very high | **More stress** |

Notes:

- Stress is the only scale where a higher number is worse. Insight code must
  account for that direction and never average mixed scales together.
- The current UI uses energy 1 to 10 and four sleep-quality words. Both change to
  the 1 to 5 scales above in Phase 5.
- Sleep duration is stored as whole minutes (0 to 1440). It is a measurement, not
  a scale.
- Symptom severity stays a three-value enum (`MILD`, `MODERATE`, `SEVERE`), as in
  the design.
- Flow level for periods stays an enum (`NONE`, `SPOTTING`, `LIGHT`, `MEDIUM`,
  `HEAVY`).

## 3. Dates and time

- All timestamps are stored in UTC.
- A check-in belongs to a calendar date in the user's own time zone. The profile
  stores an IANA time zone name (for example `Asia/Kolkata`) detected at sign-up
  and editable in Settings.
- "Today" is always computed from the user's time zone and the real clock. The
  fixed demo date in `src/mock/today.ts` is removed.
- One check-in per user per date, enforced by a unique constraint.

## 4. Stack

| Concern      | Decision                                                  | Why                                                              |
| ------------ | --------------------------------------------------------- | ---------------------------------------------------------------- |
| Framework    | Next.js 16 App Router, React 19, TypeScript               | Already in the repo and verified                                 |
| Styling      | Tailwind v4 with an `@theme` block in CSS                 | v4 has no `tailwind.config.ts`; tokens live in CSS               |
| Database     | Supabase Postgres                                         | Managed Postgres with backups; named in the roadmap              |
| ORM          | Prisma 7 (`prisma-client` generator, `pg` driver adapter), migrations committed to git | Typed queries and versioned schema changes |
| Auth         | Supabase Auth, cookie-based sessions                      | Managed password hashing, email verification, reset and sessions |
| Validation   | zod on every API input                                    | One schema per route, shared with the client where useful        |
| File storage | Supabase Storage, private bucket, short-lived signed URLs | No public document URLs                                          |
| LLM          | Provider chosen in Phase 7 behind a single wrapper        | Keeps the provider replaceable                                   |
| Hosting      | Vercel                                                    | Named in the roadmap                                             |

To be verified when each phase starts, because this repo's Next.js version is newer
than most published guidance: Supabase's server-side auth package with Next.js 16,
and the renamed `proxy` file convention (see `AGENTS.md`).

## 5. Security and privacy decisions

1. **Server-side ownership checks are the primary control.** Every query filters
   by the signed-in user's id. No route trusts an id sent by the client.
2. **Row Level Security is enabled on every table with no policies.** Prisma
   connects with a privileged role that bypasses RLS, so this is a backstop. It
   blocks anyone who reaches the database through Supabase's public API with the
   public key.
3. **No public buckets.** Documents are only reachable through signed URLs issued
   after an ownership check.
4. **Encryption.** TLS in transit and provider encryption at rest. Field-level
   encryption of free-text notes was considered and deferred, because it adds key
   management and breaks search. This is a known limitation, to be revisited after
   v1.
5. **Minimum age is 18.** Sign-up requires confirming it.
6. **Data minimisation.** Collect only what a feature uses. No phone number, no
   address, no date of birth in v1.
7. **User control.** Export and permanent deletion are both self-service. Account
   deletion removes database rows, stored files and the auth user. Provider
   backup retention windows must be looked up and stated in the README in
   Phase 11. They have not been verified yet.
8. **Logging.** Logs hold event types, ids and timings. They never hold check-in
   content, notes, prompts, AI responses or document text.
9. **Rate limits** on login, sign-up, password reset, AI requests and uploads.
10. **Legal.** Health data is regulated in many places (for example India's DPDP
    Act, GDPR, HIPAA where it applies). This project makes privacy-by-design
    choices but is not legal advice. Have a qualified person review the privacy
    policy and terms before any public launch.

## 6. Launch region

- v1 targets users in India, matching the existing design and emergency numbers.
- Emergency numbers live in a reference config keyed by country code, each with a
  source and a last-verified date (Phase 6). Users in a country with no entry see
  a generic "contact your local emergency services" message and never a guessed
  number.
- Supabase project region: choose the one closest to users when creating the
  project in Phase 3.

## 7. Definition of done for any phase

A phase is finished only when `npm run verify` passes and the tests listed for
that phase pass. Anything not yet tested is reported as not tested.

## 8. Implementation notes

Decisions made while building, kept here so they are not rediscovered.

### Phase 3 (database)

- **Prisma 7 layout.** The connection URL is not in `schema.prisma`. Migrations use
  `DIRECT_URL` through `prisma.config.ts`; the running app uses the pooled
  `DATABASE_URL` through a `pg` driver adapter in `src/lib/prisma.ts`. The generated
  client lives in `src/generated/prisma` and is git-ignored (rebuilt by the
  `postinstall` script).
- **`profiles.id` is the Supabase Auth user id.** There is deliberately no foreign
  key to the `auth` schema: Prisma does not manage that schema and a cross-schema key
  shows up as drift in `migrate dev`. Account deletion removes rows explicitly
  (Phase 5), then the auth user.
- **Tables exist only for what has been built.** v1 tables for periods, nutrition,
  consultations, documents and AI messages are added by the phase that builds them,
  each with Row Level Security enabled in the same migration.
- **Reference data is seeded, not hardcoded in pages.** The symptom list lives in
  `prisma/reference-data.ts`, is upserted into `symptom_types`, and is read through
  the API. Free-text symptoms use the `other` type plus a `custom_label` on the
  person's own check-in.
- **Rate limiting is stored in Postgres** (`rate_limit_hits`, fixed windows), because
  in-memory counters do not work across serverless instances.
- **Hand-written migrations.** Raw SQL (RLS, CHECK constraints) lives in a separate
  migration from the generated one, so the generated one can be regenerated cleanly.

### Pages still on placeholder data

Replaced in the phase that owns them (see the roadmap): Insights (8), Companion
(7 and 8), Vault (8), Periods (9), Nutrition & Lifestyle (9), Consultation (9).


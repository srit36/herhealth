# HerHealth

A women-centred health tracking and wellness app: daily check-ins, symptom and
period tracking, a health timeline, a document vault, and an AI companion.

> **Status: under active development.** The interface is built and is being
> connected to a real database and authentication phase by phase. Pages that
> still read placeholder data from `src/mock/` are listed in `docs/DECISIONS.md`
> and are replaced in the phase that owns them. Do not use this build with real
> health information yet.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4, with design tokens in `src/styles/tokens.css`
- Fonts (DM Sans, Manrope) self-hosted through `@fontsource`, so no request is
  made to a third-party font service
- Vitest + Testing Library for tests
- ESLint + Prettier
- Prisma 7 with a `pg` driver adapter, against Supabase Postgres (Phase 3)

Planned in later phases: Supabase Auth, an LLM provider for the AI features, and
Vercel for deployment. See
`docs/DECISIONS.md` for the reasoning and `docs/AI_SAFETY_RULES.md` for the AI
rules.

## Getting started

Requires Node.js 20.19 or newer (22 LTS recommended).

```bash
npm install
cp .env.example .env.local   # then fill in values as phases require them
npm run dev                  # http://localhost:3000
```

## Database (Phase 3)

The schema is in `prisma/schema.prisma`; migrations are committed in
`prisma/migrations/` and applied, never edited, once they have been run anywhere.

### One-time setup

1. Create a Supabase project (choose the region closest to your users) and copy
   its two Postgres connection strings into `.env.local` as `DATABASE_URL`
   (pooled, port 6543) and `DIRECT_URL` (direct, port 5432). See `.env.example`.
2. Use Supabase's default `postgres` role for both strings. The app relies on a
   role that bypasses Row Level Security; a custom role without `BYPASSRLS` would
   read zero rows, because RLS is enabled on every table with no policies.
3. Install, apply the migrations and seed the reference data:

```bash
npm install            # also runs `prisma generate` (postinstall)
npm run db:deploy      # applies prisma/migrations to DIRECT_URL
npm run db:seed        # symptom list (reference data only)
```

### Changing the schema

```bash
# edit prisma/schema.prisma, then:
npm run db:migrate -- --name describe_the_change   # needs a shadow database
```

`migrate dev` needs a database it may create and drop a shadow database in. Run
it against a local Postgres rather than Supabase:

```bash
docker run --name herhealth-pg -e POSTGRES_PASSWORD=postgres -p 5433:5432 -d postgres:16
# .env.local for migration work only:
# DIRECT_URL=postgresql://postgres:postgres@localhost:5433/postgres
```

Commit the generated `prisma/migrations/<timestamp>_<name>/` folder, then run
`npm run db:deploy` against Supabase. Enable Row Level Security on every new table
in the same migration (`src/db/schema-guards.test.ts` fails if you forget).

### Demo data (development only)

`npm run db:seed:demo` can fill ONE existing account with 30 days of artificial
check-ins. It refuses to run in production and needs `ALLOW_DEMO_SEED=true` and
`DEMO_SEED_USER_ID`. See the header of `prisma/seed-demo.ts`.

## Scripts

| Command                | What it does                                                        |
| ---------------------- | ------------------------------------------------------------------- |
| `npm run dev`          | Start the dev server                                                |
| `npm run build`        | Production build                                                    |
| `npm run start`        | Serve the production build                                          |
| `npm run lint`         | ESLint                                                              |
| `npm run typecheck`    | TypeScript, no emit                                                 |
| `npm run test`         | Run all tests once                                                  |
| `npm run test:watch`   | Re-run tests as files change                                        |
| `npm run format`       | Format everything with Prettier                                     |
| `npm run format:check` | Check formatting without changing files                             |
| `npm run verify`       | Typecheck, lint, format check, tests and build (run before pushing) |
| `npm run db:deploy`    | Apply committed migrations to the database in `DIRECT_URL`          |
| `npm run db:migrate`   | Create and apply a new migration (development, needs a shadow DB)   |
| `npm run db:status`    | Show which migrations are applied                                   |
| `npm run db:seed`      | Seed reference data (symptom list)                                  |
| `npm run db:generate`  | Regenerate the Prisma client into `src/generated/` (git-ignored)    |

## Project layout

| Path                  | Purpose                                                           |
| --------------------- | ----------------------------------------------------------------- |
| `docs/`               | Decisions and AI safety rules                                     |
| `src/app/(app)/`      | Signed-in pages that share the sidebar and top bar                |
| `src/app/(auth)/`     | `/sign-up`, `/login`, `/consent` (no sidebar)                     |
| `src/app/(dev)/`      | Developer-only pages; `/design-system` is a 404 in production     |
| `src/app/globals.css` | The design's page-level CSS (to be split up as pages are rebuilt) |
| `src/styles/`         | `tokens.css`: colours, fonts, radii and shadows (single source)   |
| `prisma/`             | Schema, migrations, reference-data seed, dev-only demo seed       |
| `src/lib/prisma.ts`   | The one Prisma client (server only, created on first use)         |
| `src/generated/`      | Generated Prisma client. Git-ignored; rebuilt on `npm install`    |
| `src/components/ui/`  | Base components: Button, Card, StatTile, Badge and form fields    |
| `src/components/`     | Other shared UI (`AppShell`, `Icon`, `Toggle`, `companion/`)      |
| `src/lib/`            | Navigation, routes, helpers                                       |
| `src/mock/`           | Placeholder data and shared types, removed page by page           |

## Design system

- Colours, fonts, radii and shadows are defined once in `src/styles/tokens.css`.
  Tailwind turns them into utilities such as `bg-teal`, `text-muted`,
  `rounded-card` and `shadow-card`. The older CSS variables in `globals.css`
  (`--ink`, `--teal` ...) are aliases of those tokens.
- Build new UI from the components in `src/components/ui/`. Import them from
  `@/components/ui`.
- Run `npm run dev` and open `/design-system` to see every component.
- Element-level rules in `globals.css` (`button`, `h1`, `h2`, `p`) sit in the
  `base` cascade layer so Tailwind utilities such as `mt-4` can override them.
  Keep any new global element rules inside `@layer base`.
- `--color-faint` fails the WCAG AA contrast minimum for text. Use `text-muted`
  for new text.

## Notes for contributors

- `AGENTS.md` / `CLAUDE.md` are generated by Next.js and ask contributors (and AI
  tools) to read `node_modules/next/dist/docs/` before relying on memory of older
  Next.js versions. Keep them committed.
- Never commit `.env.local` or any real secret. Only `.env.example` is tracked.
- Line endings are LF (see `.gitattributes`).
- The layout is desktop-only for now (`body { min-width: 1180px }`); mobile
  layout is planned for the hardening phase.

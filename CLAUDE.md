# Weatherle — Project Notes

A daily weather-guessing game: you see a city's live weather and guess which city it is.
Wordle-style, one puzzle per day per difficulty. Personal project by Jacob Bruck (jpbruck23@gmail.com).

Last updated: 2026-10-20

---

## 1. Working agreements

These are standing rules, not suggestions.

- **Never commit or push without being told explicitly** ("commit and push it"). Leave changes
  uncommitted and say they're ready.
- **Test on production after pushing**, not just locally. Production has caught real bugs that
  local never showed (OAuth URL bug, stale cache).
- **Explain multi-file or schema changes in plain English first**, then wait for "go ahead."
- **Ask clarifying questions in plain chat**, not the AskUserQuestion picker — including in Plan Mode.
- **Be token-conscious.** Prefer the cheapest verification that actually proves the thing
  (typecheck, lint, grep) over spinning up headless browsers or other verbose tooling. If real
  browser verification is the only way, say so and let Jacob check hands-on. Ask before anything heavy.
- **Prefer behavior-only fixes over paint-order changes.** When two fixes solve the same overlap bug —
  one by reordering z-index/stacking, one by decoupling interaction (`pointer-events`, `:has()`,
  event routing) — take the interaction-only fix. The visual result must stay pixel-identical.

---

## 2. Stack and layout

React 19 + Vite 8 + TypeScript 6 + CSS Modules. No CSS framework, no state library.

```
src/
  App.tsx                 # root; wires hooks to components
  components/<Name>/      # each component owns a .tsx + .module.css
  hooks/                  # all game logic lives here
  data/                   # city pools (cities.ts is auto-generated)
  utils/                  # pure helpers + supabase client
  types/                  # city, game, stats, weather
scripts/
  build-cities.mjs                 # regenerates src/data/cities.ts from raw-cities.json
  check-daily-easter-egg.ts        # used by the daily easter-egg email workflow
  send-weekly-analytics-email.ts   # used by the weekly analytics workflow
supabase/schema.sql       # idempotent; paste into SQL Editor
public/CNAME              # playweatherle.com
```

Commands: `npm run dev` · `npm run build` (tsc -b && vite build) · `npm run lint` · `npm run preview`

There are no tests. Verification = `npm run build` (typecheck) + `npm run lint` + hands-on.

---

## 3. Deployment

- Built and deployed by **`.github/workflows/deploy.yml`** on every push to `main` (GitHub Pages).
- Serves from the **custom domain `playweatherle.com`** (`public/CNAME`), so `vite.config.ts` sets
  `base: '/'` — not `/Weatherle/`. Do not reintroduce a repo-name base path.
- `netlify.toml` exists with an SPA redirect, but GitHub Pages is the live path.
- Local dev: `http://localhost:5173/`.
- Build needs `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`; in CI they come from repo secrets,
  locally from `.env` (gitignored; see `.env.example`).

**Scheduled workflows** (both email jpbruck23@gmail.com via Gmail SMTP, secrets `GMAIL_ADDRESS` /
`GMAIL_APP_PASSWORD`):
- `easter-egg-email.yml` — 05:10 UTC daily, alerts when an easter-egg city is today's target.
- `weekly-analytics-email.yml` — 05:20 UTC Mondays, play counts from `weekly_mode_play_counts`.

---

## 4. Game rules

- **8 guesses max** (`MAX_GUESSES` in `src/hooks/useGameState.ts`).
- **Three difficulties**, pools in `src/hooks/useDifficulty.ts`:
  - Easy — 61 ids (`easyCities.ts`), globally famous cities
  - Medium — 156 ids (`mediumCities.ts`), capitals and major hubs
  - Hard — 538 = `CITIES` (402, auto-generated) + `GUESS_CITIES` (136), **seeded-shuffled**
    (`seededShuffle(..., 'hard-daily-v1')`)
- **Two modes**: Daily (one city per day per difficulty, Eastern time) and Unlimited.
- **Hints per guess** (`src/types/game.ts`, computed in `utils/compare.ts`): hemisphere, continent,
  country, vibe, population (comparison + magnitude), elevation (comparison + magnitude),
  direction, distance (km and miles).
- **Weather** comes from Open-Meteo: `https://api.open-meteo.com/v1/forecast` (`hooks/useWeather.ts`),
  with retry logic and a loading spinner.
- **25 achievements** in `utils/achievements.ts`, including tiered ones (Globe Trotter I–III,
  Hot Streak I–III, streak-100/365/500).

### Daily city selection

```
getDailyCity(pool, date) = pool[((daysSinceEpoch(date) % pool.length) + pool.length) % pool.length]
```

Fully deterministic per (pool, Eastern date) — `utils/dailyCity.ts`.

⚠️ **The hard pool's order shifts whenever cities are added**, because it's a seeded shuffle of the
combined list. So any "next date for city X" is invalidated by a city addition. **Always recompute
from the code** rather than trusting a previously recorded date.

### Easter eggs

`src/data/easterEggs.ts` — only `new-milford-us` (hometown) and `villanova-us` (college town),
both hard-pool only. They trigger a cracking-egg animation plus a custom win/lose message.
Last pushed: Villanova daily to 2026-09-03.

---

## 5. Supabase backend

- Project URL: `https://ypelcdpdhqvpvgybvgih.supabase.co`
- Anon/publishable key: `sb_publishable_9DaB1f1N9ldxnuPIDQhhcQ_VLm9UX87` (safe client-side; RLS enforces access)
- Schema: `supabase/schema.sql` — **idempotent** (`create table if not exists`, `drop policy if exists`
  before each create, `create or replace` for functions/views). Safe to re-run whole.
- Auth: Google OAuth. Signed-in users get stats saved to the DB; everyone gets localStorage stats.
- There is **no service_role usage anywhere** — even the weekly analytics script uses the anon key.

### Tables

| Table | Purpose | Client access |
|---|---|---|
| `profiles` | one row per auth user, auto-created by `handle_new_user()` trigger | own row only (select, update) |
| `game_results` | append-only, one row per finished round for signed-in users | own rows (select, insert) |
| `stats_summary` | per-user rollup, PK `(user_id, mode, difficulty)` | own rows (select, insert, update) |
| `daily_anon_results` | one anon daily play; PK `(date_string, difficulty, client_id)` | **none — RPC only** |
| `unlimited_anon_results` | one anon unlimited play; identity PK, intentionally **no** per-day uniqueness | **none — RPC only** |

### Functions (security definer, granted to `anon` + `authenticated`)

- `record_anon_daily_result(p_date_string, p_difficulty, p_won, p_guess_count, p_client_id)`
- `record_anon_unlimited_result(...same args...)`

Both validate server-side (date within 1 day of `current_date`, difficulty in set, guess_count 1–8).
The daily one does `on conflict do nothing`; the unlimited one always inserts.

### Views (granted SELECT to `anon` + `authenticated`)

- `daily_aggregate_stats` — unions `game_results` (daily) + `daily_anon_results` into
  players / winners / avg_guesses per (date_string, difficulty). Never exposes user_id or client_id.
- `weekly_mode_play_counts` — total rounds per (date_string, mode, difficulty) across all four
  sources. Unlimited `game_results` rows have no `date_string`, so they're bucketed by
  `created_at at time zone 'America/New_York'`.

### Design principle to preserve

Anonymous tables are **closed to direct client access on purpose**. All anon writes go through the
validated security-definer RPCs, and all anon reads come from the aggregate views. Don't "fix" a
permission error by granting the client direct table access.

### Known issues, already fixed — don't regress

- `sum(bigint)` returns `numeric` in Postgres, which clashed with `count(*) as players` (bigint).
  Fixed by casting: `sum(players)::bigint`.
- `useDailyAverage` waits **800 ms** before calling `getDailyAverage`, so the RPC write lands before
  the read. Without the delay the post-game banner showed stale numbers.

### ⚠️ Pending: Supabase Data API grant change (2026-10-30)

From Oct 30, Supabase stops auto-granting Data API access to **newly created** tables in `public`.
Existing tables keep their grants, so **the live project is unaffected** — but `schema.sql` is a
full-schema recreate script, so running it on a new project, a preview branch, or `supabase db reset`
after that date produces tables the client can't reach ("permission denied").

Fix is to add explicit grants to `schema.sql` alongside each table:

```sql
grant select, update          on public.profiles      to authenticated;
grant select, insert          on public.game_results  to authenticated;
grant select, insert, update  on public.stats_summary to authenticated;
-- daily_anon_results and unlimited_anon_results: intentionally NO grants.
-- Views and functions already have explicit grants in the file.
```

`anon` needs no table grants — anonymous access is entirely RPC + views.

---

## 6. Client-side storage

`localStorage` keys, all prefixed `weatherle:`

| Key | Holds |
|---|---|
| `weatherle:v` | schema/version marker |
| `weatherle:stats` | local stats + achievements (kept regardless of sign-in) |
| `weatherle:client-id` | random UUID for anon play dedupe (`getClientId()` in `utils/stats.ts`) |
| `weatherle:difficulty` | easy / medium / hard (default medium) |
| `weatherle:mode` | daily / unlimited |
| `weatherle:unit` | temperature unit |
| `weatherle:scheme` | color scheme |
| `weatherle:seen` | first-run / how-to-play seen flag |

When a **daily** game ends and the user is **not** signed in, `utils/stats.ts` calls the anon RPC so
the cross-player average includes them.

---

## 7. Gotchas

- `src/data/cities.ts` is **auto-generated** — never hand-edit. Change `scripts/raw-cities.json` and
  run `node scripts/build-cities.mjs`.
- Adding cities to the hard pool **reshuffles every future hard-mode daily**. Recompute easter-egg
  dates after any city addition.
- `base: '/'` in `vite.config.ts` is deliberate (custom domain). Changing it breaks asset paths.
- `.env` is gitignored; so is `.claude/`.
- SEO files live in `public/`: `sitemap.xml`, `robots.txt` (both reference `playweatherle.com`).
- `README.md` is the public-facing intro (what the game is, how to run it); this file is the
  deeper internal/agent notes — keep both in sync when either changes.

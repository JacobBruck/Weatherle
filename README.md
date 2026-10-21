# Weatherle

A daily weather-guessing game: you're shown a city's live weather, and you have to guess which
city it is. Wordle-style — one puzzle per day, three difficulties, eight guesses.

**Play it at [playweatherle.com](https://playweatherle.com)**

## How it works

- Each round shows the live weather (temperature, conditions, etc.) for a hidden target city.
- Guess a city; each guess returns hints comparing it to the target — hemisphere, continent,
  country, "vibe," population, elevation, direction, and distance.
- You get 8 guesses per round.
- **Daily mode** — one city per difficulty per day (same for everyone, resets at Eastern midnight).
- **Unlimited mode** — play as many rounds as you want, any time.
- Three difficulties: Easy (globally famous cities), Medium (capitals and major hubs), and Hard
  (500+ cities worldwide).
- Sign in with Google to save your stats and streaks across devices; your stats and achievements
  are tracked locally either way.

## Tech stack

- [React](https://react.dev/) 19 + [TypeScript](https://www.typescriptlang.org/) + [Vite](https://vite.dev/)
- CSS Modules for styling — no framework
- [Supabase](https://supabase.com/) for auth and cross-player stats
- Live weather from the [Open-Meteo](https://open-meteo.com/) API
- Deployed to GitHub Pages behind a custom domain

## Development

```bash
npm install
npm run dev       # start the dev server
npm run build     # typecheck + production build
npm run lint
npm run preview   # preview the production build locally
```

Copy `.env.example` to `.env` and fill in your own Supabase project's URL and anon key
(`supabase/schema.sql` sets up the required tables/policies). The app runs without a `.env` too —
you just won't get sign-in or cross-player stats.

## Project structure

```
src/
  components/   # one folder per component (.tsx + .module.css)
  hooks/        # game logic
  data/         # city pools
  utils/        # helpers + Supabase client
  types/
scripts/        # city-data build script, scheduled-email scripts
supabase/       # database schema
```

See `CLAUDE.md` for deeper implementation notes (city pool details, Supabase schema, deployment).

---

Built by [Jacob Bruck](mailto:jpbruck23@gmail.com).

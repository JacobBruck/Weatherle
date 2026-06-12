import type { AllStats, DifficultyStats } from '../types/stats';
import type { Difficulty } from '../hooks/useDifficulty';
import type { GameMode } from '../hooks/useGameMode';
import type { City } from '../types/city';
import type { GuessEntry } from '../hooks/useGameState';
import { vibesOf } from '../data/cityVibes';
import { elevationOf } from '../data/cityElevations';
import { supabase } from './supabaseClient';

const STORAGE_KEY = 'weatherle:stats';

export function blankStats(): DifficultyStats {
  return {
    gamesPlayed: 0,
    wins: 0,
    currentStreak: 0,
    bestStreak: 0,
    bestGuesses: null,
    guessDistribution: [0, 0, 0, 0, 0, 0, 0, 0],
    lastPlayedDate: null,
    continentsWon: [],
    countriesWon: [],
    vibesWon: [],
    wonHighElevation: false,
    wonLowElevation: false,
    wonMegacity: false,
    wonSmallTown: false,
    cumulativeDistanceKm: 0,
  };
}

function loadAll(): AllStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AllStats) : { daily: {}, unlimited: {} };
  } catch {
    return { daily: {}, unlimited: {} };
  }
}

function saveAll(stats: AllStats): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch {
    // localStorage unavailable (private browsing, quota, etc.) — stats just won't persist.
  }
}

export function getStats(mode: GameMode, difficulty: Difficulty): DifficultyStats {
  const all = loadAll();
  return { ...blankStats(), ...all[mode][difficulty] };
}

export function recordResult(
  mode: GameMode,
  difficulty: Difficulty,
  won: boolean,
  guessCount: number,
  dateString: string,
  targetCity: City,
  entries: GuessEntry[],
): void {
  const all = loadAll();
  if (!all[mode][difficulty]) all[mode][difficulty] = blankStats();
  const ds = { ...blankStats(), ...all[mode][difficulty] };
  all[mode][difficulty] = ds;

  // Prevent double-recording if the daily game was already saved (e.g. page reload)
  if (mode === 'daily' && ds.lastPlayedDate === dateString) return;

  ds.gamesPlayed++;
  ds.cumulativeDistanceKm += entries.reduce((sum, e) => sum + e.hint.distanceKm, 0);

  if (won) {
    ds.wins++;
    ds.guessDistribution[Math.min(guessCount - 1, 7)]++;
    if (ds.bestGuesses === null || guessCount < ds.bestGuesses) ds.bestGuesses = guessCount;
    if (!ds.continentsWon.includes(targetCity.continent)) ds.continentsWon.push(targetCity.continent);
    if (!ds.countriesWon.includes(targetCity.countryCode)) ds.countriesWon.push(targetCity.countryCode);
    for (const vibe of vibesOf(targetCity)) {
      if (!ds.vibesWon.includes(vibe)) ds.vibesWon.push(vibe);
    }
    const elevation = elevationOf(targetCity);
    if (elevation >= 2000) ds.wonHighElevation = true;
    if (elevation <= 10) ds.wonLowElevation = true;
    if (targetCity.population >= 10_000_000) ds.wonMegacity = true;
    if (targetCity.population < 50_000) ds.wonSmallTown = true;
  }

  if (mode === 'daily') {
    if (won) {
      if (ds.lastPlayedDate) {
        const daysDiff = Math.round(
          (new Date(dateString).getTime() - new Date(ds.lastPlayedDate).getTime()) / 86400000,
        );
        ds.currentStreak = daysDiff === 1 ? ds.currentStreak + 1 : 1;
      } else {
        ds.currentStreak = 1;
      }
      ds.bestStreak = Math.max(ds.bestStreak, ds.currentStreak);
    } else {
      ds.currentStreak = 0;
    }
    ds.lastPlayedDate = dateString;
  } else {
    // Unlimited mode: track consecutive round wins for the "Hot Streak" achievements.
    if (won) {
      ds.currentStreak++;
      ds.bestStreak = Math.max(ds.bestStreak, ds.currentStreak);
    } else {
      ds.currentStreak = 0;
    }
  }

  saveAll(all);
  void syncResultToSupabase(mode, difficulty, won, guessCount, dateString, targetCity, entries, ds);
}

/** Maps a local DifficultyStats record onto a stats_summary row shape. */
function toStatsSummaryRow(userId: string, mode: GameMode, difficulty: Difficulty, ds: DifficultyStats) {
  return {
    user_id: userId,
    mode,
    difficulty,
    games_played: ds.gamesPlayed,
    wins: ds.wins,
    current_streak: ds.currentStreak,
    best_streak: ds.bestStreak,
    best_guesses: ds.bestGuesses,
    guess_distribution: ds.guessDistribution,
    last_played_date: ds.lastPlayedDate,
    continents_won: ds.continentsWon,
    countries_won: ds.countriesWon,
    vibes_won: ds.vibesWon,
    won_high_elevation: ds.wonHighElevation,
    won_low_elevation: ds.wonLowElevation,
    won_megacity: ds.wonMegacity,
    won_small_town: ds.wonSmallTown,
    cumulative_distance_km: ds.cumulativeDistanceKm,
  };
}

/**
 * Best-effort sync to Supabase for signed-in users — appends a game_results
 * row and upserts the rolled-up stats_summary row. No-ops silently when
 * Supabase isn't configured or no one is signed in, leaving localStorage as
 * the source of truth either way.
 */
async function syncResultToSupabase(
  mode: GameMode,
  difficulty: Difficulty,
  won: boolean,
  guessCount: number,
  dateString: string,
  targetCity: City,
  entries: GuessEntry[],
  ds: DifficultyStats,
): Promise<void> {
  if (!supabase) return;
  const { data } = await supabase.auth.getSession();
  const userId = data.session?.user.id;
  if (!userId) return;

  const distanceThisRound = entries.reduce((sum, e) => sum + e.hint.distanceKm, 0);

  await Promise.all([
    supabase.from('game_results').insert({
      user_id: userId,
      mode,
      difficulty,
      date_string: mode === 'daily' ? dateString : null,
      city_id: targetCity.id,
      won,
      guess_count: guessCount,
      cumulative_distance_km: distanceThisRound,
    }),
    supabase.from('stats_summary').upsert(toStatsSummaryRow(userId, mode, difficulty, ds)),
  ]);
}

/**
 * One-time migration for newly signed-in users: if they have no stats_summary
 * rows yet, seed them from this device's localStorage totals. Safe to call on
 * every sign-in — it's a no-op once remote rows exist.
 */
export async function migrateLocalStatsToSupabase(userId: string): Promise<void> {
  if (!supabase) return;

  const { data: existing, error } = await supabase.from('stats_summary').select('mode').eq('user_id', userId).limit(1);
  if (error || (existing && existing.length > 0)) return;

  const all = loadAll();
  const rows = [];
  for (const mode of ['daily', 'unlimited'] as const) {
    for (const [difficulty, ds] of Object.entries(all[mode]) as [Difficulty, DifficultyStats][]) {
      if (ds.gamesPlayed === 0) continue;
      rows.push(toStatsSummaryRow(userId, mode, difficulty, { ...blankStats(), ...ds }));
    }
  }
  if (rows.length > 0) await supabase.from('stats_summary').upsert(rows);
}

export interface DailyAverage {
  players: number;
  winners: number;
  avgGuesses: number | null;
}

/**
 * Cross-player stats for a given daily puzzle, sourced from the
 * daily_aggregate_stats view. Returns null when Supabase isn't configured,
 * the query fails, or no results have been recorded for that puzzle yet.
 */
export async function getDailyAverage(dateString: string, difficulty: Difficulty): Promise<DailyAverage | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('daily_aggregate_stats')
    .select('players, winners, avg_guesses')
    .eq('date_string', dateString)
    .eq('difficulty', difficulty)
    .maybeSingle();

  if (error || !data) return null;
  return { players: data.players, winners: data.winners, avgGuesses: data.avg_guesses };
}

export function msUntilMidnightET(): number {
  const nowET = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }));
  const next = new Date(nowET);
  next.setHours(24, 0, 0, 0);
  return next.getTime() - nowET.getTime();
}

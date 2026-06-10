import type { AllStats, DifficultyStats } from '../types/stats';
import type { Difficulty } from '../hooks/useDifficulty';
import type { GameMode } from '../hooks/useGameMode';
import type { City } from '../types/city';
import type { GuessEntry } from '../hooks/useGameState';
import { vibesOf } from '../data/cityVibes';
import { elevationOf } from '../data/cityElevations';

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
  } catch {}
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
}

export function msUntilMidnightET(): number {
  const nowET = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }));
  const next = new Date(nowET);
  next.setHours(24, 0, 0, 0);
  return next.getTime() - nowET.getTime();
}

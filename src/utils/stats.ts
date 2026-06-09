import type { AllStats, DifficultyStats } from '../types/stats';
import type { Difficulty } from '../hooks/useDifficulty';
import type { GameMode } from '../hooks/useGameMode';

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
  return all[mode][difficulty] ?? blankStats();
}

export function recordResult(
  mode: GameMode,
  difficulty: Difficulty,
  won: boolean,
  guessCount: number,
  dateString: string,
): void {
  const all = loadAll();
  if (!all[mode][difficulty]) all[mode][difficulty] = blankStats();
  const ds = all[mode][difficulty];

  // Prevent double-recording if the daily game was already saved (e.g. page reload)
  if (mode === 'daily' && ds.lastPlayedDate === dateString) return;

  ds.gamesPlayed++;

  if (won) {
    ds.wins++;
    ds.guessDistribution[Math.min(guessCount - 1, 7)]++;
    if (ds.bestGuesses === null || guessCount < ds.bestGuesses) ds.bestGuesses = guessCount;
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
  }

  saveAll(all);
}

export function msUntilMidnightET(): number {
  const nowET = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }));
  const next = new Date(nowET);
  next.setHours(24, 0, 0, 0);
  return next.getTime() - nowET.getTime();
}

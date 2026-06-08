import { useEffect, useMemo, useState } from 'react';
import { CITIES } from '../data/cities';
import { GUESS_CITIES } from '../data/guessCities';
import type { City } from '../types/city';
import type { GameStatus, HintResult, PersistedDayState } from '../types/game';
import { compareCities } from '../utils/compare';
import { loadDayState, pruneOldDays, saveDayState } from '../utils/storage';

export const MAX_GUESSES = 8;

export interface GuessEntry {
  city: City;
  hint: HintResult;
}

export interface UseGameStateResult {
  entries: GuessEntry[];
  status: GameStatus;
  remainingGuesses: number;
  submitGuess: (city: City) => void;
  alreadyGuessed: boolean;
}

const cityById = new Map([...CITIES, ...GUESS_CITIES].map((c) => [c.id, c]));

function freshState(date: string, difficulty: string, targetCityId: string): PersistedDayState {
  return { date, difficulty, targetCityId, guessedCityIds: [], status: 'in-progress' };
}

function statusFor(guessedCount: number, won: boolean): GameStatus {
  if (won) return 'won';
  if (guessedCount >= MAX_GUESSES) return 'lost';
  return 'in-progress';
}

/**
 * Orchestrates guesses, win/loss detection, and localStorage persistence for "today".
 * Easy and Hard have different daily targets, so progress is tracked separately per
 * (date, difficulty) pair — switching pools mid-day resumes (or starts) that pool's own run.
 * Re-initializes whenever the target city, date, or difficulty changes.
 */
export function useGameState(targetCity: City, dateString: string, difficulty: string): UseGameStateResult {
  const [persisted, setPersisted] = useState<PersistedDayState>(() => {
    pruneOldDays(dateString);
    return hydrateOrInit(dateString, difficulty, targetCity.id);
  });

  // Re-sync when the day, difficulty, or target changes (daily reset / rollover / pool switch while tab is open).
  useEffect(() => {
    setPersisted((prev) => {
      if (prev.date === dateString && prev.difficulty === difficulty && prev.targetCityId === targetCity.id) return prev;
      pruneOldDays(dateString);
      return hydrateOrInit(dateString, difficulty, targetCity.id);
    });
  }, [dateString, difficulty, targetCity.id]);

  const entries = useMemo<GuessEntry[]>(
    () =>
      persisted.guessedCityIds
        .map((id) => cityById.get(id))
        .filter((c): c is City => c !== undefined)
        .map((city) => ({ city, hint: compareCities(city, targetCity) })),
    [persisted.guessedCityIds, targetCity],
  );

  function submitGuess(city: City) {
    if (persisted.status !== 'in-progress') return;
    if (persisted.guessedCityIds.includes(city.id)) return;

    const guessedCityIds = [...persisted.guessedCityIds, city.id];
    const won = city.id === targetCity.id;
    const next: PersistedDayState = {
      date: dateString,
      difficulty,
      targetCityId: targetCity.id,
      guessedCityIds,
      status: statusFor(guessedCityIds.length, won),
    };
    setPersisted(next);
    saveDayState(next);
  }

  return {
    entries,
    status: persisted.status,
    remainingGuesses: MAX_GUESSES - persisted.guessedCityIds.length,
    submitGuess,
    alreadyGuessed: persisted.guessedCityIds.length > 0,
  };
}

function hydrateOrInit(date: string, difficulty: string, targetCityId: string): PersistedDayState {
  const stored = loadDayState(date, difficulty);
  if (stored && stored.targetCityId === targetCityId) return stored;
  const fresh = freshState(date, difficulty, targetCityId);
  saveDayState(fresh);
  return fresh;
}

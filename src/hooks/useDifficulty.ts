import { useState } from 'react';
import { CITIES } from '../data/cities';
import { EASY_CITIES } from '../data/easyCities';
import { MEDIUM_CITIES } from '../data/mediumCities';
import { GUESS_CITIES } from '../data/guessCities';
import type { City } from '../types/city';

const HARD_CITIES: City[] = [...CITIES, ...GUESS_CITIES];

export type Difficulty = 'easy' | 'medium' | 'hard';

const STORAGE_KEY = 'weatherle:difficulty';

function readStoredDifficulty(): Difficulty {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === 'easy' || raw === 'medium' || raw === 'hard') return raw;
    return 'medium';
  } catch {
    return 'medium';
  }
}

/** The active city pool for a difficulty tier. */
export function citiesForDifficulty(difficulty: Difficulty): City[] {
  if (difficulty === 'easy') return EASY_CITIES;
  if (difficulty === 'medium') return MEDIUM_CITIES;
  return HARD_CITIES;
}

/** Persisted choice between the three city pool tiers. */
export function useDifficulty(): [Difficulty, (difficulty: Difficulty) => void] {
  const [difficulty, setDifficultyState] = useState<Difficulty>(readStoredDifficulty);

  function setDifficulty(next: Difficulty) {
    setDifficultyState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // localStorage unavailable — choice just won't persist across reloads.
    }
  }

  return [difficulty, setDifficulty];
}

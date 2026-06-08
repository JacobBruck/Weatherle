import { useState } from 'react';
import { CITIES } from '../data/cities';
import { EASY_CITIES } from '../data/easyCities';
import type { City } from '../types/city';

export type Difficulty = 'easy' | 'hard';

const STORAGE_KEY = 'weatherle:difficulty';

function readStoredDifficulty(): Difficulty {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw === 'easy' ? 'easy' : 'hard';
  } catch {
    return 'hard';
  }
}

/** The active city pool for a difficulty: ~100 famous cities (easy) vs. the full ~330-city set (hard). */
export function citiesForDifficulty(difficulty: Difficulty): City[] {
  return difficulty === 'easy' ? EASY_CITIES : CITIES;
}

/** Persisted choice between the easy (famous-cities) and hard (full dataset) city pools. */
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

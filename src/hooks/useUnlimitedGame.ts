import { useState } from 'react';
import type { City } from '../types/city';
import type { GameStatus } from '../types/game';
import { compareCities } from '../utils/compare';
import { MAX_GUESSES, type GuessEntry } from './useGameState';

function randomCity(cities: City[], excludeId?: string): City {
  const pool = excludeId ? cities.filter((c) => c.id !== excludeId) : cities;
  const candidates = pool.length > 0 ? pool : cities;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

export interface UseUnlimitedGameResult {
  city: City;
  /** Bumped on every new round — gives `useWeather` a fresh cache key per city draw. */
  roundId: number;
  entries: GuessEntry[];
  status: GameStatus;
  remainingGuesses: number;
  submitGuess: (city: City) => void;
  newRound: () => void;
}

/** Ephemeral practice mode: a fresh random city each round, no daily limit and nothing persisted. */
export function useUnlimitedGame(cities: City[]): UseUnlimitedGameResult {
  const [round, setRound] = useState(() => ({ city: randomCity(cities), id: 0 }));
  const [entries, setEntries] = useState<GuessEntry[]>([]);
  const [status, setStatus] = useState<GameStatus>('in-progress');

  function submitGuess(guess: City) {
    if (status !== 'in-progress') return;
    if (entries.some((entry) => entry.city.id === guess.id)) return;

    const hint = compareCities(guess, round.city);
    const nextEntries = [...entries, { city: guess, hint }];
    const won = guess.id === round.city.id;
    setEntries(nextEntries);
    setStatus(won ? 'won' : nextEntries.length >= MAX_GUESSES ? 'lost' : 'in-progress');
  }

  function newRound() {
    setRound((prev) => ({ city: randomCity(cities, prev.city.id), id: prev.id + 1 }));
    setEntries([]);
    setStatus('in-progress');
  }

  return {
    city: round.city,
    roundId: round.id,
    entries,
    status,
    remainingGuesses: MAX_GUESSES - entries.length,
    submitGuess,
    newRound,
  };
}

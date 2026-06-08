import { useState } from 'react';

export type GameMode = 'daily' | 'unlimited';

const STORAGE_KEY = 'weatherle:mode';

function readStoredMode(): GameMode {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw === 'unlimited' ? 'unlimited' : 'daily';
  } catch {
    return 'daily';
  }
}

/** Persisted choice between the daily challenge and unlimited practice mode. */
export function useGameMode(): [GameMode, (mode: GameMode) => void] {
  const [mode, setModeState] = useState<GameMode>(readStoredMode);

  function setMode(next: GameMode) {
    setModeState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // localStorage unavailable — choice just won't persist across reloads.
    }
  }

  return [mode, setMode];
}

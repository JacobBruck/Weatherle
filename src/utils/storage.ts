import type { PersistedDayState } from '../types/game';

const STORAGE_KEY = 'weatherle:v1';

interface PersistedRoot {
  /** Keyed by `${date}:${difficulty}` — Easy and Hard track separate daily progress. */
  [key: string]: PersistedDayState;
}

function keyFor(date: string, difficulty: string): string {
  return `${date}:${difficulty}`;
}

function readRoot(): PersistedRoot {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as PersistedRoot;
    return typeof parsed === 'object' && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

function writeRoot(root: PersistedRoot): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(root));
  } catch {
    // localStorage unavailable (private browsing, quota, etc.) — game still works, just won't persist.
  }
}

export function loadDayState(date: string, difficulty: string): PersistedDayState | null {
  return readRoot()[keyFor(date, difficulty)] ?? null;
}

export function saveDayState(state: PersistedDayState): void {
  const root = readRoot();
  root[keyFor(state.date, state.difficulty)] = state;
  writeRoot(root);
}

/** Drops any stored entries from days other than `currentDate` (across all difficulties), keeping localStorage small. */
export function pruneOldDays(currentDate: string): void {
  const root = readRoot();
  const pruned: PersistedRoot = {};
  for (const [key, state] of Object.entries(root)) {
    if (state.date === currentDate) pruned[key] = state;
  }
  if (Object.keys(pruned).length === Object.keys(root).length) return;
  writeRoot(pruned);
}

import type { PersistedDayState } from '../types/game';

const STORAGE_KEY = 'weatherle:v1';

interface PersistedRoot {
  [date: string]: PersistedDayState;
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

export function loadDayState(date: string): PersistedDayState | null {
  return readRoot()[date] ?? null;
}

export function saveDayState(state: PersistedDayState): void {
  const root = readRoot();
  root[state.date] = state;
  writeRoot(root);
}

/** Drops any stored days other than `currentDate`, keeping localStorage small. */
export function pruneOldDays(currentDate: string): void {
  const root = readRoot();
  const keys = Object.keys(root);
  if (keys.length <= 1 && keys[0] === currentDate) return;
  const pruned: PersistedRoot = {};
  if (root[currentDate]) pruned[currentDate] = root[currentDate];
  writeRoot(pruned);
}

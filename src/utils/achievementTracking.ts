import type { Difficulty } from '../hooks/useDifficulty';
import type { GameMode } from '../hooks/useGameMode';
import { getAchievements, type Achievement } from './achievements';

const STORAGE_KEY = 'weatherle:seenAchievements';
const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard'];
const MODES: GameMode[] = ['daily', 'unlimited'];

type SeenMap = Record<GameMode, Record<Difficulty, string[]>>;

function blankSeenMap(): SeenMap {
  return {
    daily: { easy: [], medium: [], hard: [] },
    unlimited: { easy: [], medium: [], hard: [] },
  };
}

function loadSeen(): { map: SeenMap; isFirstRun: boolean } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { map: { ...blankSeenMap(), ...JSON.parse(raw) }, isFirstRun: false };
  } catch {
    // localStorage unavailable — fall through to a fresh map.
  }
  return { map: blankSeenMap(), isFirstRun: true };
}

function saveSeen(map: SeenMap): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    // localStorage unavailable (private browsing, quota, etc.) — seen state just won't persist.
  }
}

/**
 * Returns achievements newly unlocked for (mode, difficulty) since the last call, and
 * records them as seen. The very first call ever seeds a baseline from existing progress
 * so achievements unlocked before this feature existed don't all pop at once.
 */
export function getNewlyUnlocked(mode: GameMode, difficulty: Difficulty): Achievement[] {
  const { map, isFirstRun } = loadSeen();

  if (isFirstRun) {
    for (const m of MODES) {
      for (const d of DIFFICULTIES) {
        map[m][d] = getAchievements(m, d).filter((a) => a.unlocked).map((a) => a.id);
      }
    }
    saveSeen(map);
    return [];
  }

  const achievements = getAchievements(mode, difficulty);
  const seen = new Set(map[mode][difficulty]);
  const newly = achievements.filter((a) => a.unlocked && !seen.has(a.id));
  if (newly.length > 0) {
    map[mode][difficulty] = achievements.filter((a) => a.unlocked).map((a) => a.id);
    saveSeen(map);
  }
  return newly;
}

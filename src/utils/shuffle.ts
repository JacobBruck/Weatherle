/** FNV-1a string hash — fast, deterministic, good distribution for seeded shuffling. */
function hashString(value: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

/**
 * Deterministically reorders `items` by a seeded hash of `keyOf(item)` — the same
 * seed always produces the same order (so every player sees the same sequence),
 * but the result doesn't follow the input array's own order. Used to break up
 * clustering when a daily-rotation pool is filtered from a master list whose
 * entries happen to be grouped (e.g. cities entered region-by-region), which
 * otherwise walks through several similar entries on consecutive days.
 */
export function seededShuffle<T>(items: T[], keyOf: (item: T) => string, seed: string): T[] {
  return [...items].sort((a, b) => hashString(keyOf(a) + seed) - hashString(keyOf(b) + seed));
}

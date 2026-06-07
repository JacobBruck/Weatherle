/** "YYYY-MM-DD" for the given date in UTC — the canonical "today" key for the game. */
export function getUTCDateString(d: Date = new Date()): string {
  return d.toISOString().slice(0, 10);
}

const EPOCH_MS = Date.UTC(2024, 0, 1);

/** Integer count of UTC calendar days since a fixed epoch — stable forever. */
export function daysSinceEpoch(d: Date = new Date()): number {
  const utcMidnight = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
  return Math.floor((utcMidnight - EPOCH_MS) / 86_400_000);
}

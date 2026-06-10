const EASTERN_TZ = 'America/New_York';
const EPOCH_MS = Date.UTC(2024, 0, 1);

interface DateParts {
  year: number;
  month: number;
  day: number;
}

function partsAsNumbers(parts: Intl.DateTimeFormatPart[]): Record<string, number> {
  return Object.fromEntries(parts.filter((p) => p.type !== 'literal').map((p) => [p.type, Number(p.value)]));
}

function easternDateParts(d: Date): DateParts {
  const lookup = partsAsNumbers(
    new Intl.DateTimeFormat('en-US', {
      timeZone: EASTERN_TZ,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).formatToParts(d),
  );
  return { year: lookup.year, month: lookup.month, day: lookup.day };
}

/** "YYYY-MM-DD" for the given instant in America/New_York — the canonical "today" key for the game. */
export function getEasternDateString(d: Date = new Date()): string {
  const { year, month, day } = easternDateParts(d);
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

/** Integer count of Eastern calendar days since a fixed epoch — stable forever. */
export function daysSinceEpoch(d: Date = new Date()): number {
  const { year, month, day } = easternDateParts(d);
  return Math.floor((Date.UTC(year, month - 1, day) - EPOCH_MS) / 86_400_000);
}

/** Stable 1-indexed puzzle number for a "YYYY-MM-DD" Eastern date string — for share text. */
export function puzzleNumberFromDateString(dateString: string): number {
  const [year, month, day] = dateString.split('-').map(Number);
  return Math.floor((Date.UTC(year, month - 1, day) - EPOCH_MS) / 86_400_000) + 1;
}

/** Minutes to add to UTC to get local time in `timeZone` at instant `d` (e.g. -240 for EDT). */
function timeZoneOffsetMinutes(d: Date, timeZone: string): number {
  const lookup = partsAsNumbers(
    new Intl.DateTimeFormat('en-US', {
      timeZone,
      hour12: false,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).formatToParts(d),
  );
  // Date.UTC normalizes overflow (e.g. an "hour: 24" midnight quirk), so this stays correct.
  const asUtcMs = Date.UTC(lookup.year, lookup.month - 1, lookup.day, lookup.hour, lookup.minute, lookup.second);
  return (asUtcMs - d.getTime()) / 60_000;
}

/** Milliseconds from `from` until the next America/New_York midnight (when the daily city changes). */
export function msUntilNextEasternMidnight(from: Date = new Date()): number {
  const { year, month, day } = easternDateParts(from);
  // Seed instant representing "tomorrow's date at UTC midnight" — close enough to the real
  // target to read the correct UTC offset for that date (US DST never flips at midnight local).
  const tomorrowSeedMs = Date.UTC(year, month - 1, day + 1);
  const offsetMinutes = timeZoneOffsetMinutes(new Date(tomorrowSeedMs), EASTERN_TZ);
  const nextMidnightUtcMs = tomorrowSeedMs - offsetMinutes * 60_000;
  return Math.max(0, nextMidnightUtcMs - from.getTime());
}

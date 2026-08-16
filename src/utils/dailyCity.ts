import type { City } from '../types/city';
import { daysSinceEpoch, getEasternDateString } from './dateSeed';

/**
 * One-off swaps applied on top of the algorithmic pick, keyed by Eastern date string.
 * Used to move a single city's daily date without reordering/reshuffling the pool
 * (which would shift every other date). Each entry swaps two dates' cities with each
 * other, so the displaced city lands on the date the override'd city vacated — no
 * other date is affected. No-ops for pools that don't contain the given city id.
 *
 * - Pushed villanova-us from its algorithmic date (2026-08-17) to 2026-09-03, swapping
 *   places with whatever was naturally scheduled for 2026-09-03 (salt-lake-city-us).
 */
const DAILY_CITY_OVERRIDES: Record<string, string> = {
  '2026-08-17': 'salt-lake-city-us',
  '2026-09-03': 'villanova-us',
};

/**
 * Deterministically picks "today's" target city from a frozen, ordered list.
 * Same Eastern (America/New_York) calendar date -> same city for every player, with no network/storage involved.
 * `cities` must never be reordered/reshuffled once shipped (append-only).
 */
export function getDailyCity(cities: City[], date: Date = new Date()): City {
  const overrideId = DAILY_CITY_OVERRIDES[getEasternDateString(date)];
  const overrideCity = overrideId ? cities.find((c) => c.id === overrideId) : undefined;
  if (overrideCity) return overrideCity;

  const offset = daysSinceEpoch(date);
  const index = ((offset % cities.length) + cities.length) % cities.length;
  return cities[index];
}

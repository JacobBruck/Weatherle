import type { City } from '../types/city';
import { daysSinceEpoch } from './dateSeed';

/**
 * Deterministically picks "today's" target city from a frozen, ordered list.
 * Same Eastern (America/New_York) calendar date -> same city for every player, with no network/storage involved.
 * `cities` must never be reordered/reshuffled once shipped (append-only).
 */
export function getDailyCity(cities: City[], date: Date = new Date()): City {
  const offset = daysSinceEpoch(date);
  const index = ((offset % cities.length) + cities.length) % cities.length;
  return cities[index];
}

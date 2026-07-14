import type { City } from '../types/city';

/** The "region" part of a city label — e.g. "TX, United States", or just "Japan" with no state. */
export function formatCityRegion(city: City): string {
  return city.stateCode ? `${city.stateCode}, ${city.country}` : city.country;
}

/** e.g. "Austin, TX, United States" for US cities with a stateCode, else "Tokyo, Japan". */
export function formatCityLabel(city: City): string {
  return `${city.name}, ${formatCityRegion(city)}`;
}

import { kmToMiles } from './geo';

export type TemperatureUnit = 'C' | 'F';

/** Open-Meteo always returns Celsius; convert for display when the user prefers Fahrenheit. */
export function formatTemperature(celsius: number, unit: TemperatureUnit): string {
  const value = unit === 'F' ? (celsius * 9) / 5 + 32 : celsius;
  return `${Math.round(value)}°`;
}

/**
 * Pairs the temperature unit with its conventional measurement system:
 * °F with miles/mph (US customary), °C with kilometers/km/h (metric).
 */
export function formatWindSpeed(kmh: number, unit: TemperatureUnit): string {
  return unit === 'F' ? `${Math.round(kmToMiles(kmh))} mph` : `${Math.round(kmh)} km/h`;
}

export function formatDistance(distanceKm: number, distanceMiles: number, unit: TemperatureUnit): string {
  return unit === 'F'
    ? `${Math.round(distanceMiles).toLocaleString()} mi`
    : `${Math.round(distanceKm).toLocaleString()} km`;
}

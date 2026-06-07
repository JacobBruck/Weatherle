export type TemperatureUnit = 'C' | 'F';

/** Open-Meteo always returns Celsius; convert for display when the user prefers Fahrenheit. */
export function formatTemperature(celsius: number, unit: TemperatureUnit): string {
  const value = unit === 'F' ? (celsius * 9) / 5 + 32 : celsius;
  return `${Math.round(value)}°`;
}

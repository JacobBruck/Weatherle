import { useState } from 'react';
import type { TemperatureUnit } from '../utils/temperature';

const STORAGE_KEY = 'weatherle:unit';

function readStoredUnit(): TemperatureUnit {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw === 'C' ? 'C' : 'F';
  } catch {
    return 'F';
  }
}

/** User's preferred temperature unit, persisted across sessions. */
export function useTemperatureUnit(): [TemperatureUnit, (unit: TemperatureUnit) => void] {
  const [unit, setUnit] = useState<TemperatureUnit>(readStoredUnit);

  function changeUnit(next: TemperatureUnit) {
    setUnit(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // localStorage unavailable — preference just won't persist across reloads.
    }
  }

  return [unit, changeUnit];
}

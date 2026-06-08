import { useEffect, useState } from 'react';
import { getDailyCity } from '../utils/dailyCity';
import { getEasternDateString } from '../utils/dateSeed';
import type { City } from '../types/city';

interface DailyCityState {
  city: City;
  dateString: string;
}

function computeState(cities: City[]): DailyCityState {
  const now = new Date();
  return { city: getDailyCity(cities, now), dateString: getEasternDateString(now) };
}

/**
 * Returns today's deterministic target city (picked from `cities`) plus its
 * America/New_York date key. The daily city changes at Eastern midnight.
 * Re-derives both if that calendar date changes while the tab stays open
 * (checked on a timer and on tab focus/visibility change).
 */
export function useDailyCity(cities: City[]): DailyCityState {
  const [state, setState] = useState<DailyCityState>(() => computeState(cities));

  useEffect(() => {
    const checkForRollover = () => {
      const next = computeState(cities);
      setState((prev) => (prev.dateString === next.dateString && prev.city.id === next.city.id ? prev : next));
    };

    checkForRollover();
    const interval = setInterval(checkForRollover, 30_000);
    document.addEventListener('visibilitychange', checkForRollover);
    window.addEventListener('focus', checkForRollover);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', checkForRollover);
      window.removeEventListener('focus', checkForRollover);
    };
  }, [cities]);

  return state;
}

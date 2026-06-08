import { useEffect, useMemo, useState } from 'react';
import { getDailyCity } from '../utils/dailyCity';
import { getEasternDateString } from '../utils/dateSeed';
import type { City } from '../types/city';

interface DailyCityState {
  city: City;
  dateString: string;
}

/**
 * Returns today's deterministic target city (picked from `cities`) plus its
 * America/New_York date key. The daily city changes at Eastern midnight.
 *
 * `referenceDate` only updates when the Eastern calendar date actually rolls
 * over (checked on a timer and on tab focus/visibility change) — not on every
 * check — so `{ city, dateString }` keeps a stable reference between rollovers
 * (useWeather depends on `city` by reference and shouldn't refetch every 30s).
 *
 * Deriving the result via useMemo (rather than a separate effect-driven state)
 * means a `cities` change — e.g. switching the Easy/Hard pool — produces the
 * new target SYNCHRONOUSLY, in the same render. That matters: useGameState
 * re-syncs off this city, and an async update would briefly expose a stale
 * target paired with the new difficulty, causing it to clobber the other
 * pool's saved daily progress.
 */
export function useDailyCity(cities: City[]): DailyCityState {
  const [referenceDate, setReferenceDate] = useState(() => new Date());

  useEffect(() => {
    const checkForRollover = () => {
      setReferenceDate((prev) => {
        const now = new Date();
        return getEasternDateString(prev) === getEasternDateString(now) ? prev : now;
      });
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
  }, []);

  return useMemo(
    () => ({ city: getDailyCity(cities, referenceDate), dateString: getEasternDateString(referenceDate) }),
    [cities, referenceDate],
  );
}

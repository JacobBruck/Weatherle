import { useEffect, useState } from 'react';
import { CITIES } from '../data/cities';
import { getDailyCity } from '../utils/dailyCity';
import { getUTCDateString } from '../utils/dateSeed';

interface DailyCityState {
  city: ReturnType<typeof getDailyCity>;
  dateString: string;
}

function computeState(): DailyCityState {
  const now = new Date();
  return { city: getDailyCity(CITIES, now), dateString: getUTCDateString(now) };
}

/**
 * Returns today's deterministic target city plus its UTC date key.
 * Re-derives both if the UTC calendar date changes while the tab stays open
 * (checked on a timer and on tab focus/visibility change).
 */
export function useDailyCity(): DailyCityState {
  const [state, setState] = useState<DailyCityState>(computeState);

  useEffect(() => {
    const checkForRollover = () => {
      const next = computeState();
      setState((prev) => (prev.dateString === next.dateString ? prev : next));
    };

    const interval = setInterval(checkForRollover, 30_000);
    document.addEventListener('visibilitychange', checkForRollover);
    window.addEventListener('focus', checkForRollover);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', checkForRollover);
      window.removeEventListener('focus', checkForRollover);
    };
  }, []);

  return state;
}

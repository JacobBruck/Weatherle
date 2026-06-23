import { useEffect, useState } from 'react';
import { getDailyAverage, type DailyAverage } from '../utils/stats';
import type { Difficulty } from './useDifficulty';

/**
 * Cross-player average guesses for a finished daily puzzle. Fetches lazily —
 * pass `enabled=false` until the round ends to avoid an unnecessary query.
 */
export function useDailyAverage(dateString: string, difficulty: Difficulty, enabled: boolean): DailyAverage | null {
  const [average, setAverage] = useState<DailyAverage | null>(null);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;
    // Small delay so the write from syncResultToSupabase lands before we read.
    const timer = setTimeout(() => {
      getDailyAverage(dateString, difficulty).then((result) => {
        if (!cancelled) setAverage(result);
      });
    }, 800);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [dateString, difficulty, enabled]);

  return average;
}

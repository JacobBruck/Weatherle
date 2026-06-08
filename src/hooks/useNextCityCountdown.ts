import { useEffect, useState } from 'react';
import { msUntilNextEasternMidnight } from '../utils/dateSeed';

function formatCountdown(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

/** Live "HH:MM:SS" countdown to the next Eastern midnight, when a new city appears. Ticks every second. */
export function useNextCityCountdown(): string {
  const [label, setLabel] = useState(() => formatCountdown(msUntilNextEasternMidnight()));

  useEffect(() => {
    const tick = () => setLabel(formatCountdown(msUntilNextEasternMidnight()));
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  return label;
}

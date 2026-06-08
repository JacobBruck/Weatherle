import type { City } from '../../types/city';
import type { HintResult } from '../../types/game';
import type { TemperatureUnit } from '../../utils/temperature';
import { HintRow } from '../HintRow/HintRow';
import styles from './GuessHistory.module.css';

interface GuessEntry {
  city: City;
  hint: HintResult;
}

interface GuessHistoryProps {
  entries: GuessEntry[];
  unit: TemperatureUnit;
}

export function GuessHistory({ entries, unit }: GuessHistoryProps) {
  if (entries.length === 0) return null;

  // Most recent guess on top, like Countryle's stacked guess rows.
  const reversed = [...entries].reverse();

  return (
    <ul className={styles.list} aria-label="Guess history">
      {reversed.map(({ city, hint }) => (
        <HintRow key={city.id} guess={city} hint={hint} unit={unit} />
      ))}
    </ul>
  );
}

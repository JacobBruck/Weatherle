import { VIBE_EMOJI, VIBE_LABELS } from '../../data/cityVibes';
import type { City } from '../../types/city';
import type { HintResult, PopulationComparison, PopulationMagnitude } from '../../types/game';
import { formatDistance, type TemperatureUnit } from '../../utils/temperature';
import styles from './HintRow.module.css';

interface HintRowProps {
  guess: City;
  hint: HintResult;
  unit: TemperatureUnit;
}

function matchClass(match: boolean): string {
  return match ? styles.chipMatch : styles.chipMismatch;
}

/** Population, direction and distance are relative measures — only worth highlighting green on an exact match. */
function correctClass(correct: boolean): string {
  return correct ? styles.chipMatch : '';
}

const POPULATION_LABELS: Record<PopulationComparison, Record<PopulationMagnitude, string>> = {
  'target-bigger': { 'same-tier': 'Slightly bigger ▲', close: 'Bigger ▲', far: 'Much bigger ▲▲' },
  'target-smaller': { 'same-tier': 'Slightly smaller ▼', close: 'Smaller ▼', far: 'Much smaller ▼▼' },
  equal: { 'same-tier': 'Same size', close: 'Same size', far: 'Same size' },
};

function populationLabel(hint: HintResult): string {
  if (hint.isCorrect) return 'Correct';
  return POPULATION_LABELS[hint.populationComparison][hint.populationMagnitude];
}

function formatPopulation(population: number): string {
  if (population >= 1_000_000) {
    return `${(population / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  }
  if (population >= 1_000) {
    return `${Math.round(population / 1000)}k`;
  }
  return `${population}`;
}

export function HintRow({ guess, hint, unit }: HintRowProps) {
  return (
    <li className={`glass ${styles.row}`}>
      <div className={styles.header}>
        <span>
          <span className={styles.cityName}>{guess.name}</span>{' '}
          <span className={styles.countryName}>{guess.country}</span>
        </span>
        {hint.isCorrect && <span className={styles.correctBadge}>🎯 Correct!</span>}
      </div>

      <div className={styles.chips}>
        <div className={`${styles.chip} ${matchClass(hint.hemisphereMatch)}`}>
          <span className={styles.chipLabel}>Hemisphere</span>
          <span className={styles.chipValue}>{hint.guessHemisphere === 'N' ? 'Northern' : 'Southern'}</span>
        </div>

        <div className={`${styles.chip} ${matchClass(hint.continentMatch)}`}>
          <span className={styles.chipLabel}>Continent</span>
          <span className={styles.chipValue}>{guess.continent}</span>
        </div>

        <div className={`${styles.chip} ${matchClass(hint.countryMatch)}`}>
          <span className={styles.chipLabel}>Country</span>
          <span className={styles.chipValue}>{guess.country}</span>
        </div>

        <div className={`${styles.chip} ${matchClass(hint.vibeMatch)}`}>
          <span className={styles.chipLabel}>Vibe</span>
          <span className={styles.chipValue}>
            <span aria-hidden="true">{VIBE_EMOJI[hint.guessVibe]}</span> {VIBE_LABELS[hint.guessVibe]}
          </span>
        </div>

        <div className={`${styles.chip} ${correctClass(hint.isCorrect)}`}>
          <span className={styles.chipLabel}>Population</span>
          <span className={styles.chipValue}>
            {formatPopulation(guess.population)} · {populationLabel(hint)}
          </span>
        </div>

        <div className={`${styles.chip} ${correctClass(hint.isCorrect)}`}>
          <span className={styles.chipLabel}>Direction to target</span>
          <span className={styles.chipValue}>
            {hint.isCorrect ? (
              '—'
            ) : (
              <>
                <span
                  className={styles.compassArrow}
                  style={{ transform: `rotate(${hint.bearingDeg}deg)` }}
                  aria-hidden="true"
                >
                  ↑
                </span>
                {hint.compassDirection}
              </>
            )}
          </span>
        </div>

        <div className={`${styles.chip} ${correctClass(hint.isCorrect)}`}>
          <span className={styles.chipLabel}>Distance</span>
          <span className={styles.chipValue}>
            {hint.isCorrect ? formatDistance(0, 0, unit) : formatDistance(hint.distanceKm, hint.distanceMiles, unit)}
          </span>
        </div>
      </div>
    </li>
  );
}

import type { City } from '../../types/city';
import type { HintResult, PopulationComparison, PopulationMagnitude } from '../../types/game';
import styles from './HintRow.module.css';

interface HintRowProps {
  guess: City;
  hint: HintResult;
}

function matchClass(match: boolean): string {
  return match ? styles.chipMatch : styles.chipMismatch;
}

const POPULATION_LABELS: Record<PopulationComparison, Record<PopulationMagnitude, string>> = {
  'target-bigger': { 'same-tier': 'Slightly bigger ▲', close: 'Bigger ▲', far: 'Much bigger ▲▲' },
  'target-smaller': { 'same-tier': 'Slightly smaller ▼', close: 'Smaller ▼', far: 'Much smaller ▼▼' },
  equal: { 'same-tier': 'Same size', close: 'Same size', far: 'Same size' },
};

function populationLabel(hint: HintResult): string {
  return POPULATION_LABELS[hint.populationComparison][hint.populationMagnitude];
}

export function HintRow({ guess, hint }: HintRowProps) {
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

        <div className={styles.chip}>
          <span className={styles.chipLabel}>Population</span>
          <span className={styles.chipValue}>{populationLabel(hint)}</span>
        </div>

        <div className={styles.chip}>
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

        <div className={styles.chip}>
          <span className={styles.chipLabel}>Distance</span>
          <span className={styles.chipValue}>
            {hint.isCorrect ? '0 km / 0 mi' : `${Math.round(hint.distanceKm).toLocaleString()} km / ${Math.round(hint.distanceMiles).toLocaleString()} mi`}
          </span>
        </div>
      </div>
    </li>
  );
}

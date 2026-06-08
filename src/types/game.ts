import type { CompassDirection, Hemisphere } from '../utils/geo';

export type PopulationComparison = 'target-bigger' | 'target-smaller' | 'equal';
export type PopulationMagnitude = 'same-tier' | 'close' | 'far';

export interface HintResult {
  guessedCityId: string;
  hemisphereMatch: boolean;
  guessHemisphere: Hemisphere;
  continentMatch: boolean;
  countryMatch: boolean;
  /** Describes the TARGET relative to the guess — drives an arrow telling the player which way to adjust. */
  populationComparison: PopulationComparison;
  populationMagnitude: PopulationMagnitude;
  distanceKm: number;
  distanceMiles: number;
  /** Compass bearing from the guessed city toward the target city. */
  bearingDeg: number;
  compassDirection: CompassDirection;
  isCorrect: boolean;
}

export type GameStatus = 'in-progress' | 'won' | 'lost';

export interface PersistedDayState {
  /** America/New_York "YYYY-MM-DD" — must match getEasternDateString() for the stored state to be valid. */
  date: string;
  targetCityId: string;
  guessedCityIds: string[];
  status: GameStatus;
}

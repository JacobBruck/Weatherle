import type { City } from '../types/city';
import type { HintResult, PopulationComparison, PopulationMagnitude } from '../types/game';
import { bearingToCompass, haversineKm, hemisphereOf, initialBearingDeg, kmToMiles } from './geo';

function populationComparisonOf(guess: City, target: City): PopulationComparison {
  if (target.population === guess.population) return 'equal';
  return target.population > guess.population ? 'target-bigger' : 'target-smaller';
}

/** Buckets how far apart two populations are, by ratio of larger to smaller. */
function populationMagnitudeOf(guess: City, target: City): PopulationMagnitude {
  const ratio = Math.max(guess.population, target.population) / Math.min(guess.population, target.population);
  if (ratio < 1.5) return 'same-tier';
  if (ratio < 4) return 'close';
  return 'far';
}

/** Builds the full hint comparison row for a single guess against the target city. */
export function compareCities(guess: City, target: City): HintResult {
  const distanceKm = haversineKm(guess.latitude, guess.longitude, target.latitude, target.longitude);
  const bearingDeg = initialBearingDeg(guess.latitude, guess.longitude, target.latitude, target.longitude);

  return {
    guessedCityId: guess.id,
    hemisphereMatch: hemisphereOf(guess.latitude) === hemisphereOf(target.latitude),
    guessHemisphere: hemisphereOf(guess.latitude),
    continentMatch: guess.continent === target.continent,
    countryMatch: guess.countryCode === target.countryCode,
    populationComparison: populationComparisonOf(guess, target),
    populationMagnitude: populationMagnitudeOf(guess, target),
    distanceKm,
    distanceMiles: kmToMiles(distanceKm),
    bearingDeg,
    compassDirection: bearingToCompass(bearingDeg),
    isCorrect: guess.id === target.id,
  };
}

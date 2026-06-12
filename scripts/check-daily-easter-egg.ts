// Run daily via .github/workflows/easter-egg-email.yml — checks whether
// today's daily-mode target city (for any difficulty pool) is one of the
// easter egg cities, using the same selection logic as the app.
import { appendFileSync } from 'node:fs';
import { CITIES } from '../src/data/cities';
import { EASY_CITIES } from '../src/data/easyCities';
import { MEDIUM_CITIES } from '../src/data/mediumCities';
import { GUESS_CITIES } from '../src/data/guessCities';
import { EASTER_EGG_CITY_IDS } from '../src/data/easterEggs';
import { getDailyCity } from '../src/utils/dailyCity';
import { getEasternDateString } from '../src/utils/dateSeed';
import type { City } from '../src/types/city';

const HARD_CITIES: City[] = [...CITIES, ...GUESS_CITIES];
const POOLS: Record<string, City[]> = { easy: EASY_CITIES, medium: MEDIUM_CITIES, hard: HARD_CITIES };

const dateString = getEasternDateString();
const matches: string[] = [];

for (const [difficulty, pool] of Object.entries(POOLS)) {
  const city = getDailyCity(pool);
  if (EASTER_EGG_CITY_IDS.has(city.id)) {
    matches.push(`${difficulty}: ${city.name}, ${city.country}`);
  }
}

console.log(`Eastern date: ${dateString}`);
console.log(matches.length > 0 ? `Easter egg active:\n${matches.join('\n')}` : 'No easter egg today.');

const output = process.env.GITHUB_OUTPUT;
if (output) {
  appendFileSync(output, `matched=${matches.length > 0}\n`);
  appendFileSync(output, `summary<<EOF\nWeatherle's daily puzzle for ${dateString} includes an easter egg city:\n${matches.join('\n')}\nEOF\n`);
}

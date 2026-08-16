// Run daily via .github/workflows/easter-egg-email.yml — checks whether
// today's daily-mode target city (for any difficulty pool) is one of the
// easter egg cities, using the same selection logic as the app.
import { appendFileSync } from 'node:fs';
import { citiesForDifficulty, type Difficulty } from '../src/hooks/useDifficulty';
import { EASTER_EGG_CITY_IDS } from '../src/data/easterEggs';
import { getDailyCity } from '../src/utils/dailyCity';
import { getEasternDateString } from '../src/utils/dateSeed';

const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard'];

const dateString = getEasternDateString();
const matches: string[] = [];

for (const difficulty of DIFFICULTIES) {
  const city = getDailyCity(citiesForDifficulty(difficulty));
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

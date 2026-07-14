// One-off generator: reads scripts/raw-cities.json (top 300 cities by population
// from kevinroberts/city-timezones, plus ~32 hand-picked cities famous for historic
// landmarks) and emits src/data/cities.ts as a typed, static array.
//
// Run with: node scripts/build-cities.mjs

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const raw = JSON.parse(readFileSync(join(__dirname, 'raw-cities.json'), 'utf-8'));

// Full US state name (as it appears in raw-cities.json's "province" field) -> USPS abbreviation.
// Kept in sync with src/data/usStates.ts.
const US_STATE_ABBREVIATIONS = {
  Alabama: 'AL', Alaska: 'AK', Arizona: 'AZ', Arkansas: 'AR', California: 'CA',
  Colorado: 'CO', Connecticut: 'CT', Delaware: 'DE', Florida: 'FL', Georgia: 'GA',
  Hawaii: 'HI', Idaho: 'ID', Illinois: 'IL', Indiana: 'IN', Iowa: 'IA',
  Kansas: 'KS', Kentucky: 'KY', Louisiana: 'LA', Maine: 'ME', Maryland: 'MD',
  Massachusetts: 'MA', Michigan: 'MI', Minnesota: 'MN', Mississippi: 'MS', Missouri: 'MO',
  Montana: 'MT', Nebraska: 'NE', Nevada: 'NV', 'New Hampshire': 'NH', 'New Jersey': 'NJ',
  'New Mexico': 'NM', 'New York': 'NY', 'North Carolina': 'NC', 'North Dakota': 'ND', Ohio: 'OH',
  Oklahoma: 'OK', Oregon: 'OR', Pennsylvania: 'PA', 'Rhode Island': 'RI', 'South Carolina': 'SC',
  'South Dakota': 'SD', Tennessee: 'TN', Texas: 'TX', Utah: 'UT', Vermont: 'VT',
  Virginia: 'VA', Washington: 'WA', 'West Virginia': 'WV', Wisconsin: 'WI', Wyoming: 'WY',
};

const COUNTRY_NAME_OVERRIDES = {
  'United States of America': 'United States',
  'Hong Kong S.A.R.': 'Hong Kong',
  'Congo (Kinshasa)': 'DR Congo',
  'Congo (Brazzaville)': 'Republic of the Congo',
};

// ISO 3166-1 alpha-2 -> continent, for every country code present in raw-cities.json.
// Russia is handled specially below (transcontinental: split by longitude).
const CONTINENT_BY_COUNTRY = {
  AF: 'Asia', AO: 'Africa', AR: 'South America', AT: 'Europe', AU: 'Oceania',
  AZ: 'Asia', BD: 'Asia', BE: 'Europe', BO: 'South America', BR: 'South America',
  BY: 'Europe', CA: 'North America', CD: 'Africa', CG: 'Africa', CI: 'Africa',
  CL: 'South America', CM: 'Africa', CN: 'Asia', CO: 'South America', CU: 'North America',
  DE: 'Europe', DO: 'North America', DZ: 'Africa', EC: 'South America', EG: 'Africa',
  ES: 'Europe', ET: 'Africa', FR: 'Europe', GB: 'Europe', GH: 'Africa', GN: 'Africa',
  GR: 'Europe', GT: 'North America', HK: 'Asia', HR: 'Europe', HT: 'North America',
  HU: 'Europe', ID: 'Asia', IL: 'Asia', IN: 'Asia', IQ: 'Asia', IR: 'Asia', IT: 'Europe',
  JO: 'Asia', JP: 'Asia', KE: 'Africa', KH: 'Asia', KP: 'Asia', KR: 'Asia', LB: 'Asia',
  MA: 'Africa', MG: 'Africa', ML: 'Africa', MM: 'Asia', MX: 'North America', MY: 'Asia',
  MZ: 'Africa', NG: 'Africa', NP: 'Asia', PE: 'South America', PH: 'Asia', PK: 'Asia',
  PL: 'Europe', PR: 'North America', PT: 'Europe', RO: 'Europe',
  SA: 'Asia', SD: 'Africa', SG: 'Asia', SN: 'Africa', SY: 'Asia', TH: 'Asia',
  TN: 'Africa', TR: 'Asia', TW: 'Asia', TZ: 'Africa', UA: 'Europe', UG: 'Africa',
  US: 'North America', UZ: 'Asia', VE: 'South America', VN: 'Asia', YE: 'Asia',
  ZA: 'Africa', ZM: 'Africa', ZW: 'Africa',
};

function continentFor(countryCode, longitude) {
  if (countryCode === 'RU') {
    // Russia straddles Europe/Asia; split roughly along the Ural Mountains (~60°E).
    return longitude < 60 ? 'Europe' : 'Asia';
  }
  const continent = CONTINENT_BY_COUNTRY[countryCode];
  if (!continent) throw new Error(`No continent mapping for country code ${countryCode}`);
  return continent;
}

function slugify(name, countryCode) {
  const base = name
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '') // strip accents
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `${base}-${countryCode.toLowerCase()}`;
}

// Skip compound names like "Washington, D.C." — they already read fine as-is, and a
// stateCode would double up on the existing comma ("Washington, D.C., DC, United States").
function stateCodeFor(c) {
  if (c.iso2 !== 'US' || c.city.includes(',')) return undefined;
  return US_STATE_ABBREVIATIONS[c.province];
}

const cities = raw.map((c) => ({
  id: slugify(c.city, c.iso2),
  name: c.city,
  country: COUNTRY_NAME_OVERRIDES[c.country] ?? c.country,
  countryCode: c.iso2,
  ...(stateCodeFor(c) ? { stateCode: stateCodeFor(c) } : {}),
  continent: continentFor(c.iso2, c.lng),
  latitude: Math.round(c.lat * 10000) / 10000,
  longitude: Math.round(c.lng * 10000) / 10000,
  population: Math.round(c.pop),
  timezone: c.timezone,
}));

// Sort alphabetically by name for autocomplete UX. Order is frozen at build time —
// the daily-city algorithm indexes into this array by a stable date-derived offset,
// so this array must never be reordered/reshuffled once shipped (append-only).
cities.sort((a, b) => a.name.localeCompare(b.name) || a.country.localeCompare(b.country));

const ids = new Set();
for (const c of cities) {
  if (ids.has(c.id)) throw new Error(`Duplicate city id: ${c.id}`);
  ids.add(c.id);
}

const header = `// AUTO-GENERATED by scripts/build-cities.mjs — do not edit by hand.
// Source: top ${raw.length - 32} cities by population (kevinroberts/city-timezones dataset,
// derived from SimpleMaps World Cities) plus ~32 cities chosen for famous historic landmarks.
// Regenerate with: node scripts/build-cities.mjs

import type { City } from '../types/city';

export const CITIES: City[] = `;

const body = JSON.stringify(cities, null, 2)
  // Drop quotes around object keys for nicer TS formatting (valid JS/TS either way).
  .replace(/"(\w+)":/g, '$1:');

writeFileSync(join(__dirname, '..', 'src', 'data', 'cities.ts'), header + body + ';\n');

console.log(`Wrote ${cities.length} cities to src/data/cities.ts`);

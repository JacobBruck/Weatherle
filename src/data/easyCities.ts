import { CITIES } from './cities';
import type { City } from '../types/city';
import { seededShuffle } from '../utils/shuffle';

/**
 * The ~60 cities virtually anyone in the world recognises by name —
 * used for the Easy difficulty tier. IDs reference entries in CITIES.
 */
const EASY_CITY_IDS = new Set([
  // Europe
  'paris-fr', 'london-gb', 'rome-it', 'barcelona-es', 'amsterdam-nl',
  'berlin-de', 'madrid-es', 'vienna-at', 'prague-cz', 'budapest-hu',
  'lisbon-pt', 'florence-it', 'venice-it', 'edinburgh-gb', 'munich-de',
  'copenhagen-dk', 'athens-gr', 'dublin-ie', 'milan-it',

  // Asia / Middle East
  'tokyo-jp', 'beijing-cn', 'shanghai-cn', 'hong-kong-hk', 'singapore-sg',
  'bangkok-th', 'seoul-kr', 'istanbul-tr', 'dubai-ae', 'mumbai-in',
  'delhi-in', 'kyoto-jp', 'jerusalem-il', 'kuala-lumpur-my', 'hanoi-vn',
  'taipei-tw',

  // Americas
  'new-york-us', 'los-angeles-us', 'miami-us', 'chicago-us', 'san-francisco-us',
  'toronto-ca', 'vancouver-ca', 'montreal-ca', 'mexico-city-mx', 'cancun-mx',
  'rio-de-janeiro-br', 'buenos-aires-ar', 'sao-paulo-br', 'boston-us',
  'washington-d-c-us', 'seattle-us',

  // Africa
  'cairo-eg', 'casablanca-ma', 'marrakesh-ma', 'cape-town-za', 'nairobi-ke',
  'johannesburg-za', 'lagos-ng',

  // Oceania
  'sydney-au',

  // Other
  'moscow-ru', 'havana-cu',
]);

// See MEDIUM_CITIES in mediumCities.ts for why this is shuffled rather than filtered directly.
export const EASY_CITIES: City[] = seededShuffle(
  CITIES.filter((city) => EASY_CITY_IDS.has(city.id)),
  (city) => city.id,
  'easy-daily-v1',
);

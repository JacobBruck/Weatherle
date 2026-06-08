import { CITIES } from './cities';
import type { City } from '../types/city';

/**
 * The ~150 cities a casual player worldwide is most likely to recognize by name —
 * national capitals, iconic global hubs, and famous historic/landmark destinations.
 * IDs reference entries in CITIES (kept in sync manually; order doesn't matter).
 */
const EASY_CITY_IDS = new Set([
  'london-gb', 'paris-fr', 'tokyo-jp', 'new-york-us', 'beijing-cn', 'moscow-ru', 'rome-it', 'berlin-de',
  'madrid-es', 'washington-d-c-us', 'cairo-eg', 'istanbul-tr', 'mumbai-in', 'delhi-in', 'sydney-au',
  'los-angeles-us', 'chicago-us', 'toronto-ca', 'mexico-city-mx', 'sao-paulo-br', 'rio-de-janeiro-br',
  'buenos-aires-ar', 'hong-kong-hk', 'singapore-sg', 'seoul-kr', 'bangkok-th', 'vienna-at', 'athens-gr',
  'lisbon-pt', 'barcelona-es', 'venice-it', 'florence-it', 'naples-it', 'milan-it', 'munich-de',
  'frankfurt-de', 'hamburg-de', 'brussels-be', 'budapest-hu', 'warsaw-pl', 'krakow-pl', 'bucharest-ro',
  'kyiv-ua', 'st-petersburg-ru', 'edinburgh-gb', 'manchester-gb', 'dubrovnik-hr', 'jerusalem-il',
  'tel-aviv-yafo-il', 'beirut-lb', 'baghdad-iq', 'tehran-ir', 'riyadh-sa', 'kabul-af',
  'dhaka-bd', 'hanoi-vn', 'ho-chi-minh-city-vn',
  'kuala-lumpur-my', 'jakarta-id', 'manila-ph', 'taipei-tw', 'osaka-jp', 'kyoto-jp', 'shanghai-cn',
  'guangzhou-cn', 'chengdu-cn', 'wuhan-cn', 'pyongyang-kp', 'hiroshima-jp',
  'nairobi-ke', 'addis-ababa-et', 'lagos-ng', 'johannesburg-za', 'cape-town-za',
  'casablanca-ma', 'marrakesh-ma', 'algiers-dz', 'tunis-tn', 'accra-gh', 'dakar-sn',
  'havana-cu', 'bogota-co', 'lima-pe', 'santiago-cl', 'caracas-ve', 'quito-ec', 'cusco-pe',
  'brasilia-br', 'guadalajara-mx', 'miami-us',

  // Popular holiday/vacation destinations — globally recognizable resort towns.
  'cancun-mx', 'punta-cana-do', 'honolulu-us', 'phuket-th', 'denpasar-id', 'ibiza-es',
  'santorini-gr', 'mykonos-gr', 'nassau-bs', 'cabo-san-lucas-mx',
  'acapulco-mx', 'zanzibar-city-tz', 'palma-de-mallorca-es',
  'capri-it', 'tulum-mx', 'antalya-tr',

  // Add/remove pass #2 — South America.
  'medellin-co', 'montevideo-uy', 'la-paz-bo', 'asuncion-py',

  // Add/remove pass #2 — Oceania.
  'melbourne-au', 'wellington-nz', 'brisbane-au', 'perth-au',

  // Add/remove pass #2 — North America.
  'san-francisco-us', 'seattle-us', 'minneapolis-us', 'dallas-us', 'boston-us', 'philadelphia-us',
  'new-orleans-us', 'atlanta-us', 'nashville-us', 'columbus-us', 'detroit-us', 'las-vegas-us',
  'san-diego-us', 'montreal-ca', 'vancouver-ca',

  // Add/remove pass #2 — Europe.
  'amsterdam-nl', 'prague-cz', 'dublin-ie', 'copenhagen-dk', 'stockholm-se', 'oslo-no',
  'seville-es', 'valencia-es', 'porto-pt',
  'zurich-ch', 'marseille-fr', 'liverpool-gb', 'reykjavik-is', 'split-hr',

  // Add/remove pass #2 — Asia.
  'baku-az', 'doha-qa', 'abu-dhabi-ae', 'dubai-ae', 'phnom-penh-kh', 'tbilisi-ge', 'busan-kr',
  'ulaanbaatar-mn',

  // Add/remove pass #2 — Africa.
  'alexandria-eg', 'tripoli-ly', 'kampala-ug', 'pretoria-za', 'abuja-ng',
]);

export const EASY_CITIES: City[] = CITIES.filter((city) => EASY_CITY_IDS.has(city.id));

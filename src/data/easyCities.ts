import { CITIES } from './cities';
import type { City } from '../types/city';

/**
 * The ~100 cities a casual player worldwide is most likely to recognize by name —
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
  'tel-aviv-yafo-il', 'beirut-lb', 'baghdad-iq', 'tehran-ir', 'riyadh-sa', 'makkah-sa', 'kabul-af',
  'karachi-pk', 'lahore-pk', 'kathmandu-np', 'dhaka-bd', 'rangoon-mm', 'hanoi-vn', 'ho-chi-minh-city-vn',
  'kuala-lumpur-my', 'jakarta-id', 'manila-ph', 'taipei-tw', 'osaka-jp', 'kyoto-jp', 'shanghai-cn',
  'guangzhou-cn', 'shenzhen-cn', 'chengdu-cn', 'xian-cn', 'wuhan-cn', 'pyongyang-kp', 'hiroshima-jp',
  'nairobi-ke', 'addis-ababa-et', 'lagos-ng', 'kinshasa-cd', 'johannesburg-za', 'cape-town-za',
  'casablanca-ma', 'marrakesh-ma', 'algiers-dz', 'tunis-tn', 'luxor-eg', 'accra-gh', 'dakar-sn',
  'siem-reap-kh', 'havana-cu', 'bogota-co', 'lima-pe', 'santiago-cl', 'caracas-ve', 'quito-ec', 'cusco-pe',
  'brasilia-br', 'salvador-br', 'guadalajara-mx', 'miami-us',

  // Popular holiday/vacation destinations — globally recognizable resort towns.
  'cancun-mx', 'punta-cana-do', 'honolulu-us', 'phuket-th', 'denpasar-id', 'ibiza-es',
  'santorini-gr', 'mykonos-gr', 'male-mv', 'nassau-bs', 'montego-bay-jm', 'cabo-san-lucas-mx',
  'acapulco-mx', 'zanzibar-city-tz', 'victoria-sc', 'suva-fj', 'bridgetown-bb', 'oranjestad-aw',
  'panaji-in', 'gold-coast-au', 'cannes-fr', 'nice-fr', 'marbella-es', 'palma-de-mallorca-es',
  'positano-it', 'capri-it', 'hvar-hr', 'queenstown-nz', 'papeete-pf', 'cartagena-co', 'tulum-mx',
  'phu-quoc-vn', 'boracay-ph', 'saint-tropez-fr', 'sharm-el-sheikh-eg', 'antalya-tr',
]);

export const EASY_CITIES: City[] = CITIES.filter((city) => EASY_CITY_IDS.has(city.id));

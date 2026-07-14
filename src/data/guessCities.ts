import type { City } from '../types/city';

/**
 * Additional well-known cities that extend the Hard mode pool (and the autocomplete)
 * from ~400 to ~500 cities. Easy and Medium pools are unchanged. These are combined
 * with CITIES in useDifficulty (hard tier) and in the App guessableCities list.
 */
export const GUESS_CITIES: City[] = [
  // ── Baltic & Northern Europe ─────────────────────────────────────────────
  { id: 'tallinn-ee', name: 'Tallinn', country: 'Estonia', countryCode: 'EE', continent: 'Europe', latitude: 59.437, longitude: 24.7536, population: 440000, timezone: 'Europe/Tallinn' },
  { id: 'riga-lv', name: 'Riga', country: 'Latvia', countryCode: 'LV', continent: 'Europe', latitude: 56.9496, longitude: 24.1052, population: 630000, timezone: 'Europe/Riga' },
  { id: 'vilnius-lt', name: 'Vilnius', country: 'Lithuania', countryCode: 'LT', continent: 'Europe', latitude: 54.6872, longitude: 25.2797, population: 580000, timezone: 'Europe/Vilnius' },
  { id: 'helsinki-fi', name: 'Helsinki', country: 'Finland', countryCode: 'FI', continent: 'Europe', latitude: 60.1699, longitude: 24.9384, population: 650000, timezone: 'Europe/Helsinki' },
  // ── Switzerland ──────────────────────────────────────────────────────────
  { id: 'bern-ch', name: 'Bern', country: 'Switzerland', countryCode: 'CH', continent: 'Europe', latitude: 46.948, longitude: 7.4474, population: 133000, timezone: 'Europe/Zurich' },
  { id: 'geneva-ch', name: 'Geneva', country: 'Switzerland', countryCode: 'CH', continent: 'Europe', latitude: 46.2022, longitude: 6.1457, population: 200000, timezone: 'Europe/Zurich' },
  // ── France ───────────────────────────────────────────────────────────────
  { id: 'lyon-fr', name: 'Lyon', country: 'France', countryCode: 'FR', continent: 'Europe', latitude: 45.764, longitude: 4.8357, population: 520000, timezone: 'Europe/Paris' },
  { id: 'bordeaux-fr', name: 'Bordeaux', country: 'France', countryCode: 'FR', continent: 'Europe', latitude: 44.8378, longitude: -0.5792, population: 260000, timezone: 'Europe/Paris' },
  { id: 'toulouse-fr', name: 'Toulouse', country: 'France', countryCode: 'FR', continent: 'Europe', latitude: 43.6047, longitude: 1.4442, population: 490000, timezone: 'Europe/Paris' },
  // ── Netherlands & Belgium ─────────────────────────────────────────────────
  { id: 'rotterdam-nl', name: 'Rotterdam', country: 'Netherlands', countryCode: 'NL', continent: 'Europe', latitude: 51.9225, longitude: 4.4792, population: 650000, timezone: 'Europe/Amsterdam' },
  { id: 'antwerp-be', name: 'Antwerp', country: 'Belgium', countryCode: 'BE', continent: 'Europe', latitude: 51.2194, longitude: 4.4025, population: 530000, timezone: 'Europe/Brussels' },
  { id: 'ghent-be', name: 'Ghent', country: 'Belgium', countryCode: 'BE', continent: 'Europe', latitude: 51.0543, longitude: 3.7174, population: 263000, timezone: 'Europe/Brussels' },
  // ── Germany ───────────────────────────────────────────────────────────────
  { id: 'cologne-de', name: 'Cologne', country: 'Germany', countryCode: 'DE', continent: 'Europe', latitude: 50.9333, longitude: 6.95, population: 1080000, timezone: 'Europe/Berlin' },
  { id: 'dusseldorf-de', name: 'Düsseldorf', country: 'Germany', countryCode: 'DE', continent: 'Europe', latitude: 51.2217, longitude: 6.7762, population: 620000, timezone: 'Europe/Berlin' },
  { id: 'nuremberg-de', name: 'Nuremberg', country: 'Germany', countryCode: 'DE', continent: 'Europe', latitude: 49.4521, longitude: 11.0767, population: 520000, timezone: 'Europe/Berlin' },
  // ── Poland ────────────────────────────────────────────────────────────────
  { id: 'wroclaw-pl', name: 'Wrocław', country: 'Poland', countryCode: 'PL', continent: 'Europe', latitude: 51.1079, longitude: 17.0385, population: 640000, timezone: 'Europe/Warsaw' },
  { id: 'gdansk-pl', name: 'Gdańsk', country: 'Poland', countryCode: 'PL', continent: 'Europe', latitude: 54.352, longitude: 18.6466, population: 486000, timezone: 'Europe/Warsaw' },
  // ── Greece ────────────────────────────────────────────────────────────────
  { id: 'thessaloniki-gr', name: 'Thessaloniki', country: 'Greece', countryCode: 'GR', continent: 'Europe', latitude: 40.6401, longitude: 22.9444, population: 325000, timezone: 'Europe/Athens' },
  // ── Italy ─────────────────────────────────────────────────────────────────
  { id: 'torino-it', name: 'Turin', country: 'Italy', countryCode: 'IT', continent: 'Europe', latitude: 45.0703, longitude: 7.6869, population: 860000, timezone: 'Europe/Rome' },
  { id: 'genoa-it', name: 'Genoa', country: 'Italy', countryCode: 'IT', continent: 'Europe', latitude: 44.4056, longitude: 8.9463, population: 560000, timezone: 'Europe/Rome' },
  { id: 'bologna-it', name: 'Bologna', country: 'Italy', countryCode: 'IT', continent: 'Europe', latitude: 44.4939, longitude: 11.3428, population: 400000, timezone: 'Europe/Rome' },
  // ── Malta ─────────────────────────────────────────────────────────────────
  { id: 'valletta-mt', name: 'Valletta', country: 'Malta', countryCode: 'MT', continent: 'Europe', latitude: 35.8997, longitude: 14.5146, population: 6000, timezone: 'Europe/Malta' },
  // ── Spain ─────────────────────────────────────────────────────────────────
  { id: 'bilbao-es', name: 'Bilbao', country: 'Spain', countryCode: 'ES', continent: 'Europe', latitude: 43.263, longitude: -2.934, population: 350000, timezone: 'Europe/Madrid' },
  { id: 'cordoba-es', name: 'Córdoba', country: 'Spain', countryCode: 'ES', continent: 'Europe', latitude: 37.8882, longitude: -4.7794, population: 325000, timezone: 'Europe/Madrid' },
  { id: 'malaga-es', name: 'Málaga', country: 'Spain', countryCode: 'ES', continent: 'Europe', latitude: 36.7213, longitude: -4.4217, population: 578000, timezone: 'Europe/Madrid' },
  // ── United Kingdom ────────────────────────────────────────────────────────
  { id: 'cardiff-gb', name: 'Cardiff', country: 'United Kingdom', countryCode: 'GB', continent: 'Europe', latitude: 51.4816, longitude: -3.1791, population: 366000, timezone: 'Europe/London' },
  // ── Balkans ───────────────────────────────────────────────────────────────
  { id: 'zagreb-hr', name: 'Zagreb', country: 'Croatia', countryCode: 'HR', continent: 'Europe', latitude: 45.815, longitude: 15.9819, population: 800000, timezone: 'Europe/Zagreb' },
  { id: 'belgrade-rs', name: 'Belgrade', country: 'Serbia', countryCode: 'RS', continent: 'Europe', latitude: 44.8176, longitude: 20.4569, population: 1700000, timezone: 'Europe/Belgrade' },
  { id: 'sarajevo-ba', name: 'Sarajevo', country: 'Bosnia and Herzegovina', countryCode: 'BA', continent: 'Europe', latitude: 43.8563, longitude: 18.4131, population: 420000, timezone: 'Europe/Sarajevo' },
  { id: 'tirana-al', name: 'Tirana', country: 'Albania', countryCode: 'AL', continent: 'Europe', latitude: 41.3317, longitude: 19.8319, population: 850000, timezone: 'Europe/Tirane' },
  { id: 'skopje-mk', name: 'Skopje', country: 'North Macedonia', countryCode: 'MK', continent: 'Europe', latitude: 42.0024, longitude: 21.4361, population: 540000, timezone: 'Europe/Skopje' },
  { id: 'pristina-xk', name: 'Pristina', country: 'Kosovo', countryCode: 'XK', continent: 'Europe', latitude: 42.6629, longitude: 21.1655, population: 500000, timezone: 'Europe/Belgrade' },
  { id: 'podgorica-me', name: 'Podgorica', country: 'Montenegro', countryCode: 'ME', continent: 'Europe', latitude: 42.4304, longitude: 19.2594, population: 185000, timezone: 'Europe/Podgorica' },
  // ── Eastern Europe ────────────────────────────────────────────────────────
  { id: 'sofia-bg', name: 'Sofia', country: 'Bulgaria', countryCode: 'BG', continent: 'Europe', latitude: 42.6977, longitude: 23.3219, population: 1300000, timezone: 'Europe/Sofia' },
  { id: 'bratislava-sk', name: 'Bratislava', country: 'Slovakia', countryCode: 'SK', continent: 'Europe', latitude: 48.1486, longitude: 17.1077, population: 480000, timezone: 'Europe/Bratislava' },
  { id: 'ljubljana-si', name: 'Ljubljana', country: 'Slovenia', countryCode: 'SI', continent: 'Europe', latitude: 46.0569, longitude: 14.5058, population: 280000, timezone: 'Europe/Ljubljana' },
  { id: 'chisinau-md', name: 'Chișinău', country: 'Moldova', countryCode: 'MD', continent: 'Europe', latitude: 47.0105, longitude: 28.8638, population: 730000, timezone: 'Europe/Chisinau' },
  // ── Caucasus & Mediterranean ──────────────────────────────────────────────
  { id: 'yerevan-am', name: 'Yerevan', country: 'Armenia', countryCode: 'AM', continent: 'Asia', latitude: 40.1792, longitude: 44.4991, population: 1100000, timezone: 'Asia/Yerevan' },
  { id: 'nicosia-cy', name: 'Nicosia', country: 'Cyprus', countryCode: 'CY', continent: 'Asia', latitude: 35.1856, longitude: 33.3823, population: 330000, timezone: 'Asia/Nicosia' },
  // ── Central Asia ──────────────────────────────────────────────────────────
  { id: 'almaty-kz', name: 'Almaty', country: 'Kazakhstan', countryCode: 'KZ', continent: 'Asia', latitude: 43.222, longitude: 76.8512, population: 1800000, timezone: 'Asia/Almaty' },
  { id: 'astana-kz', name: 'Astana', country: 'Kazakhstan', countryCode: 'KZ', continent: 'Asia', latitude: 51.1801, longitude: 71.446, population: 1100000, timezone: 'Asia/Almaty' },
  { id: 'bishkek-kg', name: 'Bishkek', country: 'Kyrgyzstan', countryCode: 'KG', continent: 'Asia', latitude: 42.8746, longitude: 74.5698, population: 1000000, timezone: 'Asia/Bishkek' },
  { id: 'dushanbe-tj', name: 'Dushanbe', country: 'Tajikistan', countryCode: 'TJ', continent: 'Asia', latitude: 38.5598, longitude: 68.787, population: 900000, timezone: 'Asia/Dushanbe' },
  { id: 'ashgabat-tm', name: 'Ashgabat', country: 'Turkmenistan', countryCode: 'TM', continent: 'Asia', latitude: 37.9601, longitude: 58.3261, population: 800000, timezone: 'Asia/Ashgabat' },
  // ── South Asia ────────────────────────────────────────────────────────────
  { id: 'islamabad-pk', name: 'Islamabad', country: 'Pakistan', countryCode: 'PK', continent: 'Asia', latitude: 33.7294, longitude: 73.0931, population: 1100000, timezone: 'Asia/Karachi' },
  { id: 'colombo-lk', name: 'Colombo', country: 'Sri Lanka', countryCode: 'LK', continent: 'Asia', latitude: 6.9271, longitude: 79.8612, population: 752000, timezone: 'Asia/Colombo' },
  // ── Southeast Asia ────────────────────────────────────────────────────────
  { id: 'vientiane-la', name: 'Vientiane', country: 'Laos', countryCode: 'LA', continent: 'Asia', latitude: 17.9757, longitude: 102.6331, population: 820000, timezone: 'Asia/Vientiane' },
  { id: 'naypyidaw-mm', name: 'Naypyidaw', country: 'Myanmar', countryCode: 'MM', continent: 'Asia', latitude: 19.7633, longitude: 96.0785, population: 1100000, timezone: 'Asia/Rangoon' },
  { id: 'cebu-ph', name: 'Cebu', country: 'Philippines', countryCode: 'PH', continent: 'Asia', latitude: 10.3157, longitude: 123.8854, population: 950000, timezone: 'Asia/Manila' },
  // ── Gulf & Middle East ────────────────────────────────────────────────────
  { id: 'kuwait-city-kw', name: 'Kuwait City', country: 'Kuwait', countryCode: 'KW', continent: 'Asia', latitude: 29.3797, longitude: 47.9735, population: 2400000, timezone: 'Asia/Kuwait' },
  { id: 'muscat-om', name: 'Muscat', country: 'Oman', countryCode: 'OM', continent: 'Asia', latitude: 23.6139, longitude: 58.5922, population: 1600000, timezone: 'Asia/Muscat' },
  { id: 'manama-bh', name: 'Manama', country: 'Bahrain', countryCode: 'BH', continent: 'Asia', latitude: 26.2154, longitude: 50.5832, population: 650000, timezone: 'Asia/Bahrain' },
  // ── Russia (Asia) ─────────────────────────────────────────────────────────
  { id: 'novosibirsk-ru', name: 'Novosibirsk', country: 'Russia', countryCode: 'RU', continent: 'Asia', latitude: 54.9893, longitude: 82.9257, population: 1600000, timezone: 'Asia/Novosibirsk' },
  { id: 'vladivostok-ru', name: 'Vladivostok', country: 'Russia', countryCode: 'RU', continent: 'Asia', latitude: 43.1332, longitude: 131.9113, population: 600000, timezone: 'Asia/Vladivostok' },
  // ── East Asia ─────────────────────────────────────────────────────────────
  { id: 'macau-mo', name: 'Macau', country: 'Macau', countryCode: 'MO', continent: 'Asia', latitude: 22.1987, longitude: 113.5439, population: 650000, timezone: 'Asia/Macau' },
  // ── Oceania ───────────────────────────────────────────────────────────────
  { id: 'auckland-nz', name: 'Auckland', country: 'New Zealand', countryCode: 'NZ', continent: 'Oceania', latitude: -36.8485, longitude: 174.7633, population: 1500000, timezone: 'Pacific/Auckland' },
  { id: 'christchurch-nz', name: 'Christchurch', country: 'New Zealand', countryCode: 'NZ', continent: 'Oceania', latitude: -43.5321, longitude: 172.6362, population: 380000, timezone: 'Pacific/Auckland' },
  { id: 'port-moresby-pg', name: 'Port Moresby', country: 'Papua New Guinea', countryCode: 'PG', continent: 'Oceania', latitude: -9.4438, longitude: 147.1803, population: 365000, timezone: 'Pacific/Port_Moresby' },
  // ── Canada ────────────────────────────────────────────────────────────────
  { id: 'ottawa-ca', name: 'Ottawa', country: 'Canada', countryCode: 'CA', continent: 'North America', latitude: 45.4215, longitude: -75.6972, population: 1000000, timezone: 'America/Toronto' },
  { id: 'calgary-ca', name: 'Calgary', country: 'Canada', countryCode: 'CA', continent: 'North America', latitude: 51.0447, longitude: -114.0719, population: 1300000, timezone: 'America/Edmonton' },
  { id: 'edmonton-ca', name: 'Edmonton', country: 'Canada', countryCode: 'CA', continent: 'North America', latitude: 53.5461, longitude: -113.4938, population: 1000000, timezone: 'America/Edmonton' },
  // ── Caribbean & Central America ───────────────────────────────────────────
  { id: 'santo-domingo-do', name: 'Santo Domingo', country: 'Dominican Republic', countryCode: 'DO', continent: 'North America', latitude: 18.4861, longitude: -69.9312, population: 3300000, timezone: 'America/Santo_Domingo' },
  { id: 'kingston-jm', name: 'Kingston', country: 'Jamaica', countryCode: 'JM', continent: 'North America', latitude: 17.997, longitude: -76.7936, population: 600000, timezone: 'America/Jamaica' },
  { id: 'port-of-spain-tt', name: 'Port of Spain', country: 'Trinidad and Tobago', countryCode: 'TT', continent: 'North America', latitude: 10.6521, longitude: -61.5194, population: 275000, timezone: 'America/Port_of_Spain' },
  { id: 'panama-city-pa', name: 'Panama City', country: 'Panama', countryCode: 'PA', continent: 'North America', latitude: 8.9936, longitude: -79.5197, population: 880000, timezone: 'America/Panama' },
  { id: 'san-jose-cr', name: 'San José', country: 'Costa Rica', countryCode: 'CR', continent: 'North America', latitude: 9.9281, longitude: -84.0907, population: 340000, timezone: 'America/Costa_Rica' },
  { id: 'managua-ni', name: 'Managua', country: 'Nicaragua', countryCode: 'NI', continent: 'North America', latitude: 12.1364, longitude: -86.2514, population: 1100000, timezone: 'America/Managua' },
  { id: 'tegucigalpa-hn', name: 'Tegucigalpa', country: 'Honduras', countryCode: 'HN', continent: 'North America', latitude: 14.0723, longitude: -87.2062, population: 1200000, timezone: 'America/Tegucigalpa' },
  { id: 'san-salvador-sv', name: 'San Salvador', country: 'El Salvador', countryCode: 'SV', continent: 'North America', latitude: 13.6929, longitude: -89.2182, population: 1100000, timezone: 'America/El_Salvador' },
  // ── USA ───────────────────────────────────────────────────────────────────
  { id: 'austin-us', name: 'Austin', country: 'United States', countryCode: 'US', stateCode: 'TX', continent: 'North America', latitude: 30.2672, longitude: -97.7431, population: 978908, timezone: 'America/Chicago' },
  { id: 'charlotte-us', name: 'Charlotte', country: 'United States', countryCode: 'US', stateCode: 'NC', continent: 'North America', latitude: 35.2271, longitude: -80.8431, population: 874579, timezone: 'America/New_York' },
  { id: 'portland-us', name: 'Portland', country: 'United States', countryCode: 'US', stateCode: 'OR', continent: 'North America', latitude: 45.5231, longitude: -122.6765, population: 650000, timezone: 'America/Los_Angeles' },
  { id: 'salt-lake-city-us', name: 'Salt Lake City', country: 'United States', countryCode: 'US', stateCode: 'UT', continent: 'North America', latitude: 40.7608, longitude: -111.891, population: 200000, timezone: 'America/Denver' },
  { id: 'kansas-city-us', name: 'Kansas City', country: 'United States', countryCode: 'US', stateCode: 'MO', continent: 'North America', latitude: 39.0997, longitude: -94.5786, population: 500000, timezone: 'America/Chicago' },
  { id: 'sacramento-us', name: 'Sacramento', country: 'United States', countryCode: 'US', stateCode: 'CA', continent: 'North America', latitude: 38.5816, longitude: -121.4944, population: 525000, timezone: 'America/Los_Angeles' },
  { id: 'anchorage-us', name: 'Anchorage', country: 'United States', countryCode: 'US', stateCode: 'AK', continent: 'North America', latitude: 61.2181, longitude: -149.9003, population: 291000, timezone: 'America/Anchorage' },
  // ── South America ─────────────────────────────────────────────────────────
  { id: 'paramaribo-sr', name: 'Paramaribo', country: 'Suriname', countryCode: 'SR', continent: 'South America', latitude: 5.852, longitude: -55.2038, population: 240000, timezone: 'America/Paramaribo' },
  { id: 'georgetown-gy', name: 'Georgetown', country: 'Guyana', countryCode: 'GY', continent: 'South America', latitude: 6.8013, longitude: -58.1551, population: 250000, timezone: 'America/Guyana' },
  { id: 'sucre-bo', name: 'Sucre', country: 'Bolivia', countryCode: 'BO', continent: 'South America', latitude: -19.0456, longitude: -65.2594, population: 260000, timezone: 'America/La_Paz' },
  // ── East Africa ───────────────────────────────────────────────────────────
  { id: 'kigali-rw', name: 'Kigali', country: 'Rwanda', countryCode: 'RW', continent: 'Africa', latitude: -1.9441, longitude: 30.0619, population: 1200000, timezone: 'Africa/Kigali' },
  { id: 'mombasa-ke', name: 'Mombasa', country: 'Kenya', countryCode: 'KE', continent: 'Africa', latitude: -4.05, longitude: 39.6667, population: 1200000, timezone: 'Africa/Nairobi' },
  { id: 'juba-ss', name: 'Juba', country: 'South Sudan', countryCode: 'SS', continent: 'Africa', latitude: 4.8594, longitude: 31.5713, population: 400000, timezone: 'Africa/Juba' },
  { id: 'bujumbura-bi', name: 'Bujumbura', country: 'Burundi', countryCode: 'BI', continent: 'Africa', latitude: -3.3818, longitude: 29.3622, population: 1200000, timezone: 'Africa/Bujumbura' },
  { id: 'djibouti-dj', name: 'Djibouti', country: 'Djibouti', countryCode: 'DJ', continent: 'Africa', latitude: 11.572, longitude: 43.1456, population: 560000, timezone: 'Africa/Djibouti' },
  { id: 'asmara-er', name: 'Asmara', country: 'Eritrea', countryCode: 'ER', continent: 'Africa', latitude: 15.3229, longitude: 38.9251, population: 963000, timezone: 'Africa/Asmara' },
  { id: 'mogadishu-so', name: 'Mogadishu', country: 'Somalia', countryCode: 'SO', continent: 'Africa', latitude: 2.0469, longitude: 45.3182, population: 2400000, timezone: 'Africa/Mogadishu' },
  // ── West Africa ───────────────────────────────────────────────────────────
  { id: 'niamey-ne', name: 'Niamey', country: 'Niger', countryCode: 'NE', continent: 'Africa', latitude: 13.5137, longitude: 2.1098, population: 1400000, timezone: 'Africa/Niamey' },
  { id: 'ouagadougou-bf', name: 'Ouagadougou', country: 'Burkina Faso', countryCode: 'BF', continent: 'Africa', latitude: 12.3647, longitude: -1.5353, population: 3600000, timezone: 'Africa/Ouagadougou' },
  { id: 'freetown-sl', name: 'Freetown', country: 'Sierra Leone', countryCode: 'SL', continent: 'Africa', latitude: 8.4657, longitude: -13.2317, population: 1100000, timezone: 'Africa/Freetown' },
  { id: 'monrovia-lr', name: 'Monrovia', country: 'Liberia', countryCode: 'LR', continent: 'Africa', latitude: 6.2907, longitude: -10.7606, population: 1500000, timezone: 'Africa/Monrovia' },
  { id: 'lome-tg', name: 'Lomé', country: 'Togo', countryCode: 'TG', continent: 'Africa', latitude: 6.1375, longitude: 1.2123, population: 2200000, timezone: 'Africa/Lome' },
  { id: 'cotonou-bj', name: 'Cotonou', country: 'Benin', countryCode: 'BJ', continent: 'Africa', latitude: 6.3654, longitude: 2.4183, population: 680000, timezone: 'Africa/Porto-Novo' },
  { id: 'ndjamena-td', name: "N'Djamena", country: 'Chad', countryCode: 'TD', continent: 'Africa', latitude: 12.1048, longitude: 15.0445, population: 1500000, timezone: 'Africa/Ndjamena' },
  // ── Central & Southern Africa ─────────────────────────────────────────────
  { id: 'bangui-cf', name: 'Bangui', country: 'Central African Republic', countryCode: 'CF', continent: 'Africa', latitude: 4.3947, longitude: 18.5582, population: 890000, timezone: 'Africa/Bangui' },
  { id: 'libreville-ga', name: 'Libreville', country: 'Gabon', countryCode: 'GA', continent: 'Africa', latitude: 0.3901, longitude: 9.4544, population: 815000, timezone: 'Africa/Libreville' },
  { id: 'windhoek-na', name: 'Windhoek', country: 'Namibia', countryCode: 'NA', continent: 'Africa', latitude: -22.5597, longitude: 17.0832, population: 431000, timezone: 'Africa/Windhoek' },
  { id: 'gaborone-bw', name: 'Gaborone', country: 'Botswana', countryCode: 'BW', continent: 'Africa', latitude: -24.6282, longitude: 25.9231, population: 232000, timezone: 'Africa/Gaborone' },
  { id: 'lilongwe-mw', name: 'Lilongwe', country: 'Malawi', countryCode: 'MW', continent: 'Africa', latitude: -13.9626, longitude: 33.7741, population: 1122000, timezone: 'Africa/Blantyre' },
  // ── Microstates of Europe (Achievement: All Countries) ───────────────────
  { id: 'andorra-la-vella-ad', name: 'Andorra la Vella', country: 'Andorra', countryCode: 'AD', continent: 'Europe', latitude: 42.5063, longitude: 1.5218, population: 22000, timezone: 'Europe/Andorra' },
  { id: 'vaduz-li', name: 'Vaduz', country: 'Liechtenstein', countryCode: 'LI', continent: 'Europe', latitude: 47.141, longitude: 9.5215, population: 5700, timezone: 'Europe/Vaduz' },
  { id: 'luxembourg-city-lu', name: 'Luxembourg City', country: 'Luxembourg', countryCode: 'LU', continent: 'Europe', latitude: 49.6116, longitude: 6.1319, population: 130000, timezone: 'Europe/Luxembourg' },
  { id: 'monaco-mc', name: 'Monaco', country: 'Monaco', countryCode: 'MC', continent: 'Europe', latitude: 43.7384, longitude: 7.4246, population: 38000, timezone: 'Europe/Monaco' },
  { id: 'san-marino-sm', name: 'San Marino', country: 'San Marino', countryCode: 'SM', continent: 'Europe', latitude: 43.9424, longitude: 12.4578, population: 4100, timezone: 'Europe/San_Marino' },
  { id: 'vatican-city-va', name: 'Vatican City', country: 'Vatican City', countryCode: 'VA', continent: 'Europe', latitude: 41.9029, longitude: 12.4534, population: 800, timezone: 'Europe/Vatican' },
  // ── Africa: remaining capitals (Achievement: All Countries) ──────────────
  { id: 'praia-cv', name: 'Praia', country: 'Cabo Verde', countryCode: 'CV', continent: 'Africa', latitude: 14.933, longitude: -23.5133, population: 170000, timezone: 'Atlantic/Cape_Verde' },
  { id: 'moroni-km', name: 'Moroni', country: 'Comoros', countryCode: 'KM', continent: 'Africa', latitude: -11.7022, longitude: 43.2551, population: 60000, timezone: 'Indian/Comoro' },
  { id: 'malabo-gq', name: 'Malabo', country: 'Equatorial Guinea', countryCode: 'GQ', continent: 'Africa', latitude: 3.7523, longitude: 8.7742, population: 297000, timezone: 'Africa/Malabo' },
  { id: 'mbabane-sz', name: 'Mbabane', country: 'Eswatini', countryCode: 'SZ', continent: 'Africa', latitude: -26.3054, longitude: 31.1367, population: 95000, timezone: 'Africa/Mbabane' },
  { id: 'banjul-gm', name: 'Banjul', country: 'Gambia', countryCode: 'GM', continent: 'Africa', latitude: 13.4549, longitude: -16.579, population: 31000, timezone: 'Africa/Banjul' },
  { id: 'bissau-gw', name: 'Bissau', country: 'Guinea-Bissau', countryCode: 'GW', continent: 'Africa', latitude: 11.8636, longitude: -15.5977, population: 500000, timezone: 'Africa/Bissau' },
  { id: 'maseru-ls', name: 'Maseru', country: 'Lesotho', countryCode: 'LS', continent: 'Africa', latitude: -29.3142, longitude: 27.4869, population: 330000, timezone: 'Africa/Maseru' },
  { id: 'nouakchott-mr', name: 'Nouakchott', country: 'Mauritania', countryCode: 'MR', continent: 'Africa', latitude: 18.0858, longitude: -15.9785, population: 1100000, timezone: 'Africa/Nouakchott' },
  { id: 'port-louis-mu', name: 'Port Louis', country: 'Mauritius', countryCode: 'MU', continent: 'Africa', latitude: -20.1609, longitude: 57.5012, population: 150000, timezone: 'Indian/Mauritius' },
  { id: 'sao-tome-st', name: 'São Tomé', country: 'Sao Tome and Principe', countryCode: 'ST', continent: 'Africa', latitude: 0.3365, longitude: 6.7273, population: 80000, timezone: 'Africa/Sao_Tome' },
  // ── Asia: remaining capitals (Achievement: All Countries) ────────────────
  { id: 'thimphu-bt', name: 'Thimphu', country: 'Bhutan', countryCode: 'BT', continent: 'Asia', latitude: 27.4712, longitude: 89.6339, population: 115000, timezone: 'Asia/Thimphu' },
  { id: 'bandar-seri-begawan-bn', name: 'Bandar Seri Begawan', country: 'Brunei', countryCode: 'BN', continent: 'Asia', latitude: 4.9031, longitude: 114.9398, population: 100000, timezone: 'Asia/Brunei' },
  { id: 'dili-tl', name: 'Dili', country: 'Timor-Leste', countryCode: 'TL', continent: 'Asia', latitude: -8.5569, longitude: 125.5603, population: 280000, timezone: 'Asia/Dili' },
  { id: 'ramallah-ps', name: 'Ramallah', country: 'Palestine', countryCode: 'PS', continent: 'Asia', latitude: 31.9038, longitude: 35.2034, population: 38000, timezone: 'Asia/Hebron' },
  // ── Caribbean microstates (Achievement: All Countries) ───────────────────
  { id: 'st-johns-ag', name: "St. John's", country: 'Antigua and Barbuda', countryCode: 'AG', continent: 'North America', latitude: 17.1175, longitude: -61.8456, population: 22000, timezone: 'America/Antigua' },
  { id: 'belmopan-bz', name: 'Belmopan', country: 'Belize', countryCode: 'BZ', continent: 'North America', latitude: 17.251, longitude: -88.759, population: 20000, timezone: 'America/Belize' },
  { id: 'roseau-dm', name: 'Roseau', country: 'Dominica', countryCode: 'DM', continent: 'North America', latitude: 15.301, longitude: -61.388, population: 15000, timezone: 'America/Dominica' },
  { id: 'st-georges-gd', name: "St. George's", country: 'Grenada', countryCode: 'GD', continent: 'North America', latitude: 12.0561, longitude: -61.7488, population: 33000, timezone: 'America/Grenada' },
  { id: 'basseterre-kn', name: 'Basseterre', country: 'Saint Kitts and Nevis', countryCode: 'KN', continent: 'North America', latitude: 17.3026, longitude: -62.7177, population: 14000, timezone: 'America/St_Kitts' },
  { id: 'castries-lc', name: 'Castries', country: 'Saint Lucia', countryCode: 'LC', continent: 'North America', latitude: 14.0101, longitude: -60.9875, population: 70000, timezone: 'America/St_Lucia' },
  { id: 'kingstown-vc', name: 'Kingstown', country: 'Saint Vincent and the Grenadines', countryCode: 'VC', continent: 'North America', latitude: 13.16, longitude: -61.2248, population: 25000, timezone: 'America/St_Vincent' },
  // ── Pacific Island nations (Achievement: All Countries) ──────────────────
  { id: 'tarawa-ki', name: 'Tarawa', country: 'Kiribati', countryCode: 'KI', continent: 'Oceania', latitude: 1.329, longitude: 172.979, population: 63000, timezone: 'Pacific/Tarawa' },
  { id: 'majuro-mh', name: 'Majuro', country: 'Marshall Islands', countryCode: 'MH', continent: 'Oceania', latitude: 7.1164, longitude: 171.1858, population: 28000, timezone: 'Pacific/Majuro' },
  { id: 'palikir-fm', name: 'Palikir', country: 'Micronesia', countryCode: 'FM', continent: 'Oceania', latitude: 6.9248, longitude: 158.1611, population: 7000, timezone: 'Pacific/Pohnpei' },
  { id: 'yaren-nr', name: 'Yaren', country: 'Nauru', countryCode: 'NR', continent: 'Oceania', latitude: -0.5477, longitude: 166.9209, population: 1100, timezone: 'Pacific/Nauru' },
  { id: 'ngerulmud-pw', name: 'Ngerulmud', country: 'Palau', countryCode: 'PW', continent: 'Oceania', latitude: 7.5006, longitude: 134.6242, population: 300, timezone: 'Pacific/Palau' },
  { id: 'apia-ws', name: 'Apia', country: 'Samoa', countryCode: 'WS', continent: 'Oceania', latitude: -13.8333, longitude: -171.7667, population: 37000, timezone: 'Pacific/Apia' },
  { id: 'honiara-sb', name: 'Honiara', country: 'Solomon Islands', countryCode: 'SB', continent: 'Oceania', latitude: -9.428, longitude: 159.9495, population: 92000, timezone: 'Pacific/Guadalcanal' },
  { id: 'nukualofa-to', name: "Nuku'alofa", country: 'Tonga', countryCode: 'TO', continent: 'Oceania', latitude: -21.1393, longitude: -175.2049, population: 25000, timezone: 'Pacific/Tongatapu' },
  { id: 'funafuti-tv', name: 'Funafuti', country: 'Tuvalu', countryCode: 'TV', continent: 'Oceania', latitude: -8.5211, longitude: 179.1985, population: 6000, timezone: 'Pacific/Funafuti' },
  { id: 'port-vila-vu', name: 'Port Vila', country: 'Vanuatu', countryCode: 'VU', continent: 'Oceania', latitude: -17.7333, longitude: 168.3273, population: 51000, timezone: 'Pacific/Efate' },
  // ── Antarctica (Achievement: 7 Continents) ───────────────────────────────
  { id: 'mcmurdo-station-aq', name: 'McMurdo Station', country: 'Antarctica', countryCode: 'AQ', continent: 'Antarctica', latitude: -77.8419, longitude: 166.6863, population: 1000, timezone: 'Antarctica/McMurdo' },
];

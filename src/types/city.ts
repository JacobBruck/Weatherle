export type Continent =
  | 'Africa'
  | 'Asia'
  | 'Europe'
  | 'North America'
  | 'South America'
  | 'Oceania'
  | 'Antarctica';

export interface City {
  /** Stable slug key, e.g. "tokyo-jp" — used for localStorage, dedupe, and lookups. */
  id: string;
  name: string;
  country: string;
  /** ISO 3166-1 alpha-2 code, e.g. "JP" */
  countryCode: string;
  /** USPS 2-letter abbreviation, US cities only, e.g. "TX" — disambiguates cities that share a name across states. */
  stateCode?: string;
  continent: Continent;
  latitude: number;
  longitude: number;
  population: number;
  /** IANA timezone, e.g. "Asia/Tokyo" — used for Open-Meteo queries */
  timezone: string;
}

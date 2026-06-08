const EARTH_RADIUS_KM = 6371;
const KM_TO_MILES = 0.621371;

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

function toDeg(rad: number): number {
  return (rad * 180) / Math.PI;
}

/** Great-circle distance between two lat/lon points, in kilometers (haversine formula). */
export function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
}

export function kmToMiles(km: number): number {
  return km * KM_TO_MILES;
}

/**
 * Rhumb-line (loxodrome) bearing in degrees [0, 360) from point 1 toward point 2 — the
 * constant compass course between them, i.e. a straight line on a standard flat map.
 *
 * We deliberately use this instead of the great-circle initial bearing: the great-circle
 * route can start by heading toward a pole (e.g. Dallas -> Mumbai initially points almost
 * due north before curving), which matches "shortest path on a globe" but not how players
 * picture relative direction when looking at a map.
 */
export function initialBearingDeg(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const phi1 = toRad(lat1);
  const phi2 = toRad(lat2);
  let dLambda = toRad(lon2 - lon1);
  if (Math.abs(dLambda) > Math.PI) {
    dLambda = dLambda > 0 ? -(2 * Math.PI - dLambda) : 2 * Math.PI + dLambda;
  }
  const dPsi = Math.log(Math.tan(Math.PI / 4 + phi2 / 2) / Math.tan(Math.PI / 4 + phi1 / 2));
  return (toDeg(Math.atan2(dLambda, dPsi)) + 360) % 360;
}

const COMPASS_POINTS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'] as const;
export type CompassDirection = (typeof COMPASS_POINTS)[number];

/** Maps a bearing in degrees to one of 8 compass directions, for an arrow/label. */
export function bearingToCompass(bearingDeg: number): CompassDirection {
  const index = Math.round(bearingDeg / 45) % 8;
  return COMPASS_POINTS[index];
}

export type Hemisphere = 'N' | 'S';

export function hemisphereOf(latitude: number): Hemisphere {
  return latitude >= 0 ? 'N' : 'S';
}

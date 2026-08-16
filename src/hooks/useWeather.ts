import { useEffect, useState } from 'react';
import type { City } from '../types/city';
import type { OpenMeteoResponse } from '../types/weather';

export type WeatherStatus = 'idle' | 'loading' | 'success' | 'error';

export interface UseWeatherResult {
  data: OpenMeteoResponse | null;
  status: WeatherStatus;
  error: string | null;
}

const BASE_URL = 'https://api.open-meteo.com/v1/forecast';
const CURRENT_PARAMS = 'temperature_2m,weather_code,wind_speed_10m,wind_direction_10m,relative_humidity_2m,is_day';
const DAILY_PARAMS = 'weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset';

// Retries a couple times (3 attempts total) with a short delay before giving up —
// Open-Meteo occasionally has transient blips, so one failure shouldn't be fatal.
const MAX_ATTEMPTS = 3;
const RETRY_DELAY_MS = 1000;
const API_DOWN_MESSAGE = 'The weather API appears to be down. Wait a few minutes and refresh the page.';

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWeather(city: City): Promise<OpenMeteoResponse> {
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const res = await fetch(buildUrl(city));
      if (!res.ok) throw new Error(`Open-Meteo request failed (${res.status})`);
      return (await res.json()) as OpenMeteoResponse;
    } catch (err) {
      if (attempt === MAX_ATTEMPTS) throw err;
      await sleep(RETRY_DELAY_MS);
    }
  }
  // Unreachable — the loop above always returns or throws on the final attempt.
  throw new Error(API_DOWN_MESSAGE);
}

// In-memory cache keyed by `${cityId}:${dateString}` so re-renders / repeated mounts
// for the same city on the same day don't refetch.
const cache = new Map<string, OpenMeteoResponse>();

function buildUrl(city: City): string {
  const params = new URLSearchParams({
    latitude: String(city.latitude),
    longitude: String(city.longitude),
    current: CURRENT_PARAMS,
    daily: DAILY_PARAMS,
    timezone: city.timezone,
    temperature_unit: 'celsius',
    wind_speed_unit: 'kmh',
    forecast_days: '1',
  });
  return `${BASE_URL}?${params.toString()}`;
}

/** Cache hits resolve to 'success' immediately; misses fall back to the given status. */
function resultFor(cacheKey: string, missStatus: WeatherStatus): UseWeatherResult {
  const cached = cache.get(cacheKey);
  return cached ? { data: cached, status: 'success', error: null } : { data: null, status: missStatus, error: null };
}

/** Fetches today's current + daily weather for a city from Open-Meteo. */
export function useWeather(city: City, dateString: string): UseWeatherResult {
  const cacheKey = `${city.id}:${dateString}`;
  const [result, setResult] = useState<UseWeatherResult>(() => resultFor(cacheKey, 'loading'));
  const [resultCacheKey, setResultCacheKey] = useState(cacheKey);

  // Re-derive from the cache when the city/date changes (cache hits skip the fetch effect entirely).
  if (resultCacheKey !== cacheKey) {
    setResultCacheKey(cacheKey);
    setResult(resultFor(cacheKey, 'loading'));
  }

  useEffect(() => {
    if (cache.has(cacheKey)) return;

    let cancelled = false;

    fetchWeather(city)
      .then((data) => {
        if (cancelled) return;
        cache.set(cacheKey, data);
        setResult({ data, status: 'success', error: null });
      })
      .catch(() => {
        if (cancelled) return;
        setResult({ data: null, status: 'error', error: API_DOWN_MESSAGE });
      });

    return () => {
      cancelled = true;
    };
  }, [cacheKey, city]);

  return result;
}

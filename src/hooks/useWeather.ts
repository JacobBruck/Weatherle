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

/** Fetches today's current + daily weather for a city from Open-Meteo. */
export function useWeather(city: City, dateString: string): UseWeatherResult {
  const [result, setResult] = useState<UseWeatherResult>({ data: null, status: 'idle', error: null });

  useEffect(() => {
    const cacheKey = `${city.id}:${dateString}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      setResult({ data: cached, status: 'success', error: null });
      return;
    }

    let cancelled = false;
    setResult({ data: null, status: 'loading', error: null });

    fetch(buildUrl(city))
      .then((res) => {
        if (!res.ok) throw new Error(`Open-Meteo request failed (${res.status})`);
        return res.json() as Promise<OpenMeteoResponse>;
      })
      .then((data) => {
        if (cancelled) return;
        cache.set(cacheKey, data);
        setResult({ data, status: 'success', error: null });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : 'Failed to load weather data';
        setResult({ data: null, status: 'error', error: message });
      });

    return () => {
      cancelled = true;
    };
  }, [city, dateString]);

  return result;
}

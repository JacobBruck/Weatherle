export type IconKey =
  | 'clear'
  | 'mostly-clear'
  | 'partly-cloudy'
  | 'overcast'
  | 'fog'
  | 'drizzle'
  | 'rain'
  | 'snow'
  | 'rain-showers'
  | 'snow-showers'
  | 'thunderstorm';

export type GradientTheme =
  | 'clear'
  | 'partly-cloudy'
  | 'overcast'
  | 'fog'
  | 'rain'
  | 'snow'
  | 'storm';

export interface WeatherCodeInfo {
  label: string;
  icon: IconKey;
  gradientTheme: GradientTheme;
}

/** WMO weather interpretation codes -> { label, icon, gradient theme }. */
const WEATHER_CODE_MAP: Record<number, WeatherCodeInfo> = {
  0: { label: 'Clear sky', icon: 'clear', gradientTheme: 'clear' },
  1: { label: 'Mainly clear', icon: 'mostly-clear', gradientTheme: 'clear' },
  2: { label: 'Partly cloudy', icon: 'partly-cloudy', gradientTheme: 'partly-cloudy' },
  3: { label: 'Overcast', icon: 'overcast', gradientTheme: 'overcast' },
  45: { label: 'Fog', icon: 'fog', gradientTheme: 'fog' },
  48: { label: 'Rime fog', icon: 'fog', gradientTheme: 'fog' },
  51: { label: 'Light drizzle', icon: 'drizzle', gradientTheme: 'rain' },
  53: { label: 'Drizzle', icon: 'drizzle', gradientTheme: 'rain' },
  55: { label: 'Dense drizzle', icon: 'drizzle', gradientTheme: 'rain' },
  56: { label: 'Freezing drizzle', icon: 'drizzle', gradientTheme: 'rain' },
  57: { label: 'Dense freezing drizzle', icon: 'drizzle', gradientTheme: 'rain' },
  61: { label: 'Slight rain', icon: 'rain', gradientTheme: 'rain' },
  63: { label: 'Rain', icon: 'rain', gradientTheme: 'rain' },
  65: { label: 'Heavy rain', icon: 'rain', gradientTheme: 'rain' },
  66: { label: 'Freezing rain', icon: 'rain', gradientTheme: 'rain' },
  67: { label: 'Heavy freezing rain', icon: 'rain', gradientTheme: 'rain' },
  71: { label: 'Slight snow', icon: 'snow', gradientTheme: 'snow' },
  73: { label: 'Snow', icon: 'snow', gradientTheme: 'snow' },
  75: { label: 'Heavy snow', icon: 'snow', gradientTheme: 'snow' },
  77: { label: 'Snow grains', icon: 'snow', gradientTheme: 'snow' },
  80: { label: 'Slight rain showers', icon: 'rain-showers', gradientTheme: 'rain' },
  81: { label: 'Rain showers', icon: 'rain-showers', gradientTheme: 'rain' },
  82: { label: 'Violent rain showers', icon: 'rain-showers', gradientTheme: 'rain' },
  85: { label: 'Slight snow showers', icon: 'snow-showers', gradientTheme: 'snow' },
  86: { label: 'Heavy snow showers', icon: 'snow-showers', gradientTheme: 'snow' },
  95: { label: 'Thunderstorm', icon: 'thunderstorm', gradientTheme: 'storm' },
  96: { label: 'Thunderstorm with hail', icon: 'thunderstorm', gradientTheme: 'storm' },
  99: { label: 'Thunderstorm with heavy hail', icon: 'thunderstorm', gradientTheme: 'storm' },
};

const FALLBACK: WeatherCodeInfo = { label: 'Unknown', icon: 'partly-cloudy', gradientTheme: 'partly-cloudy' };

export function getWeatherInfo(code: number): WeatherCodeInfo {
  return WEATHER_CODE_MAP[code] ?? FALLBACK;
}

/** CSS theme class name keyed by condition + day/night, e.g. "theme-clear-night". */
export function getThemeClassName(code: number, isDay: 0 | 1): string {
  const { gradientTheme } = getWeatherInfo(code);
  return `theme-${gradientTheme}-${isDay ? 'day' : 'night'}`;
}

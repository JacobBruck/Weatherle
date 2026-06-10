import type { City } from '../../types/city';
import type { OpenMeteoResponse } from '../../types/weather';
import type { WeatherStatus } from '../../hooks/useWeather';
import { getWeatherInfo } from '../../utils/weatherCodes';
import { formatTemperature, formatWindSpeed, type TemperatureUnit } from '../../utils/temperature';
import { WeatherIcon } from '../WeatherIcon/WeatherIcon';
import styles from './WeatherRevealCard.module.css';

interface WeatherRevealCardProps {
  data: OpenMeteoResponse | null;
  status: WeatherStatus;
  error: string | null;
  /** Shown once the round is over (won or lost) — e.g. "Tokyo, Japan" */
  revealedCityLabel: string | null;
  /** The target city, once revealed — used for the Wikipedia link. */
  revealedCity: City | null;
  unit: TemperatureUnit;
  onUnitChange: (unit: TemperatureUnit) => void;
}

function wikipediaUrl(city: City): string {
  return `https://en.wikipedia.org/wiki/${encodeURIComponent(city.name.replace(/ /g, '_'))}`;
}

function formatTime(iso: string): string {
  // "2026-06-08T05:47" -> "5:47 AM" using the timezone-local time the API already returned
  const [, time] = iso.split('T');
  const [hourStr, minute] = time.split(':');
  const hour = Number(hourStr);
  const period = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${minute} ${period}`;
}

export function WeatherRevealCard({ data, status, error, revealedCityLabel, revealedCity, unit, onUnitChange }: WeatherRevealCardProps) {
  return (
    <section className={`glass ${styles.card}`} aria-live="polite">
      <div className={styles.unitToggle} role="group" aria-label="Units">
        <button
          type="button"
          className={unit === 'F' ? `${styles.unitButton} ${styles.unitButtonActive}` : styles.unitButton}
          aria-pressed={unit === 'F'}
          onClick={() => onUnitChange('F')}
        >
          °F
        </button>
        <button
          type="button"
          className={unit === 'C' ? `${styles.unitButton} ${styles.unitButtonActive}` : styles.unitButton}
          aria-pressed={unit === 'C'}
          onClick={() => onUnitChange('C')}
        >
          °C
        </button>
      </div>

      {status === 'success' && data && (
        <span
          className={styles.dayNightBadge}
          role="img"
          aria-label={data.current.is_day ? 'Daytime right now in this city' : 'Nighttime right now in this city'}
        >
          {data.current.is_day ? '☀️' : '🌙'}
        </span>
      )}

      <p className={revealedCityLabel ? `${styles.cityName} ${styles.cityNameRevealed}` : styles.cityName}>
        {revealedCityLabel ?? "Today's weather — where in the world is this?"}
      </p>

      {revealedCity && (
        <p className={styles.learnMore}>
          Learn more:{' '}
          <a href={wikipediaUrl(revealedCity)} target="_blank" rel="noopener noreferrer">
            {revealedCity.name}
          </a>
        </p>
      )}

      {status === 'loading' && <p className={styles.placeholder}>Loading live weather…</p>}
      {status === 'error' && <p className={styles.placeholder}>{error ?? 'Could not load weather data.'}</p>}

      {status === 'success' && data && (
        <>
          <div className={styles.iconWrap}>
            <WeatherIcon icon={getWeatherInfo(data.current.weather_code).icon} isDay={data.current.is_day} size={88} />
          </div>
          <p className={styles.temperature}>{formatTemperature(data.current.temperature_2m, unit)}</p>
          <p className={styles.condition}>{getWeatherInfo(data.current.weather_code).label}</p>

          <div className={styles.statsRow}>
            <div className={styles.stat}>
              <span className={styles.statLabel}>High / Low</span>
              <span className={styles.statValue}>
                {formatTemperature(data.daily.temperature_2m_max[0], unit)} / {formatTemperature(data.daily.temperature_2m_min[0], unit)}
              </span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Humidity</span>
              <span className={styles.statValue}>{Math.round(data.current.relative_humidity_2m)}%</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Wind</span>
              <span className={styles.statValue}>{formatWindSpeed(data.current.wind_speed_10m, unit)}</span>
            </div>
          </div>
          <div className={styles.statsRow}>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Sunrise</span>
              <span className={styles.statValue}>{formatTime(data.daily.sunrise[0])}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Sunset</span>
              <span className={styles.statValue}>{formatTime(data.daily.sunset[0])}</span>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

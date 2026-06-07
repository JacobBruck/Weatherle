import type { IconKey } from '../../utils/weatherCodes';
import styles from './WeatherIcon.module.css';

interface WeatherIconProps {
  icon: IconKey;
  isDay: 0 | 1;
  size?: number;
}

function Sun() {
  return (
    <g className={styles.sunGroup}>
      <circle cx="32" cy="32" r="11" fill="#FFD60A" />
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * 360) / 8;
        return (
          <rect
            key={i}
            x="30.5"
            y="8"
            width="3"
            height="8"
            rx="1.5"
            fill="#FFD60A"
            transform={`rotate(${angle} 32 32)`}
          />
        );
      })}
    </g>
  );
}

function Moon() {
  return (
    <g className={styles.moon}>
      <path
        d="M40 20a14 14 0 1 0 0 24 17 17 0 0 1 0-24Z"
        fill="#E8ECF4"
      />
    </g>
  );
}

function SmallSun() {
  return (
    <g className={styles.sunGroup} transform="translate(7 -7) scale(0.7)">
      <circle cx="32" cy="32" r="11" fill="#FFD60A" />
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * 360) / 8;
        return (
          <rect
            key={i}
            x="30.5"
            y="8"
            width="3"
            height="8"
            rx="1.5"
            fill="#FFD60A"
            transform={`rotate(${angle} 32 32)`}
          />
        );
      })}
    </g>
  );
}

function SmallMoon() {
  return (
    <g className={styles.moon} transform="translate(7 -7) scale(0.7)">
      <path d="M40 20a14 14 0 1 0 0 24 17 17 0 0 1 0-24Z" fill="#E8ECF4" />
    </g>
  );
}

function CloudShape({ className, fill, transform }: { className?: string; fill: string; transform?: string }) {
  return (
    <path
      className={className}
      transform={transform}
      fill={fill}
      d="M20 42a9 9 0 0 1-1-17.94A12 12 0 0 1 42.6 20.5 10 10 0 0 1 41 40.4a9.4 9.4 0 0 1-1 .1H20Z"
    />
  );
}

function Clouds({ overcast = false }: { overcast?: boolean }) {
  return (
    <>
      <CloudShape className={styles.cloudBack} fill={overcast ? '#AEB7C2' : '#D7DEE8'} transform="translate(-5 -3) scale(0.85)" />
      <CloudShape className={styles.cloudFront} fill={overcast ? '#8C97A6' : '#FFFFFF'} transform="translate(2 6) scale(0.95)" />
    </>
  );
}

function Drops({ count, dark = false }: { count: number; dark?: boolean }) {
  const startX = 22;
  const spacing = (44 - startX) / (count - 1 || 1);
  return (
    <g>
      {Array.from({ length: count }).map((_, i) => (
        <rect
          key={i}
          className={styles.drop}
          x={startX + i * spacing}
          y="46"
          width="2.4"
          height="8"
          rx="1.2"
          fill={dark ? '#6B8CAE' : '#9DC1E8'}
          style={{ animationDelay: `${i * 0.18}s` }}
        />
      ))}
    </g>
  );
}

function Flakes({ count }: { count: number }) {
  const startX = 22;
  const spacing = (44 - startX) / (count - 1 || 1);
  return (
    <g>
      {Array.from({ length: count }).map((_, i) => (
        <circle
          key={i}
          className={styles.flake}
          cx={startX + i * spacing}
          cy="48"
          r="1.8"
          fill="#FFFFFF"
          style={{ animationDelay: `${i * 0.5}s` }}
        />
      ))}
    </g>
  );
}

function Bolt() {
  return (
    <path
      className={styles.bolt}
      d="M34 38 26 50h6l-3 10 12-16h-6l3-6Z"
      fill="#FFD60A"
    />
  );
}

function FogLines() {
  return (
    <g>
      {[26, 34, 42].map((y, i) => (
        <rect
          key={y}
          className={styles.fogLine}
          x="14"
          y={y}
          width="36"
          height="3.4"
          rx="1.7"
          fill="#E3E8EE"
          style={{ animationDelay: `${i * 0.7}s` }}
        />
      ))}
    </g>
  );
}

export function WeatherIcon({ icon, isDay, size = 64 }: WeatherIconProps) {
  return (
    <svg
      className={styles.icon}
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role="img"
      aria-hidden="true"
    >
      {render(icon, isDay)}
    </svg>
  );
}

function render(icon: IconKey, isDay: 0 | 1) {
  switch (icon) {
    case 'clear':
      return isDay ? <Sun /> : <Moon />;
    case 'mostly-clear':
      return (
        <>
          {isDay ? <SmallSun /> : <SmallMoon />}
          <CloudShape fill="#FFFFFF" transform="translate(2 10) scale(0.8)" />
        </>
      );
    case 'partly-cloudy':
      return (
        <>
          {isDay ? <SmallSun /> : <SmallMoon />}
          <Clouds />
        </>
      );
    case 'overcast':
      return <Clouds overcast />;
    case 'fog':
      return (
        <>
          <CloudShape fill="#C7CFD8" transform="translate(-2 -8) scale(0.75)" />
          <FogLines />
        </>
      );
    case 'drizzle':
      return (
        <>
          <Clouds overcast />
          <Drops count={2} />
        </>
      );
    case 'rain':
      return (
        <>
          <Clouds overcast />
          <Drops count={4} />
        </>
      );
    case 'rain-showers':
      return (
        <>
          {isDay ? <SmallSun /> : <SmallMoon />}
          <Clouds overcast />
          <Drops count={5} dark />
        </>
      );
    case 'snow':
      return (
        <>
          <Clouds overcast />
          <Flakes count={4} />
        </>
      );
    case 'snow-showers':
      return (
        <>
          <Clouds overcast />
          <Flakes count={6} />
        </>
      );
    case 'thunderstorm':
      return (
        <>
          <Clouds overcast />
          <Bolt />
          <Drops count={2} dark />
        </>
      );
    default:
      return <Clouds />;
  }
}

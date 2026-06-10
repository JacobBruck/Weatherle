import { useEffect, useMemo, useRef, useState } from 'react';
import { useDailyCity } from './hooks/useDailyCity';
import { useWeather } from './hooks/useWeather';
import { useGameState } from './hooks/useGameState';
import { useUnlimitedGame } from './hooks/useUnlimitedGame';
import { useGameMode } from './hooks/useGameMode';
import { useDifficulty, citiesForDifficulty } from './hooks/useDifficulty';
import { CITIES } from './data/cities';
import { GUESS_CITIES } from './data/guessCities';
import { useTemperatureUnit } from './hooks/useTemperatureUnit';
import { useColorScheme } from './hooks/useColorScheme';
import { getThemeClassName } from './utils/weatherCodes';
import { trackEvent } from './utils/analytics';
import { recordResult } from './utils/stats';
import { WeatherRevealCard } from './components/WeatherRevealCard/WeatherRevealCard';
import { GuessInput } from './components/GuessInput/GuessInput';
import { GuessHistory } from './components/GuessHistory/GuessHistory';
import { GameStatus } from './components/GameStatus/GameStatus';
import { ModeSelectModal } from './components/ModeSelectModal/ModeSelectModal';
import { StatsModal } from './components/StatsModal/StatsModal';
import { EasterEggModal, EASTER_EGG_CITY_IDS } from './components/EasterEggModal/EasterEggModal';
import type { GameMode } from './hooks/useGameMode';
import type { Difficulty } from './hooks/useDifficulty';
import type { City } from './types/city';
import styles from './App.module.css';

function App() {
  const [unit, setUnit] = useTemperatureUnit();
  const [scheme, setScheme] = useColorScheme();
  const [mode, setMode] = useGameMode();
  const [difficulty, setDifficulty] = useDifficulty();
  const [showModePrompt, setShowModePrompt] = useState(true);
  const [showStats, setShowStats] = useState(false);
  const [easterEgg, setEasterEgg] = useState<{ won: boolean; city: City; mode: GameMode } | null>(null);

  const pool = useMemo(() => citiesForDifficulty(difficulty), [difficulty]);

  // Make sure the easter egg cities are reachable in Medium/Hard Unlimited (Easy
  // stays curated and excludes them).
  const unlimitedPool = useMemo(() => {
    if (difficulty === 'easy') return pool;
    const extras = CITIES.filter((c) => EASTER_EGG_CITY_IDS.has(c.id) && !pool.some((p) => p.id === c.id));
    return extras.length > 0 ? [...pool, ...extras] : pool;
  }, [pool, difficulty]);

  const daily = useDailyCity(pool);
  const dailyGame = useGameState(daily.city, daily.dateString, difficulty);
  const unlimited = useUnlimitedGame(unlimitedPool);

  const isDaily = mode === 'daily';
  const activeCity = isDaily ? daily.city : unlimited.city;
  const guessableCities = useMemo(
    () => [...CITIES, ...GUESS_CITIES].sort((a, b) => a.name.localeCompare(b.name)),
    [],
  );
  const weatherCacheKey = isDaily ? daily.dateString : `unlimited-${unlimited.roundId}`;
  const { data, status: weatherStatus, error } = useWeather(activeCity, weatherCacheKey);

  const entries = isDaily ? dailyGame.entries : unlimited.entries;
  const gameStatus = isDaily ? dailyGame.status : unlimited.status;
  const submitGuess = isDaily ? dailyGame.submitGuess : unlimited.submitGuess;

  const themeClass = data ? getThemeClassName(data.current.weather_code, data.current.is_day) : 'theme-clear-day';
  const isOver = gameStatus !== 'in-progress';
  const revealedCityLabel = isOver ? `${activeCity.name}, ${activeCity.country}` : null;

  // Record stats when a game completes, then auto-show the stats modal.
  // prevStatus refs prevent recording on page-load if the game was already done.
  const prevDailyStatus = useRef(dailyGame.status);
  const prevUnlimitedStatus = useRef(unlimited.status);

  useEffect(() => {
    const prev = prevDailyStatus.current;
    prevDailyStatus.current = dailyGame.status;
    if (prev === 'in-progress' && (dailyGame.status === 'won' || dailyGame.status === 'lost')) {
      recordResult('daily', difficulty, dailyGame.status === 'won', dailyGame.entries.length, daily.dateString);
      if (EASTER_EGG_CITY_IDS.has(daily.city.id)) {
        setEasterEgg({ won: dailyGame.status === 'won', city: daily.city, mode: 'daily' });
      } else {
        setTimeout(() => setShowStats(true), 1600);
      }
    }
  }, [dailyGame.status]);

  useEffect(() => {
    const prev = prevUnlimitedStatus.current;
    prevUnlimitedStatus.current = unlimited.status;
    if (prev === 'in-progress' && (unlimited.status === 'won' || unlimited.status === 'lost')) {
      recordResult('unlimited', difficulty, unlimited.status === 'won', unlimited.entries.length, daily.dateString);
      if (EASTER_EGG_CITY_IDS.has(unlimited.city.id)) {
        setEasterEgg({ won: unlimited.status === 'won', city: unlimited.city, mode: 'unlimited' });
      }
    }
  }, [unlimited.status]);

  function completeSetup(nextMode: GameMode, nextDifficulty: Difficulty) {
    setMode(nextMode);
    setDifficulty(nextDifficulty);
    setShowModePrompt(false);
    trackEvent('game_start', { mode: nextMode, difficulty: nextDifficulty });
  }

  return (
    <div className={`${styles.page} ${themeClass} bg-transition`}>
      {showModePrompt && <ModeSelectModal onComplete={completeSetup} />}
      {showStats && <StatsModal mode={mode} difficulty={difficulty} onClose={() => setShowStats(false)} />}
      {easterEgg && (
        <EasterEggModal
          won={easterEgg.won}
          targetCity={easterEgg.city}
          onClose={() => {
            const wasDaily = easterEgg.mode === 'daily';
            setEasterEgg(null);
            if (wasDaily) setShowStats(true);
          }}
        />
      )}

      <div className={styles.topLeft}>
        <span className={styles.modeBadge}>
          {isDaily ? '📅 Daily Challenge' : '♾️ Unlimited'}
        </span>
      </div>

      <div className={styles.topRight}>
        <button
          type="button"
          className={styles.iconButton}
          aria-label="View statistics"
          title="View statistics"
          onClick={() => setShowStats(true)}
        >
          📊
        </button>
        <button
          type="button"
          className={styles.iconButton}
          aria-label="Game settings — switch mode or city pool"
          title="Game settings — switch mode or city pool"
          onClick={() => setShowModePrompt(true)}
        >
          ⚙️
        </button>
        {!isDaily && (
          <button
            type="button"
            className={`${styles.iconButton} ${styles.refreshButton}`}
            aria-label="New random city"
            title="New random city"
            onClick={unlimited.newRound}
          >
            🔄
          </button>
        )}
        <div className={styles.schemeToggle} role="group" aria-label="Appearance">
          <button
            type="button"
            className={scheme === 'light' ? `${styles.schemeButton} ${styles.schemeButtonActive}` : styles.schemeButton}
            aria-pressed={scheme === 'light'}
            aria-label="Light mode"
            onClick={() => setScheme('light')}
          >
            ☀️
          </button>
          <button
            type="button"
            className={scheme === 'dark' ? `${styles.schemeButton} ${styles.schemeButtonActive}` : styles.schemeButton}
            aria-pressed={scheme === 'dark'}
            aria-label="Dark mode"
            onClick={() => setScheme('dark')}
          >
            🌙
          </button>
        </div>
      </div>

      <main className={styles.container}>
        <h1 className={styles.title}>Weatherle</h1>
        <p className={styles.subtitle}>
          {isDaily ? 'Guess the city from its weather.' : 'Unlimited mode — guess as many cities as you like.'}
        </p>

        <WeatherRevealCard
          data={data}
          status={weatherStatus}
          error={error}
          revealedCityLabel={revealedCityLabel}
          revealedCity={isOver ? activeCity : null}
          unit={unit}
          onUnitChange={setUnit}
        />

        <GameStatus
          status={gameStatus}
          guessCount={entries.length}
          targetCity={activeCity}
          mode={mode}
          difficulty={difficulty}
          dateString={isDaily ? daily.dateString : weatherCacheKey}
          entries={entries}
          onPlayAgain={unlimited.newRound}
        />

        <GuessInput
          cities={guessableCities}
          onSubmitGuess={submitGuess}
          disabled={isOver}
          guessedCityIds={entries.map((e) => e.city.id)}
          placeholder={isOver ? (isDaily ? 'Come back tomorrow for a new city!' : 'Tap 🔄 for a new city!') : 'Type a city name…'}
        />

        <GuessHistory entries={entries} unit={unit} />
      </main>
    </div>
  );
}

export default App;

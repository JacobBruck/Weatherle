import { useMemo, useState } from 'react';
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
import { WeatherRevealCard } from './components/WeatherRevealCard/WeatherRevealCard';
import { GuessInput } from './components/GuessInput/GuessInput';
import { GuessHistory } from './components/GuessHistory/GuessHistory';
import { GameStatus } from './components/GameStatus/GameStatus';
import { ModeSelectModal } from './components/ModeSelectModal/ModeSelectModal';
import type { GameMode } from './hooks/useGameMode';
import type { Difficulty } from './hooks/useDifficulty';
import styles from './App.module.css';

function App() {
  const [unit, setUnit] = useTemperatureUnit();
  const [scheme, setScheme] = useColorScheme();
  const [mode, setMode] = useGameMode();
  const [difficulty, setDifficulty] = useDifficulty();
  // Always greets the player with the mode-select menu on load — every page refresh, not just once per session.
  const [showModePrompt, setShowModePrompt] = useState(true);

  // Difficulty scopes both the Daily Challenge and Unlimited mode to the same city pool —
  // Easy/Medium/Hard each get their own deterministic daily target (same for every player
  // within that pool). The autocomplete is always the full city list, separate from the pool.
  const pool = useMemo(() => citiesForDifficulty(difficulty), [difficulty]);

  const daily = useDailyCity(pool);
  const dailyGame = useGameState(daily.city, daily.dateString, difficulty);
  const unlimited = useUnlimitedGame(pool);

  const isDaily = mode === 'daily';
  const activeCity = isDaily ? daily.city : unlimited.city;
  // Dropdown covers CITIES (answer pool) + GUESS_CITIES (search-only extras) so players
  // can type any well-known city they know, even if it isn't a possible answer.
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

  function completeSetup(nextMode: GameMode, nextDifficulty: Difficulty) {
    setMode(nextMode);
    setDifficulty(nextDifficulty);
    setShowModePrompt(false);
    // One event per "version" of the game played — lets the GA dashboard break plays
    // down by mode/difficulty, and (via GA's built-in geo data) by country and region.
    trackEvent('game_start', { mode: nextMode, difficulty: nextDifficulty });
  }

  return (
    <div className={`${styles.page} ${themeClass} bg-transition`}>
      {showModePrompt && <ModeSelectModal onComplete={completeSetup} />}

      <div className={styles.topLeft}>
        <span className={styles.modeBadge}>
          {isDaily ? '📅 Daily Challenge' : '♾️ Unlimited'}
        </span>
      </div>

      <div className={styles.topRight}>
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
          unit={unit}
          onUnitChange={setUnit}
        />

        <GameStatus
          status={gameStatus}
          guessCount={entries.length}
          targetCity={activeCity}
          mode={mode}
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

import { useMemo, useState } from 'react';
import { CITIES } from './data/cities';
import { useDailyCity } from './hooks/useDailyCity';
import { useWeather } from './hooks/useWeather';
import { useGameState } from './hooks/useGameState';
import { useUnlimitedGame } from './hooks/useUnlimitedGame';
import { useGameMode } from './hooks/useGameMode';
import { useDifficulty, citiesForDifficulty } from './hooks/useDifficulty';
import { useTemperatureUnit } from './hooks/useTemperatureUnit';
import { useColorScheme } from './hooks/useColorScheme';
import { getThemeClassName } from './utils/weatherCodes';
import { WeatherRevealCard } from './components/WeatherRevealCard/WeatherRevealCard';
import { GuessInput } from './components/GuessInput/GuessInput';
import { GuessHistory } from './components/GuessHistory/GuessHistory';
import { GameStatus } from './components/GameStatus/GameStatus';
import { ModeSelectModal } from './components/ModeSelectModal/ModeSelectModal';
import type { GameMode } from './hooks/useGameMode';
import styles from './App.module.css';

const MODE_PROMPT_SEEN_KEY = 'weatherle:modePromptSeen';

function readModePromptSeen(): boolean {
  try {
    return sessionStorage.getItem(MODE_PROMPT_SEEN_KEY) === '1';
  } catch {
    return true;
  }
}

function App() {
  const [unit, setUnit] = useTemperatureUnit();
  const [scheme, setScheme] = useColorScheme();
  const [mode, setMode] = useGameMode();
  const [difficulty, setDifficulty] = useDifficulty();
  const [showModePrompt, setShowModePrompt] = useState(() => !readModePromptSeen());

  // Difficulty only governs the Unlimited practice pool — the Daily Challenge target must
  // stay drawn from the full city list so it's the same mystery city for every player
  // (and so its name is always something the autocomplete can find, regardless of pool size).
  const unlimitedCities = useMemo(() => citiesForDifficulty(difficulty), [difficulty]);

  const daily = useDailyCity(CITIES);
  const dailyGame = useGameState(daily.city, daily.dateString);
  const unlimited = useUnlimitedGame(unlimitedCities);

  const isDaily = mode === 'daily';
  const activeCity = isDaily ? daily.city : unlimited.city;
  const guessableCities = isDaily ? CITIES : unlimitedCities;
  const weatherCacheKey = isDaily ? daily.dateString : `unlimited-${unlimited.roundId}`;
  const { data, status: weatherStatus, error } = useWeather(activeCity, weatherCacheKey);

  const entries = isDaily ? dailyGame.entries : unlimited.entries;
  const gameStatus = isDaily ? dailyGame.status : unlimited.status;
  const submitGuess = isDaily ? dailyGame.submitGuess : unlimited.submitGuess;

  const themeClass = data ? getThemeClassName(data.current.weather_code, data.current.is_day) : 'theme-clear-day';
  const isOver = gameStatus !== 'in-progress';
  const revealedCityLabel = isOver ? `${activeCity.name}, ${activeCity.country}` : null;

  function chooseMode(next: GameMode) {
    setMode(next);
    setShowModePrompt(false);
    try {
      sessionStorage.setItem(MODE_PROMPT_SEEN_KEY, '1');
    } catch {
      // sessionStorage unavailable — the prompt will simply reappear next load.
    }
  }

  return (
    <div className={`${styles.page} ${themeClass} bg-transition`}>
      {showModePrompt && (
        <ModeSelectModal onSelect={chooseMode} difficulty={difficulty} onDifficultyChange={setDifficulty} />
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

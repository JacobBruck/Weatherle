import { useMemo, useState } from 'react';
import { useDailyCity } from './hooks/useDailyCity';
import { useWeather } from './hooks/useWeather';
import { useGameState, type GuessEntry } from './hooks/useGameState';
import { useUnlimitedGame } from './hooks/useUnlimitedGame';
import { useGameMode } from './hooks/useGameMode';
import { useDifficulty, citiesForDifficulty } from './hooks/useDifficulty';
import { CITIES } from './data/cities';
import { GUESS_CITIES } from './data/guessCities';
import { useTemperatureUnit } from './hooks/useTemperatureUnit';
import { useColorScheme } from './hooks/useColorScheme';
import { useAuth } from './hooks/useAuth';
import { FaqModal } from './components/FaqModal/FaqModal';
import { getThemeClassName } from './utils/weatherCodes';
import { formatCityLabel } from './utils/formatCityLabel';
import { trackEvent } from './utils/analytics';
import { recordResult } from './utils/stats';
import { getNewlyUnlocked } from './utils/achievementTracking';
import type { Achievement } from './utils/achievements';
import { WeatherRevealCard } from './components/WeatherRevealCard/WeatherRevealCard';
import { AchievementToast } from './components/AchievementToast/AchievementToast';
import { GuessInput } from './components/GuessInput/GuessInput';
import { GuessHistory } from './components/GuessHistory/GuessHistory';
import { GameStatus } from './components/GameStatus/GameStatus';
import { ModeSelectModal, type ModeModalStep } from './components/ModeSelectModal/ModeSelectModal';
import { StatsModal } from './components/StatsModal/StatsModal';
import { EasterEggModal } from './components/EasterEggModal/EasterEggModal';
import { EASTER_EGG_CITY_IDS } from './data/easterEggs';
import type { GameMode } from './hooks/useGameMode';
import type { Difficulty } from './hooks/useDifficulty';
import type { City } from './types/city';
import styles from './App.module.css';

function App() {
  const [unit, setUnit] = useTemperatureUnit();
  const [scheme, setScheme] = useColorScheme();
  const { user, signInWithGoogle, signOut } = useAuth();
  const [mode, setMode] = useGameMode();
  const [difficulty, setDifficulty] = useDifficulty();
  const [showModePrompt, setShowModePrompt] = useState(true);
  const [modeModalStep, setModeModalStep] = useState<ModeModalStep>('welcome');
  // A returning player already has a valid stored mode/difficulty (see useGameMode/useDifficulty
  // defaults), so the prompt can be dismissed. A genuine first-ever visit has no stored mode yet —
  // that player is guided through a deliberate first choice with no way to skip it.
  const [canCloseModePrompt, setCanCloseModePrompt] = useState(() => {
    try {
      return localStorage.getItem('weatherle:mode') !== null;
    } catch {
      return false;
    }
  });
  const [showStats, setShowStats] = useState(false);
  const [showFaq, setShowFaq] = useState(false);
  const [easterEgg, setEasterEgg] = useState<{ won: boolean; city: City; mode: GameMode } | null>(null);
  const [achievementQueue, setAchievementQueue] = useState<Achievement[]>([]);

  const pool = useMemo(() => citiesForDifficulty(difficulty), [difficulty]);

  // Make sure the easter egg cities are reachable in Medium/Hard Unlimited (Easy
  // stays curated and excludes them).
  const unlimitedPool = useMemo(() => {
    if (difficulty === 'easy') return pool;
    const extras = CITIES.filter((c) => EASTER_EGG_CITY_IDS.has(c.id) && !pool.some((p) => p.id === c.id));
    return extras.length > 0 ? [...pool, ...extras] : pool;
  }, [pool, difficulty]);

  const daily = useDailyCity(pool);
  const dailyGame = useGameState(daily.city, daily.dateString, difficulty, handleDailyGameEnd);
  const unlimited = useUnlimitedGame(unlimitedPool, handleUnlimitedGameEnd);

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
  const revealedCityLabel = isOver ? formatCityLabel(activeCity) : null;

  // Records stats and surfaces achievements / easter eggs / the stats modal when a round ends.
  function handleDailyGameEnd(status: 'won' | 'lost', entries: GuessEntry[], city: City) {
    recordResult('daily', difficulty, status === 'won', entries.length, daily.dateString, city, entries);
    const newly = getNewlyUnlocked('daily', difficulty);
    // Delayed so the win/loss banner registers before any achievement toast (and its
    // confetti) appears — otherwise a loss can read as a celebration.
    if (newly.length > 0) setTimeout(() => setAchievementQueue((q) => [...q, ...newly]), 1200);
    if (EASTER_EGG_CITY_IDS.has(city.id)) {
      setEasterEgg({ won: status === 'won', city, mode: 'daily' });
    } else {
      setTimeout(() => setShowStats(true), 1600);
    }
  }

  function handleUnlimitedGameEnd(status: 'won' | 'lost', entries: GuessEntry[], city: City) {
    recordResult('unlimited', difficulty, status === 'won', entries.length, daily.dateString, city, entries);
    const newly = getNewlyUnlocked('unlimited', difficulty);
    if (newly.length > 0) setTimeout(() => setAchievementQueue((q) => [...q, ...newly]), 1200);
    if (EASTER_EGG_CITY_IDS.has(city.id)) {
      setEasterEgg({ won: status === 'won', city, mode: 'unlimited' });
    }
  }

  // Reopens the setup modal mid-game, skipping straight to mode selection — returning
  // players already know the rules, so there's no need to walk them through welcome/rules again.
  function openModeSettings() {
    setModeModalStep('mode');
    setShowModePrompt(true);
  }

  function completeSetup(nextMode: GameMode, nextDifficulty: Difficulty) {
    setMode(nextMode);
    setDifficulty(nextDifficulty);
    setShowModePrompt(false);
    setCanCloseModePrompt(true);
    trackEvent('game_start', { mode: nextMode, difficulty: nextDifficulty });
  }

  return (
    <div className={`${styles.page} ${themeClass} bg-transition`}>
      {showModePrompt && (
        <ModeSelectModal
          onComplete={completeSetup}
          onClose={canCloseModePrompt ? () => setShowModePrompt(false) : undefined}
          initialStep={modeModalStep}
        />
      )}
      {showStats && (
        <StatsModal mode={mode} difficulty={difficulty} dateString={daily.dateString} onClose={() => setShowStats(false)} />
      )}
      {achievementQueue[0] && (
        <AchievementToast
          key={achievementQueue[0].id}
          achievement={achievementQueue[0]}
          onDone={() => setAchievementQueue((q) => q.slice(1))}
        />
      )}
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
      {showFaq && (
        <FaqModal user={user} onSignIn={signInWithGoogle} onSignOut={signOut} onClose={() => setShowFaq(false)} />
      )}

      <div className={styles.header}>
        <span className={styles.modeBadge}>
          {isDaily ? '📅 Daily Challenge' : '♾️ Unlimited'}
        </span>

        <div className={styles.iconRow}>
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
            onClick={openModeSettings}
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
          <button
            type="button"
            className={styles.iconButton}
            aria-label={user ? `Account, rules & FAQ — signed in as ${user.email ?? 'your account'}` : 'About Weatherle, rules & sign in'}
            title={user ? (user.email ?? 'Account') : 'About Weatherle, rules & sign in'}
            onClick={() => setShowFaq(true)}
          >
            ❓
            {user && <span className={styles.signedInDot} aria-hidden="true" />}
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
          onSwitchMode={openModeSettings}
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

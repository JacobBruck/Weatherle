import { useDailyCity } from './hooks/useDailyCity';
import { useWeather } from './hooks/useWeather';
import { useGameState } from './hooks/useGameState';
import { getThemeClassName } from './utils/weatherCodes';
import { WeatherRevealCard } from './components/WeatherRevealCard/WeatherRevealCard';
import { GuessInput } from './components/GuessInput/GuessInput';
import { GuessHistory } from './components/GuessHistory/GuessHistory';
import { GameStatus } from './components/GameStatus/GameStatus';
import styles from './App.module.css';

function App() {
  const { city, dateString } = useDailyCity();
  const { data, status: weatherStatus, error } = useWeather(city, dateString);
  const { entries, status: gameStatus, submitGuess } = useGameState(city, dateString);

  const themeClass = data ? getThemeClassName(data.current.weather_code, data.current.is_day) : 'theme-clear-day';
  const isOver = gameStatus !== 'in-progress';
  const revealedCityLabel = isOver ? `${city.name}, ${city.country}` : null;

  return (
    <div className={`${styles.page} ${themeClass} bg-transition`}>
      <main className={styles.container}>
        <h1 className={styles.title}>Weatherle</h1>
        <p className={styles.subtitle}>Guess the city from its weather.</p>

        <WeatherRevealCard data={data} status={weatherStatus} error={error} revealedCityLabel={revealedCityLabel} />

        <GameStatus status={gameStatus} guessCount={entries.length} targetCity={city} />

        <GuessInput
          onSubmitGuess={submitGuess}
          disabled={isOver}
          guessedCityIds={entries.map((e) => e.city.id)}
          placeholder={isOver ? 'Come back tomorrow for a new city!' : 'Type a city name…'}
        />

        <GuessHistory entries={entries} />
      </main>
    </div>
  );
}

export default App;

import type { City } from '../../types/city';
import type { GameStatus as GameStatusValue } from '../../types/game';
import { MAX_GUESSES } from '../../hooks/useGameState';
import styles from './GameStatus.module.css';

interface GameStatusProps {
  status: GameStatusValue;
  guessCount: number;
  targetCity: City;
}

export function GameStatus({ status, guessCount, targetCity }: GameStatusProps) {
  if (status === 'in-progress') {
    return (
      <p className={styles.status}>
        Guess {guessCount + 1} of {MAX_GUESSES}
      </p>
    );
  }

  if (status === 'won') {
    return (
      <section className={`glass ${styles.banner} ${styles.bannerWon}`} role="status">
        🎉 Solved in {guessCount} {guessCount === 1 ? 'guess' : 'guesses'}!
        <span className={styles.bannerSub}>Come back tomorrow for a new city.</span>
      </section>
    );
  }

  return (
    <section className={`glass ${styles.banner} ${styles.bannerLost}`} role="status">
      😔 Out of guesses — it was {targetCity.name}, {targetCity.country}.
      <span className={styles.bannerSub}>Come back tomorrow for a new city.</span>
    </section>
  );
}

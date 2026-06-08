import type { City } from '../../types/city';
import type { GameStatus as GameStatusValue } from '../../types/game';
import type { GameMode } from '../../hooks/useGameMode';
import { MAX_GUESSES } from '../../hooks/useGameState';
import { useNextCityCountdown } from '../../hooks/useNextCityCountdown';
import styles from './GameStatus.module.css';

interface GameStatusProps {
  status: GameStatusValue;
  guessCount: number;
  targetCity: City;
  mode: GameMode;
  onPlayAgain: () => void;
}

function PlayAgainCountdown() {
  const countdown = useNextCityCountdown();
  return (
    <span className={styles.bannerSub}>
      You can play again tomorrow — new city in <span className={styles.countdown}>{countdown}</span>
    </span>
  );
}

function PlayAgainButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" className={styles.playAgainButton} onClick={onClick}>
      🔄 Play again
    </button>
  );
}

function NextRound({ mode, onPlayAgain }: { mode: GameMode; onPlayAgain: () => void }) {
  return mode === 'daily' ? <PlayAgainCountdown /> : <PlayAgainButton onClick={onPlayAgain} />;
}

export function GameStatus({ status, guessCount, targetCity, mode, onPlayAgain }: GameStatusProps) {
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
        <NextRound mode={mode} onPlayAgain={onPlayAgain} />
      </section>
    );
  }

  return (
    <section className={`glass ${styles.banner} ${styles.bannerLost}`} role="status">
      😔 Out of guesses — it was {targetCity.name}, {targetCity.country}.
      <NextRound mode={mode} onPlayAgain={onPlayAgain} />
    </section>
  );
}

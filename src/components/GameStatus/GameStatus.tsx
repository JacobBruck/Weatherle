import { useState } from 'react';
import type { City } from '../../types/city';
import type { GameStatus as GameStatusValue } from '../../types/game';
import type { GameMode } from '../../hooks/useGameMode';
import type { Difficulty } from '../../hooks/useDifficulty';
import { MAX_GUESSES, type GuessEntry } from '../../hooks/useGameState';
import { useNextCityCountdown } from '../../hooks/useNextCityCountdown';
import { buildShareText } from '../../utils/share';
import styles from './GameStatus.module.css';

interface GameStatusProps {
  status: GameStatusValue;
  guessCount: number;
  targetCity: City;
  mode: GameMode;
  difficulty: Difficulty;
  dateString: string;
  entries: GuessEntry[];
  onPlayAgain: () => void;
  onSwitchMode: () => void;
}

function ShareButton({
  entries,
  mode,
  difficulty,
  status,
  dateString,
}: {
  entries: GuessEntry[];
  mode: GameMode;
  difficulty: Difficulty;
  status: GameStatusValue;
  dateString: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const text = buildShareText(entries, mode, difficulty, status, dateString);
    if (navigator.share) {
      try {
        await navigator.share({ text });
        return;
      } catch {
        // User cancelled or share failed — fall back to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard unavailable — nothing more we can do
    }
  }

  return (
    <button type="button" className={styles.shareButton} onClick={handleShare}>
      {copied ? '✅ Copied!' : '📋 Share results'}
    </button>
  );
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

function ChangeModesButton({ onClick, fullWidth }: { onClick: () => void; fullWidth?: boolean }) {
  return (
    <button type="button" className={fullWidth ? styles.changeModesButtonFull : styles.changeModesButton} onClick={onClick}>
      🔀 Change modes
    </button>
  );
}

function Actions({ mode, onPlayAgain, onSwitchMode }: { mode: GameMode; onPlayAgain: () => void; onSwitchMode: () => void }) {
  if (mode === 'daily') {
    return (
      <>
        <PlayAgainCountdown />
        <ChangeModesButton onClick={onSwitchMode} fullWidth />
      </>
    );
  }

  return (
    <div className={styles.actionsRow}>
      <PlayAgainButton onClick={onPlayAgain} />
      <ChangeModesButton onClick={onSwitchMode} />
    </div>
  );
}

export function GameStatus({ status, guessCount, targetCity, mode, difficulty, dateString, entries, onPlayAgain, onSwitchMode }: GameStatusProps) {
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
        <ShareButton entries={entries} mode={mode} difficulty={difficulty} status={status} dateString={dateString} />
        <Actions mode={mode} onPlayAgain={onPlayAgain} onSwitchMode={onSwitchMode} />
      </section>
    );
  }

  return (
    <section className={`glass ${styles.banner} ${styles.bannerLost}`} role="status">
      😔 Out of guesses — it was {targetCity.name}, {targetCity.country}.
      <ShareButton entries={entries} mode={mode} difficulty={difficulty} status={status} dateString={dateString} />
      <Actions mode={mode} onPlayAgain={onPlayAgain} onSwitchMode={onSwitchMode} />
    </section>
  );
}

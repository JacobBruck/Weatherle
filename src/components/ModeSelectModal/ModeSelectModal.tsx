import { useState } from 'react';
import type { GameMode } from '../../hooks/useGameMode';
import type { Difficulty } from '../../hooks/useDifficulty';
import styles from './ModeSelectModal.module.css';

interface ModeSelectModalProps {
  /** Fires once both choices are made — the only point at which the game actually starts/resumes. */
  onComplete: (mode: GameMode, difficulty: Difficulty) => void;
}

/**
 * A two-step wizard: pick a mode, then a city pool — neither is preselected, so a new
 * player has to make both choices deliberately rather than inheriting silent defaults.
 * Picking the city pool is what closes the modal and lets play continue.
 */
export function ModeSelectModal({ onComplete }: ModeSelectModalProps) {
  const [pendingMode, setPendingMode] = useState<GameMode | null>(null);

  if (pendingMode === null) {
    return (
      <div className={styles.backdrop}>
        <div className={`glass ${styles.modal}`} role="dialog" aria-modal="true" aria-label="Choose a game mode">
          <h2 className={styles.title}>How do you want to play?</h2>

          <div className={styles.howToPlay}>
            <h3 className={styles.howToPlayTitle}>How to play</h3>
            <p className={styles.howToPlayText}>
              Each round reveals today's live weather for a mystery city — temperature, conditions, sunrise/sunset,
              and more. Guess the city in 8 tries or fewer. After each guess we'll tell you how close you are:
              hemisphere, continent, country, distance, direction, and time zone.
            </p>
          </div>

          <div className={styles.options} role="group" aria-label="Game mode">
            <button type="button" className={styles.option} onClick={() => setPendingMode('daily')}>
              <span className={styles.optionIcon} aria-hidden="true">📅</span>
              <span className={styles.optionLabel}>Daily Challenge</span>
              <span className={styles.optionHint}>One mystery city a day, the same for everyone — resets at midnight ET.</span>
            </button>
            <button type="button" className={styles.option} onClick={() => setPendingMode('unlimited')}>
              <span className={styles.optionIcon} aria-hidden="true">♾️</span>
              <span className={styles.optionLabel}>Unlimited</span>
              <span className={styles.optionHint}>Practice with random cities — refresh anytime for a brand-new round.</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.backdrop}>
      <div className={`glass ${styles.modal}`} role="dialog" aria-modal="true" aria-label="Choose a city pool">
        <button type="button" className={styles.backButton} onClick={() => setPendingMode(null)}>
          ‹ Back
        </button>

        <h2 className={styles.title}>Choose your city pool</h2>
        <p className={styles.howToPlayText}>Pick which set of cities you'd like to be quizzed on.</p>

        <div className={styles.difficulty} role="group" aria-label="City pool difficulty">
          <button type="button" className={styles.difficultyOption} onClick={() => onComplete(pendingMode, 'easy')}>
            <span className={styles.difficultyName}>Easy</span>
            <span className={styles.difficultyHint}>~60 world-famous cities</span>
          </button>
          <button type="button" className={styles.difficultyOption} onClick={() => onComplete(pendingMode, 'medium')}>
            <span className={styles.difficultyName}>Medium</span>
            <span className={styles.difficultyHint}>~150 famous &amp; holiday cities</span>
          </button>
          <button type="button" className={styles.difficultyOption} onClick={() => onComplete(pendingMode, 'hard')}>
            <span className={styles.difficultyName}>Hard</span>
            <span className={styles.difficultyHint}>~400 cities worldwide</span>
          </button>
        </div>
      </div>
    </div>
  );
}

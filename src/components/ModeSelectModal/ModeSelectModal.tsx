import type { GameMode } from '../../hooks/useGameMode';
import type { Difficulty } from '../../hooks/useDifficulty';
import styles from './ModeSelectModal.module.css';

interface ModeSelectModalProps {
  onSelect: (mode: GameMode) => void;
  difficulty: Difficulty;
  onDifficultyChange: (difficulty: Difficulty) => void;
}

export function ModeSelectModal({ onSelect, difficulty, onDifficultyChange }: ModeSelectModalProps) {
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

        {/* Mode buttons always render unselected — tapping one (even the mode you're
            already in) re-enters that mode and closes the menu, which is the cue that
            it's clickable rather than a no-op "you're already here" state. */}
        <div className={styles.options} role="group" aria-label="Game mode">
          <button type="button" className={styles.option} onClick={() => onSelect('daily')}>
            <span className={styles.optionIcon} aria-hidden="true">📅</span>
            <span className={styles.optionLabel}>Daily Challenge</span>
            <span className={styles.optionHint}>One mystery city a day, the same for everyone — resets at midnight ET.</span>
          </button>
          <button type="button" className={styles.option} onClick={() => onSelect('unlimited')}>
            <span className={styles.optionIcon} aria-hidden="true">♾️</span>
            <span className={styles.optionLabel}>Unlimited</span>
            <span className={styles.optionHint}>Practice with random cities — refresh anytime for a brand-new round.</span>
          </button>
        </div>

        <div className={styles.difficulty} role="group" aria-label="City pool">
          <button
            type="button"
            className={difficulty === 'easy' ? `${styles.difficultyOption} ${styles.difficultyOptionActive}` : styles.difficultyOption}
            aria-pressed={difficulty === 'easy'}
            onClick={() => onDifficultyChange('easy')}
          >
            <span className={styles.difficultyName}>Easy</span>
            <span className={styles.difficultyHint}>~140 famous &amp; holiday cities</span>
          </button>
          <button
            type="button"
            className={difficulty === 'hard' ? `${styles.difficultyOption} ${styles.difficultyOptionActive}` : styles.difficultyOption}
            aria-pressed={difficulty === 'hard'}
            onClick={() => onDifficultyChange('hard')}
          >
            <span className={styles.difficultyName}>Hard</span>
            <span className={styles.difficultyHint}>~370 cities worldwide</span>
          </button>
        </div>
      </div>
    </div>
  );
}

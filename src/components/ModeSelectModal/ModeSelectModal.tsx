import type { GameMode } from '../../hooks/useGameMode';
import styles from './ModeSelectModal.module.css';

interface ModeSelectModalProps {
  onSelect: (mode: GameMode) => void;
}

export function ModeSelectModal({ onSelect }: ModeSelectModalProps) {
  return (
    <div className={styles.backdrop}>
      <div className={`glass ${styles.modal}`} role="dialog" aria-modal="true" aria-label="Choose a game mode">
        <h2 className={styles.title}>How do you want to play?</h2>
        <div className={styles.options}>
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
      </div>
    </div>
  );
}

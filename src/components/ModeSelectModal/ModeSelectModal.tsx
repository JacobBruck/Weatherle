import React, { useState } from 'react';
import type { GameMode } from '../../hooks/useGameMode';
import type { Difficulty } from '../../hooks/useDifficulty';
import styles from './ModeSelectModal.module.css';

const HINT_CLUES = [
  { emoji: '🌐', label: 'Hemisphere', desc: 'Whether the city is in the Northern or Southern hemisphere.' },
  { emoji: '🌍', label: 'Continent', desc: 'Which continent the city is on.' },
  { emoji: '🏳️', label: 'Country', desc: 'Which country the city belongs to.' },
  { emoji: '🎭', label: 'Vibe', desc: 'City Vibe: Capital, Port City, Tech Hub, Vacation Spot, and more.' },
  { emoji: '👥', label: 'Population', desc: 'City size. ↑↓ arrows show if the target is larger or smaller.' },
  { emoji: '⛰️', label: 'Elevation', desc: 'Altitude above sea level. ↑↓ shows if the target sits higher or lower.' },
  { emoji: '🧭', label: 'Direction', desc: 'Compass arrow pointing from your guess toward the target city.' },
  { emoji: '📍', label: 'Distance', desc: 'Straight-line distance between your guess and the target.' },
];

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
              Guess the hidden city everyday based on a live weather report. Using the clues, your goal is to
              guess the city using as few guesses as possible.
            </p>
            <div className={styles.hintLegend}>
              <span className={styles.hintMatch}>✓ Match</span>
              <span className={styles.hintMiss}>✗ No match</span>
            </div>
            <div className={styles.hintsList}>
              {HINT_CLUES.map(({ emoji, label, desc }) => (
                <React.Fragment key={label}>
                  <div className={styles.hintIcon}>
                    <span className={styles.hintIconEmoji}>{emoji}</span>
                    <span className={styles.hintIconLabel}>{label}</span>
                  </div>
                  <p className={styles.hintDesc}>{desc}</p>
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className={styles.options} role="group" aria-label="Game mode">
            <button type="button" className={styles.option} onClick={() => setPendingMode('daily')}>
              <span className={styles.optionIcon} aria-hidden="true">📅</span>
              <span className={styles.optionLabel}>Daily Challenge</span>
              <span className={styles.optionHint}>One mystery city a day.</span>
            </button>
            <button type="button" className={styles.option} onClick={() => setPendingMode('unlimited')}>
              <span className={styles.optionIcon} aria-hidden="true">♾️</span>
              <span className={styles.optionLabel}>Unlimited</span>
              <span className={styles.optionHint}>Practice with random cities.</span>
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

        <h2 className={styles.title}>Pick your challenge</h2>
        <p className={styles.howToPlayText}>How well do you know the weather around the world?</p>

        <div className={styles.difficulty} role="group" aria-label="City pool difficulty">
          <button type="button" className={styles.difficultyOption} onClick={() => onComplete(pendingMode, 'easy')}>
            <span className={styles.difficultyName}>Easy</span>
            <span className={styles.difficultyHint}>~60 world-famous cities</span>
          </button>
          <button type="button" className={styles.difficultyOption} onClick={() => onComplete(pendingMode, 'medium')}>
            <span className={styles.difficultyName}>Medium</span>
            <span className={styles.difficultyHint}>~150 famous cities &amp; holiday destinations</span>
          </button>
          <button type="button" className={styles.difficultyOption} onClick={() => onComplete(pendingMode, 'hard')}>
            <span className={styles.difficultyName}>Hard</span>
            <span className={styles.difficultyHint}>~500 cities worldwide</span>
          </button>
        </div>
      </div>
    </div>
  );
}

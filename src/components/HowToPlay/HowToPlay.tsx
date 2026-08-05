import React from 'react';
import styles from './HowToPlay.module.css';

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

/** The rules + hint-clue legend, shared by the onboarding wizard and the FAQ page. */
export function HowToPlay() {
  return (
    <div className={styles.howToPlay}>
      <p className={styles.howToPlayText}>
        Guess the hidden city every day based on a live weather report. Using the clues, your goal is to
        guess the city using as few guesses as possible. Tip: type a country (or U.S. state) in the
        guess box to narrow the list to cities in that country.
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
  );
}

import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import type { City } from '../../types/city';
import { SPECIAL_MESSAGES } from '../../data/easterEggs';
import styles from './EasterEggModal.module.css';

interface EasterEggModalProps {
  won: boolean;
  targetCity: City;
  onClose: () => void;
}

export function EasterEggModal({ won, targetCity, onClose }: EasterEggModalProps) {
  const [cracked, setCracked] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCracked(true);
      if (won) {
        confetti({ particleCount: 120, spread: 100, startVelocity: 38, origin: { y: 0.55 } });
      }
    }, 1100);
    return () => clearTimeout(timer);
  }, [won]);

  const special = SPECIAL_MESSAGES[targetCity.id];
  const message = special ? (won ? special.win : special.lose) : (won ? "You got it! 🎉" : "Better luck next time.");

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={`glass ${styles.modal}`} role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">✕</button>

        <div className={`${styles.egg} ${cracked ? styles.cracked : styles.shaking}`}>
          <div className={styles.eggTop} />
          <div className={styles.eggBottom} />
          <div className={`${styles.yolk} ${won ? styles.yolkWin : styles.yolkLose}`}>
            {cracked && <span className={styles.yolkIcon}>{won ? '🎉' : '🥲'}</span>}
          </div>
        </div>

        {cracked && <p className={styles.message}>{message}</p>}
      </div>
    </div>
  );
}

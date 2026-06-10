import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import type { Achievement } from '../../utils/achievements';
import styles from './AchievementToast.module.css';

interface AchievementToastProps {
  achievement: Achievement;
  onDone: () => void;
}

const DISPLAY_MS = 6000;

export function AchievementToast({ achievement, onDone }: AchievementToastProps) {
  useEffect(() => {
    confetti({ particleCount: 70, spread: 75, startVelocity: 35, origin: { y: 0.15 }, ticks: 200 });
    const timer = setTimeout(onDone, DISPLAY_MS);
    return () => clearTimeout(timer);
  }, [achievement.id, onDone]);

  return (
    <div className={`glass ${styles.toast}`} role="status" onClick={onDone}>
      <span className={styles.emoji}>{achievement.emoji}</span>
      <div className={styles.body}>
        <span className={styles.label}>Achievement Unlocked!</span>
        <span className={styles.title}>{achievement.title}</span>
        <p className={styles.desc}>{achievement.description}</p>
      </div>
    </div>
  );
}

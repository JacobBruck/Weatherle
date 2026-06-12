import { useEffect, useState } from 'react';
import { getStats, msUntilMidnightET } from '../../utils/stats';
import { getAchievements } from '../../utils/achievements';
import { useDailyAverage } from '../../hooks/useDailyAverage';
import type { GameMode } from '../../hooks/useGameMode';
import type { Difficulty } from '../../hooks/useDifficulty';
import styles from './StatsModal.module.css';

interface StatsModalProps {
  mode: GameMode;
  difficulty: Difficulty;
  dateString: string;
  onClose: () => void;
}

function useCountdown(): string {
  const [ms, setMs] = useState(msUntilMidnightET);
  useEffect(() => {
    const id = setInterval(() => setMs(msUntilMidnightET()), 1000);
    return () => clearInterval(id);
  }, []);
  const s = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

const MODE_LABELS: Record<GameMode, string> = { daily: 'Daily Challenge', unlimited: 'Unlimited' };
const DIFF_LABELS: Record<Difficulty, string> = { easy: 'Easy', medium: 'Medium', hard: 'Hard' };

type Tab = 'stats' | 'achievements';

export function StatsModal({ mode, difficulty, dateString, onClose }: StatsModalProps) {
  const [tab, setTab] = useState<Tab>('stats');
  const [viewMode, setViewMode] = useState<GameMode>(mode);
  const [viewDiff, setViewDiff] = useState<Difficulty>(difficulty);
  const stats = getStats(viewMode, viewDiff);
  const countdown = useCountdown();
  const dailyAverage = useDailyAverage(dateString, viewDiff, viewMode === 'daily');

  const winRate = stats.gamesPlayed > 0 ? Math.round((stats.wins / stats.gamesPlayed) * 100) : 0;
  const maxDist = Math.max(...stats.guessDistribution, 1);
  const achievements = getAchievements(viewMode, viewDiff);

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={`glass ${styles.modal}`} role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close statistics">✕</button>
        <h2 className={styles.title}>Statistics</h2>

        {/* Statistics / Achievements tabs */}
        <div className={styles.selectorRow}>
          <button
            className={`${styles.selectorBtn} ${tab === 'stats' ? styles.selectorActive : ''}`}
            onClick={() => setTab('stats')}
          >
            Statistics
          </button>
          <button
            className={`${styles.selectorBtn} ${tab === 'achievements' ? styles.selectorActive : ''}`}
            onClick={() => setTab('achievements')}
          >
            Achievements
          </button>
        </div>

        {/* Mode / difficulty selectors */}
        <div className={styles.selectors}>
          <div className={styles.selectorRow}>
            {(['daily', 'unlimited'] as GameMode[]).map((m) => (
              <button
                key={m}
                className={`${styles.selectorBtn} ${viewMode === m ? styles.selectorActive : ''}`}
                onClick={() => setViewMode(m)}
              >
                {MODE_LABELS[m]}
              </button>
            ))}
          </div>
          <div className={styles.selectorRow}>
            {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
              <button
                key={d}
                className={`${styles.selectorBtn} ${viewDiff === d ? styles.selectorActive : ''}`}
                onClick={() => setViewDiff(d)}
              >
                {DIFF_LABELS[d]}
              </button>
            ))}
          </div>
        </div>

        {tab === 'stats' ? (
          <>
            {/* Stat boxes */}
            <div className={styles.statRow}>
              {viewMode === 'daily' && (
                <>
                  <div className={styles.statBox}>
                    <span className={styles.statNum}>{stats.currentStreak}</span>
                    <span className={styles.statLabel}>🔥 Streak</span>
                  </div>
                  <div className={styles.statBox}>
                    <span className={styles.statNum}>{stats.bestStreak}</span>
                    <span className={styles.statLabel}>⭐ Best Streak</span>
                  </div>
                </>
              )}
              <div className={styles.statBox}>
                <span className={styles.statNum}>{stats.gamesPlayed}</span>
                <span className={styles.statLabel}>Played</span>
              </div>
              <div className={styles.statBox}>
                <span className={styles.statNum}>{winRate}%</span>
                <span className={styles.statLabel}>Win Rate</span>
              </div>
              <div className={styles.statBox}>
                <span className={styles.statNum}>{stats.bestGuesses ?? '—'}</span>
                <span className={styles.statLabel}>🏆 Best Game</span>
              </div>
            </div>

            {/* Today's cross-player average (daily mode only) */}
            {viewMode === 'daily' && dailyAverage && dailyAverage.avgGuesses !== null && (
              <div className={styles.dailyAverage}>
                📊 Players today are averaging {dailyAverage.avgGuesses.toFixed(1)} guesses
              </div>
            )}

            {/* Guess distribution */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Guess Distribution</h3>
              {stats.guessDistribution.map((count, i) => (
                <div key={i} className={styles.distRow}>
                  <span className={styles.distLabel}>{i + 1}</span>
                  <div className={styles.distBarWrap}>
                    <div
                      className={styles.distBar}
                      style={{ width: `${Math.max((count / maxDist) * 100, count > 0 ? 8 : 2)}%` }}
                    >
                      {count > 0 && <span className={styles.distCount}>{count}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Countdown (daily only) */}
            {viewMode === 'daily' && (
              <div className={styles.countdown}>
                <span className={styles.countdownLabel}>Next Daily Challenge</span>
                <span className={styles.countdownTime}>{countdown}</span>
              </div>
            )}
          </>
        ) : (
          <div className={styles.achievementsList}>
            {achievements.map((a) => (
              <div key={a.id} className={`${styles.achievement} ${a.unlocked ? styles.achievementUnlocked : ''}`}>
                <span className={styles.achievementEmoji}>{a.emoji}</span>
                <div className={styles.achievementBody}>
                  <div className={styles.achievementTitleRow}>
                    <span className={styles.achievementTitle}>{a.title}</span>
                    {a.unlocked ? (
                      <span className={styles.achievementCheck}>✓</span>
                    ) : (
                      <span className={styles.achievementProgress}>
                        {a.target > 1 ? `${a.current}/${a.target}` : 'Locked'}
                      </span>
                    )}
                  </div>
                  <p className={styles.achievementDesc}>{a.description}</p>
                  {a.target > 1 && (
                    <div className={styles.achievementBarWrap}>
                      <div
                        className={styles.achievementBar}
                        style={{ width: `${Math.max((a.current / a.target) * 100, a.current > 0 ? 4 : 0)}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

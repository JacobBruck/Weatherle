import { useState } from 'react';
import type { GameMode } from '../../hooks/useGameMode';
import type { Difficulty } from '../../hooks/useDifficulty';
import { useModalFocusTrap } from '../../hooks/useModalFocusTrap';
import { HowToPlay } from '../HowToPlay/HowToPlay';
import styles from './ModeSelectModal.module.css';

export type ModeModalStep = 'welcome' | 'rules' | 'mode' | 'difficulty';
type Step = ModeModalStep;

const STEP_ORDER: Step[] = ['welcome', 'rules', 'mode', 'difficulty'];

function prevStep(step: Step): Step {
  const index = STEP_ORDER.indexOf(step);
  return STEP_ORDER[index - 1];
}

interface ModeSelectModalProps {
  /** Fires once both choices are made — the only point at which the game actually starts/resumes. */
  onComplete: (mode: GameMode, difficulty: Difficulty) => void;
  /** When provided, a close (✕) button and backdrop click dismiss the modal without changing anything. */
  onClose?: () => void;
  /** Which screen to open on — defaults to the welcome screen for the first-load flow. */
  initialStep?: Step;
}

/**
 * A four-step wizard: welcome, then how-to-play rules, then game mode, then city pool.
 * Each screen gets the full modal to itself so rules don't have to share space (and scroll
 * room) with the mode buttons below them. Picking the city pool is what closes the modal
 * and lets play start/resume.
 */
export function ModeSelectModal({ onComplete, onClose, initialStep = 'welcome' }: ModeSelectModalProps) {
  const [step, setStep] = useState<Step>(initialStep);
  const [pendingMode, setPendingMode] = useState<GameMode | null>(null);
  const modalRef = useModalFocusTrap<HTMLDivElement>(onClose);

  function chooseMode(mode: GameMode) {
    setPendingMode(mode);
    setStep('difficulty');
  }

  // Only show "‹ Back" once we've actually navigated forward from wherever this
  // modal opened — there's nothing to go back to on the very first screen shown.
  const canGoBack = step !== initialStep;

  return (
    <div className={styles.backdrop} onClick={() => onClose?.()}>
      <div
        ref={modalRef}
        className={`glass ${styles.modal}`}
        role="dialog"
        aria-modal="true"
        aria-label="Game setup"
        onClick={(e) => e.stopPropagation()}
      >
        {onClose && (
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
            ✕
          </button>
        )}

        {step === 'welcome' && (
          <>
            <h1 className={styles.welcomeTitle}>Weatherle</h1>
            <p className={styles.welcomeTagline}>Guess the city from its live weather.</p>
            <button type="button" className={styles.primaryButton} onClick={() => setStep('rules')}>
              Get started
            </button>
          </>
        )}

        {step === 'rules' && (
          <>
            {canGoBack && (
              <button type="button" className={styles.backButton} onClick={() => setStep(prevStep(step))}>
                ‹ Back
              </button>
            )}
            <h2 className={styles.title}>How to play</h2>
            <HowToPlay />
            <button type="button" className={styles.primaryButton} onClick={() => setStep('mode')}>
              Continue
            </button>
          </>
        )}

        {step === 'mode' && (
          <>
            {canGoBack && (
              <button type="button" className={styles.backButton} onClick={() => setStep(prevStep(step))}>
                ‹ Back
              </button>
            )}

            <h2 className={styles.title}>How do you want to play?</h2>

            <div className={styles.options} role="group" aria-label="Game mode">
              <button type="button" className={styles.option} onClick={() => chooseMode('daily')}>
                <span className={styles.optionIcon} aria-hidden="true">📅</span>
                <span className={styles.optionLabel}>Daily Challenge</span>
                <span className={styles.optionHint}>One mystery city a day.</span>
              </button>
              <button type="button" className={styles.option} onClick={() => chooseMode('unlimited')}>
                <span className={styles.optionIcon} aria-hidden="true">♾️</span>
                <span className={styles.optionLabel}>Unlimited</span>
                <span className={styles.optionHint}>Practice with random cities.</span>
              </button>
            </div>
          </>
        )}

        {step === 'difficulty' && pendingMode && (
          <>
            {canGoBack && (
              <button type="button" className={styles.backButton} onClick={() => setStep(prevStep(step))}>
                ‹ Back
              </button>
            )}

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
          </>
        )}
      </div>
    </div>
  );
}

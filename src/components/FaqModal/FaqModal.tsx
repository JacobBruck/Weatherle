import type { User } from '@supabase/supabase-js';
import { useModalFocusTrap } from '../../hooks/useModalFocusTrap';
import { HowToPlay } from '../HowToPlay/HowToPlay';
import styles from './FaqModal.module.css';

interface FaqModalProps {
  user: User | null;
  onSignIn: () => void;
  onSignOut: () => void;
  onClose: () => void;
}

function GoogleIcon() {
  return (
    <svg className={styles.googleIcon} width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.617z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" />
      <path fill="#FBBC05" d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.332z" />
      <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 6.69C4.672 4.564 6.656 3.58 9 3.58z" />
    </svg>
  );
}

/** Combined "about + rules + account" page — reached from the single header icon that
 * replaces the old standalone login button. */
export function FaqModal({ user, onSignIn, onSignOut, onClose }: FaqModalProps) {
  const modalRef = useModalFocusTrap<HTMLDivElement>(onClose);

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div
        ref={modalRef}
        className={`glass ${styles.modal}`}
        role="dialog"
        aria-modal="true"
        aria-label="About Weatherle"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
          ✕
        </button>

        <h2 className={styles.title}>About Weatherle</h2>
        <p className={styles.description}>No maps, no names — just the forecast.</p>

        <h3 className={styles.sectionTitle}>How to play</h3>
        <HowToPlay />

        <h3 className={styles.sectionTitle}>Account</h3>
        <div className={styles.account}>
          {user ? (
            <>
              {user.email && <span className={styles.accountEmail}>{user.email}</span>}
              <button type="button" className={styles.signOutButton} onClick={onSignOut}>
                Sign out
              </button>
            </>
          ) : (
            <>
              <p className={styles.accountHint}>Sign in to save your stats and track them across devices.</p>
              <button type="button" className={styles.googleButton} onClick={onSignIn}>
                <GoogleIcon />
                Sign in with Google
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

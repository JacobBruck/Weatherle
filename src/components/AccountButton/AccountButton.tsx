import { useState } from 'react';
import type { User } from '@supabase/supabase-js';
import appStyles from '../../App.module.css';
import styles from './AccountButton.module.css';

interface AccountButtonProps {
  user: User | null;
  onSignIn: () => void;
  onSignOut: () => void;
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

export function AccountButton({ user, onSignIn, onSignOut }: AccountButtonProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  if (!user) {
    return (
      <div className={styles.menuWrap}>
        <button
          type="button"
          className={appStyles.iconButton}
          aria-label="Sign in to save your stats"
          title="Sign in to save your stats"
          onClick={() => setMenuOpen((open) => !open)}
        >
          👤
        </button>
        {menuOpen && (
          <div className={`glass ${styles.menu}`}>
            <button
              type="button"
              className={styles.googleButton}
              onClick={() => {
                setMenuOpen(false);
                onSignIn();
              }}
            >
              <GoogleIcon />
              Sign in with Google
            </button>
          </div>
        )}
      </div>
    );
  }

  const avatarUrl = user.user_metadata?.avatar_url as string | undefined;

  return (
    <div className={styles.menuWrap}>
      <button
        type="button"
        className={appStyles.iconButton}
        aria-label="Account menu"
        title={user.email ?? 'Account'}
        onClick={() => setMenuOpen((open) => !open)}
      >
        {avatarUrl ? <img className={styles.avatar} src={avatarUrl} alt="" /> : '👤'}
      </button>
      {menuOpen && (
        <div className={`glass ${styles.menu}`}>
          {user.email && <span className={styles.menuEmail}>{user.email}</span>}
          <button
            type="button"
            className={styles.signOutButton}
            onClick={() => {
              setMenuOpen(false);
              onSignOut();
            }}
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}

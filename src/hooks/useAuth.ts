import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../utils/supabaseClient';
import { hydrateStatsFromSupabase, migrateLocalStatsToSupabase } from '../utils/stats';

interface AuthState {
  user: User | null;
  /** True until the initial session check resolves. */
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

/**
 * Pulls remote stats down first (in case this device/browser is behind), then pushes
 * local stats up only for (mode, difficulty) pairs Supabase has never seen — order
 * matters so a brand-new signed-in user's local progress isn't shadowed by an empty
 * remote read happening after the push.
 */
async function syncStatsWithSupabase(userId: string): Promise<void> {
  await hydrateStatsFromSupabase(userId);
  await migrateLocalStatsToSupabase(userId);
}

/**
 * Wraps Supabase auth session state. When Supabase isn't configured
 * (`supabase` is null), reports a signed-out state and no-op actions —
 * the rest of the app keeps working entirely on localStorage.
 */
export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(supabase !== null);

  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
      if (data.session?.user) void syncStatsWithSupabase(data.session.user.id);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) void syncStatsWithSupabase(session.user.id);
    });

    return () => subscription.subscription.unsubscribe();
  }, []);

  async function signInWithGoogle() {
    if (!supabase) return;
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + import.meta.env.BASE_URL },
    });
  }

  async function signOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
  }

  return { user, loading, signInWithGoogle, signOut };
}

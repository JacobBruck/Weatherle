import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * `null` until VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are configured — the app
 * falls back to localStorage-only stats in that case, so Supabase is fully optional.
 */
export const supabase: SupabaseClient | null = url && anonKey ? createClient(url, anonKey) : null;

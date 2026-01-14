import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Read environment variables (do NOT force-cast)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Optional demo mode flag
const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true';

/**
 * Supabase client
 *
 * - Available when env vars exist and demo mode is disabled
 * - Null in demo mode or when env vars are missing
 */
let supabaseInstance: SupabaseClient | null = null;

try {
  if (!isDemoMode && supabaseUrl && supabaseAnonKey) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }
} catch (error) {
  console.warn('Supabase client initialization failed, using mock data:', error);
  supabaseInstance = null;
}

export const supabase = supabaseInstance;

/**
 * Helper flag to check if backend is available
 */
export const isBackendAvailable = Boolean(supabase);

import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

let supabase: SupabaseClient | null = null;

/**
 * Get the Supabase client instance (singleton pattern)
 * Returns null if environment variables are not configured
 */
export function getSupabaseClient(): SupabaseClient | null {
  // Return null if environment variables not configured
  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  // Create singleton instance
  if (!supabase) {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  }

  return supabase;
}

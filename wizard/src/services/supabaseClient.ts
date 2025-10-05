import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseClient: SupabaseClient | null = null;

/**
 * Get or create a Supabase client instance
 * Returns null if environment variables are not configured
 */
export function getSupabaseClient(): SupabaseClient | null {
  // Return existing client if already initialized
  if (supabaseClient) {
    return supabaseClient;
  }

  // Check if environment variables are configured
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  // Return null if not configured (graceful degradation)
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase not configured - usage tracking disabled');
    return null;
  }

  // Create and cache the client
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  return supabaseClient;
}

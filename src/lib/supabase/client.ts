import { createBrowserClient } from '@supabase/ssr';
import { env, isSupabaseConfigured } from '@/lib/env';

// Using untyped client to avoid strict type checking issues
// until proper Supabase types are generated
export function createClient() {
  if (!isSupabaseConfigured() || !env) {
    // Return a mock client for development without Supabase
    return createBrowserClient(
      'http://localhost:54321',
      'mock-key-for-development'
    );
  }

  return createBrowserClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

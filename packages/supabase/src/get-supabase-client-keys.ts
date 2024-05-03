import { z } from 'zod';

/**
 * Returns and validates the Supabase client keys from the environment.
 */
export function getSupabaseClientKeys() {
  return z
    .object({
      url: z.string().min(1),
      anonKey: z.string().min(1),
    })
    .parse({
      url: process.env.REMIX_PUBLIC_SUPABASE_URL,
      anonKey: process.env.REMIX_PUBLIC_SUPABASE_ANON_KEY,
    });
}

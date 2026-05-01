import { createBrowserClient } from "@supabase/ssr";

/**
 * Create a Supabase client for Client Components.
 * Safe to call multiple times — the SDK deduplicates internally.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}

/**
 * EchoSoul — Supabase browser client
 *
 * This client uses only the PUBLIC anon key.
 * It is safe to use in browser (client) components.
 * NEVER import the service-role key here.
 *
 * Security: RLS policies on the database enforce access control.
 * The anon key alone cannot bypass RLS.
 */
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. " +
        "Copy .env.example to .env.local and fill in your Supabase project credentials."
    );
  }

  return createBrowserClient(url, anonKey);
}

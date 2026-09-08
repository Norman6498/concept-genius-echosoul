/**
 * EchoSoul — Supabase server client
 *
 * This module exports two server-side Supabase clients:
 *
 * 1. createServerClient() — uses the ANON key + user session cookies.
 *    RLS policies apply. Use for most server-side operations.
 *
 * 2. createServiceClient() — uses the SERVICE ROLE key.
 *    Bypasses RLS. Use ONLY for:
 *    - Database migrations
 *    - Admin/background jobs
 *    - Corpus ingestion (literature)
 *    - Audit event writes
 *    NEVER use in API routes that receive untrusted user input without
 *    explicit, validated, server-side authorization checks.
 *
 * SECURITY: Neither client is ever sent to the browser.
 * This file must only be imported from:
 *   - src/app/api/**
 *   - Server components
 *   - Next.js middleware
 *   - scripts/**
 */
import { createServerClient as createSSRServerClient, type CookieOptions } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(
      `Missing required server environment variable: ${key}. ` +
        "See docs/ENVIRONMENT.md for setup instructions."
    );
  }
  return value;
}

/**
 * Creates a Supabase client that respects the current user's session.
 * RLS policies apply. Safe for most server-side API route usage.
 */
export async function createServerClient() {
  const cookieStore = await cookies();
  const url = getRequiredEnv("NEXT_PUBLIC_SUPABASE_URL");
  const anonKey = getRequiredEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");

  return createSSRServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: Array<{ name: string; value: string; options: CookieOptions }>) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Called from a Server Component — cookie mutation is intentionally
          // handled by the middleware instead.
        }
      },
    },
  });
}

/**
 * Creates a Supabase client with the service-role key.
 * BYPASSES RLS. Use only for privileged server-side operations.
 * Never expose this client or its key to the browser.
 */
export function createServiceClient() {
  const url = getRequiredEnv("NEXT_PUBLIC_SUPABASE_URL");
  const serviceRoleKey = getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY");

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

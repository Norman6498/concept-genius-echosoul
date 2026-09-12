import { NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
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
              // Server component context
            }
          },
        },
      }
    );

    const { data: { session } } = await supabase.auth.exchangeCodeForSession(code);
    if (session?.user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("onboarding_completed, onboarding_step")
        .eq("id", session.user.id)
        .maybeSingle();

      if (profile?.onboarding_completed === true) {
        return NextResponse.redirect(`${origin}/app`);
      }
      return NextResponse.redirect(`${origin}/onboarding`);
    }
  }

  // Fallback redirect
  return NextResponse.redirect(`${origin}/login`);
}

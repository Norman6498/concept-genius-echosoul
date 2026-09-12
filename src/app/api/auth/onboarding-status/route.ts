import { NextResponse } from "next/server";
import { createServerClient, createServiceClient } from "@/lib/supabase/server";
import crypto from "crypto";

export async function GET(req: Request) {
  const requestId = crypto.randomUUID();
  const startTime = Date.now();

  try {
    const serverClient = await createServerClient();
    const {
      data: { user },
      error: authError,
    } = await serverClient.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({
        authenticated: false,
        userId: null,
        onboardingCompleted: false,
        onboardingStep: 1,
        displayName: null,
      });
    }

    // Masked identifier for safe diagnostic logging (never log plain tokens or sensitive data)
    const hashedUserId = crypto
      .createHash("sha256")
      .update(user.id)
      .digest("hex")
      .slice(0, 12);

    // Fetch authoritative profile using server client (enforcing RLS with user session)
    const { data: profile, error: profileError } = await serverClient
      .from("profiles")
      .select("id, display_name, full_name, onboarding_completed, onboarding_step")
      .eq("id", user.id)
      .maybeSingle();

    let resolvedProfile = profile;

    // Resilient fallback with service client if profile trigger had race on signup
    if (!resolvedProfile && !profileError) {
      const serviceClient = createServiceClient();
      const { data: serviceProfile } = await serviceClient
        .from("profiles")
        .select("id, display_name, full_name, onboarding_completed, onboarding_step")
        .eq("id", user.id)
        .maybeSingle();

      if (serviceProfile) {
        resolvedProfile = serviceProfile;
      } else {
        // Automatically ensure initial profile row exists
        const { data: insertedProfile } = await serviceClient
          .from("profiles")
          .upsert({
            id: user.id,
            onboarding_step: 1,
            onboarding_completed: false,
          })
          .select("id, display_name, full_name, onboarding_completed, onboarding_step")
          .single();
        resolvedProfile = insertedProfile;
      }
    }

    const onboardingCompleted = resolvedProfile?.onboarding_completed === true;
    const onboardingStep = resolvedProfile?.onboarding_step ?? 1;
    const displayName = resolvedProfile?.display_name || resolvedProfile?.full_name || null;
    const durationMs = Date.now() - startTime;

    // Safe debugging log with zero sensitive tokens
    if (process.env.NODE_ENV !== "test") {
      console.log(
        JSON.stringify({
          event: "AUTH_ONBOARDING_STATUS_RESOLVED",
          requestId,
          userHash: `usr_${hashedUserId}`,
          onboardingCompleted,
          onboardingStep,
          profileFound: Boolean(resolvedProfile),
          durationMs,
        })
      );
    }

    return NextResponse.json({
      authenticated: true,
      userId: user.id,
      onboardingCompleted,
      onboardingStep,
      displayName,
    });
  } catch (err) {
    console.error(`[${requestId}] Error resolving onboarding status:`, (err as Error).message);
    return NextResponse.json(
      {
        error: "Failed to resolve authoritative onboarding state",
        authenticated: false,
        onboardingCompleted: false,
      },
      { status: 500 }
    );
  }
}

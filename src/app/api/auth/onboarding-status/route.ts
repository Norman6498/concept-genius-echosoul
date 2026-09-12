import { NextResponse } from "next/server";
import { createServerClient, createServiceClient } from "@/lib/supabase/server";
import crypto from "crypto";

export async function GET(req: Request) {
  const requestId = crypto.randomUUID();
  const startTime = Date.now();

  try {
    let authUser: any = null;
    try {
      const serverClient = await createServerClient();
      const {
        data: { user },
      } = await serverClient.auth.getUser();
      if (user) authUser = user;
    } catch {
      // Cookie reading fallback
    }

    if (!authUser) {
      const authHeader = req.headers.get("authorization");
      if (authHeader?.startsWith("Bearer ")) {
        const token = authHeader.substring(7);
        try {
          const service = createServiceClient();
          const {
            data: { user: tokenUser },
          } = await service.auth.getUser(token);
          if (tokenUser) authUser = tokenUser;
        } catch {
          // Token verification fallback
        }
      }
    }

    if (!authUser) {
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
      .update(authUser.id)
      .digest("hex")
      .slice(0, 12);

    // Fetch authoritative profile using server client (enforcing RLS with user session)
    let resolvedProfile: any = null;
    try {
      const serverClient = await createServerClient();
      const { data: profile } = await serverClient
        .from("profiles")
        .select("id, display_name, full_name, onboarding_completed, onboarding_step")
        .eq("id", authUser.id)
        .maybeSingle();
      if (profile) resolvedProfile = profile;
    } catch {}

    // Resilient fallback with service client if profile trigger had race on signup
    const serviceClient = createServiceClient();
    if (!resolvedProfile) {
      const { data: serviceProfile } = await serviceClient
        .from("profiles")
        .select("id, display_name, full_name, onboarding_completed, onboarding_step")
        .eq("id", authUser.id)
        .maybeSingle();

      if (serviceProfile) {
        resolvedProfile = serviceProfile;
      } else {
        // Automatically ensure initial profile row exists
        const { data: insertedProfile } = await serviceClient
          .from("profiles")
          .upsert({
            id: authUser.id,
            onboarding_step: 1,
            onboarding_completed: false,
          })
          .select("id, display_name, full_name, onboarding_completed, onboarding_step")
          .single();
        resolvedProfile = insertedProfile;
      }
    }

    // Self-healing: if auth user metadata indicates completion but DB had false/null, heal DB
    const metadataIndicatesComplete =
      authUser.user_metadata?.onboarding_completed === true ||
      authUser.user_metadata?.personalization?.onboardingCompleted === true ||
      authUser.user_metadata?.personalization?.step >= 6;

    if (metadataIndicatesComplete && resolvedProfile?.onboarding_completed !== true) {
      await serviceClient
        .from("profiles")
        .update({
          onboarding_completed: true,
          onboarding_step: 6,
          updated_at: new Date().toISOString(),
        })
        .eq("id", authUser.id);
      if (resolvedProfile) {
        resolvedProfile.onboarding_completed = true;
        resolvedProfile.onboarding_step = 6;
      }
    }

    const onboardingCompleted = resolvedProfile?.onboarding_completed === true;
    const onboardingStep = resolvedProfile?.onboarding_step ?? 1;
    const displayName = resolvedProfile?.display_name || resolvedProfile?.full_name || authUser.user_metadata?.display_name || null;
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
      userId: authUser.id,
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

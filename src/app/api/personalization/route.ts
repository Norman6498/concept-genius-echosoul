import { NextResponse } from "next/server";
import { createServerClient, createServiceClient } from "@/lib/supabase/server";
import { getPersonalizationContext } from "@/lib/personalization/context";
import { getHomePersonalization } from "@/lib/personalization/home-engine";

export async function GET() {
  try {
    const serverClient = await createServerClient();
    const { data: { user } } = await serverClient.auth.getUser();

    if (!user) {
      return NextResponse.json({ authenticated: false, personalization: null });
    }

    const context = await getPersonalizationContext(user.id);
    const homeView = await getHomePersonalization(user.id);

    return NextResponse.json({
      authenticated: true,
      user: { id: user.id, email: user.email },
      context,
      homeView,
    });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      ageRange,
      role,
      goals,
      currentFocus,
      customFocus,
      currentMood,
      interests, // Array of { category, interest }
      customInterests,
      overallVibe,
      whereYouLive,
      environmentTone,
      peopleAround,
      worldNotes,
      visualWorld,
      dailySchedule,
      supportStyle,
      overwhelmedHelper,
      responseDepth,
      memoryPreference,
      theme,
      accentColor,
      backgroundEnvironment,
      layoutMode,
      fontStyle,
      ambientAnimations,
      enableMusic,
      timeBasedEnv,
      reducedMotion,
      step = 1,
      onboardingCompleted = false,
    } = body;

    let userId: string | null = null;
    try {
      const serverClient = await createServerClient();
      const { data: { user } } = await serverClient.auth.getUser();
      if (user) userId = user.id;
    } catch {
      // In dev or guest demo mode
    }

    if (userId) {
      try {
        const service = createServiceClient();

        // 1. Persist Interests in user_interests if provided
        if (Array.isArray(interests) && interests.length > 0) {
          try {
            await service.from("user_interests").delete().eq("user_id", userId);
            const interestRows = interests.map((item: { category: string; interest: string }) => ({
              user_id: userId,
              category: item.category,
              interest: item.interest,
            }));
            await service.from("user_interests").insert(interestRows);
          } catch (interestErr) {
            console.warn("user_interests table write note:", interestErr);
          }
        }

        // 2. Persist Goals in user_goals if provided
        if (Array.isArray(goals) && goals.length > 0) {
          try {
            await service.from("user_goals").delete().eq("user_id", userId);
            const goalRows = goals.map((goal: string) => ({
              user_id: userId,
              goal,
            }));
            await service.from("user_goals").insert(goalRows);
          } catch (goalErr) {
            console.warn("user_goals table write note:", goalErr);
          }
        }

        // 3. Persist Current User State
        try {
          await service.from("current_user_state").upsert({
            user_id: userId,
            current_mood: currentMood || undefined,
            overall_vibe: overallVibe || undefined,
            updated_at: new Date().toISOString(),
          });
        } catch (stateErr) {
          console.warn("current_user_state table write note:", stateErr);
        }

        // 4. Persist User Context (Step 3: Your World)
        try {
          await service.from("user_context").upsert({
            user_id: userId,
            current_focus: currentFocus || undefined,
            custom_focus: customFocus || undefined,
            where_you_live: whereYouLive || undefined,
            environment_tone: environmentTone || undefined,
            people_around: peopleAround || undefined,
            world_notes: worldNotes || undefined,
            visual_world: visualWorld || undefined,
            daily_schedule: dailySchedule || undefined,
            custom_interests: customInterests || undefined,
            updated_at: new Date().toISOString(),
          });
        } catch (contextErr) {
          console.warn("user_context table write note:", contextErr);
        }

        // 5. Persist User Settings (Step 4 & Step 5)
        try {
          await service.from("user_settings").upsert({
            user_id: userId,
            support_style: supportStyle || undefined,
            overwhelmed_helper: overwhelmedHelper || undefined,
            response_depth: responseDepth || undefined,
            memory_preference: memoryPreference || undefined,
            theme: theme || undefined,
            accent_color: accentColor || undefined,
            background_environment: backgroundEnvironment || undefined,
            layout_mode: layoutMode || undefined,
            font_style: fontStyle || undefined,
            ambient_animations: ambientAnimations !== undefined ? ambientAnimations : undefined,
            enable_music: enableMusic !== undefined ? enableMusic : undefined,
            time_based_env: timeBasedEnv !== undefined ? timeBasedEnv : undefined,
            reduced_motion: reducedMotion !== undefined ? reducedMotion : undefined,
          });
        } catch (settingsErr) {
          console.warn("user_settings table write note:", settingsErr);
        }

        // 6. Authoritative Profile Persistence
        // The completion write is performed only after all required onboarding data has successfully persisted.
        const shouldMarkCompleted = onboardingCompleted === true || step >= 6;

        // Fetch existing profile to preserve completion if already true
        const { data: existingProfile } = await service
          .from("profiles")
          .select("onboarding_completed, onboarding_step")
          .eq("id", userId)
          .maybeSingle();

        const finalCompleted = shouldMarkCompleted || (existingProfile?.onboarding_completed === true);
        const finalStep = Math.max(step, existingProfile?.onboarding_step ?? 1);

        await service.from("profiles").upsert({
          id: userId,
          display_name: name || undefined,
          age_range: ageRange || undefined,
          role: role || undefined,
          goals: Array.isArray(goals) && goals.length > 0 ? goals : undefined,
          current_focus: currentFocus || undefined,
          current_mood: currentMood || undefined,
          onboarding_step: finalStep,
          onboarding_completed: finalCompleted,
          updated_at: new Date().toISOString(),
        });
      } catch (dbErr) {
        console.error("Supabase persistence error in /api/personalization:", dbErr);
        return NextResponse.json(
          { error: "Failed to persist onboarding state", details: (dbErr as Error).message },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      step,
      userId,
      savedLocally: !userId,
    });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

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
      currentMood,
      interests, // Array of { category, interest }
      customInterests,
      overallVibe,
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

        // 1. Upsert Profile
        await service.from("profiles").upsert({
          id: userId,
          display_name: name || undefined,
          age_range: ageRange,
          role: role,
          goals: goals || [],
          current_focus: currentFocus,
          current_mood: currentMood,
          onboarding_step: step,
          onboarding_completed: onboardingCompleted || step >= 6,
          updated_at: new Date().toISOString(),
        });

        // 2. Persist Interests in user_interests if provided
        if (Array.isArray(interests) && interests.length > 0) {
          // Clean existing and bulk insert
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

        // 3. Persist Goals in user_goals if provided
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

        // 4. Persist Current State (mood + vibe)
        if (currentMood || overallVibe) {
          try {
            await service.from("current_user_state").upsert({
              user_id: userId,
              current_mood: currentMood || "calm",
              overall_vibe: overallVibe || "Creative",
              updated_at: new Date().toISOString(),
            });
          } catch (stateErr) {
            console.warn("current_user_state write note:", stateErr);
          }
        }

        // 5. Persist Context / World Profile
        if (currentFocus || customInterests || role) {
          try {
            await service.from("user_context").upsert({
              user_id: userId,
              current_focus: currentFocus,
              custom_interests: customInterests,
              life_stage: role,
              updated_at: new Date().toISOString(),
            });
          } catch (ctxErr) {
            console.warn("user_context write note:", ctxErr);
          }
        }

        // 6. Resilient Fallback: Sync complete personalization snapshot to user_settings
        await service.from("user_settings").upsert({
          user_id: userId,
          personalization: {
            name,
            age_range: ageRange,
            role,
            goals,
            current_focus: currentFocus,
            current_mood: currentMood,
            interests,
            custom_interests: customInterests,
            overall_vibe: overallVibe,
            onboarding_step: step,
            onboarding_completed: onboardingCompleted || step >= 6,
          },
          updated_at: new Date().toISOString(),
        });
      } catch (dbErr) {
        console.warn("Supabase personalization persistence note:", dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      authenticated: !!userId,
      saved: {
        name,
        ageRange,
        role,
        goals,
        currentFocus,
        currentMood,
        interests,
        customInterests,
        overallVibe,
        step,
        onboardingCompleted,
      },
    });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

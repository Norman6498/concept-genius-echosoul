import { createServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { HomeViewModel } from "@/ai/contracts/home-view-model";

/**
 * GET /api/home
 * 
 * Builds and returns the personalized HomeViewModel for the authenticated user.
 * 
 * - Authentication: Supabase server client (never trusts client-provided user_id)
 * - Authorization: RLS enforced at DB level
 * - Returns: HomeViewModel JSON
 */
export async function GET() {
  try {
    const supabase = await createServerClient();

    // Get authenticated user — never trust browser-provided user_id
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch user profile from Supabase (RLS ensures user sees only their own data)
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    // Fetch user settings
    const { data: settings } = await supabase
      .from("user_settings")
      .select("*")
      .eq("user_id", user.id)
      .single();

    // Fetch recent conversations (last 3)
    const { data: conversations } = await supabase
      .from("sessions")
      .select("id, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(3);

    // Fetch recent moments (last 3)
    const { data: moments } = await supabase
      .from("moments")
      .select("id, title, created_at, image_url")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(3);

    // Fetch active goals
    const { data: goals } = await supabase
      .from("goals")
      .select("id, title, status")
      .eq("user_id", user.id)
      .eq("status", "active")
      .limit(3);

    // Build personalized recommendations based on onboarding data
    const interests: string[] = profile?.interests ?? [];
    const focus = profile?.current_focus ?? "general";
    const visualWorld = settings?.visual_world ?? "mountain_calm";
    const theme = settings?.theme ?? "midnight_soul";

    // Determine greeting time
    const hour = new Date().getHours();
    const timeOfDay = hour < 12 ? "morning" : hour < 17 ? "afternoon" : hour < 21 ? "evening" : "night";
    const greetingTitles: Record<string, string> = {
      morning: "Good morning",
      afternoon: "Good afternoon",
      evening: "Good evening",
      night: "Good night",
    };

    // Dynamic book recommendation based on interests + focus
    const bookMap: Record<string, { title: string; author: string; reason: string }> = {
      philosophy: { title: "Meditations", author: "Marcus Aurelius", reason: "Because you seek timeless stoic clarity." },
      literature: { title: "The Prophet", author: "Kahlil Gibran", reason: "Because you appreciate soulful poetic reflection." },
      wellness: { title: "The Power of Now", author: "Eckhart Tolle", reason: "Because you value inner presence and calm." },
      career: { title: "Essentialism", author: "Greg McKeown", reason: "Because you focus on what truly matters." },
      music: { title: "This Is Your Brain on Music", author: "Daniel Levitin", reason: "Because you love understanding music deeply." },
    };

    const interestKey = interests.find((i) => bookMap[i.toLowerCase()]) ?? focus;
    const book = bookMap[interestKey.toLowerCase()] ?? {
      title: "Atomic Habits",
      author: "James Clear",
      reason: "Because building better routines changes everything.",
    };

    const bookCoverMap: Record<string, string> = {
      "Meditations": "/books/meditations.svg",
      "The Prophet": "/books/the_prophet.svg",
      "The Power of Now": "/books/the_power_of_now.svg",
      "Essentialism": "/books/essentialism.svg",
      "Atomic Habits": "/books/atomic_habits.svg",
    };

    const homeViewModel: HomeViewModel = {
      user: {
        id: user.id,
        name: profile?.full_name ?? user.email?.split("@")[0] ?? "Friend",
        role: profile?.role ?? "Explorer",
        avatar_initial: (profile?.full_name ?? user.email ?? "E").charAt(0).toUpperCase(),
      },
      appearance: {
        theme: theme as HomeViewModel["appearance"]["theme"],
        environment: visualWorld,
        accent_color: "#F2D78A",
        reduced_motion: settings?.reduced_motion ?? false,
      },
      greeting: {
        time_of_day: timeOfDay as HomeViewModel["greeting"]["time_of_day"],
        title: `${greetingTitles[timeOfDay]}, ${profile?.full_name?.split(" ")[0] ?? "there"} ✨`,
        subtitle: "A calmer mind creates a stronger you.",
      },
      thought_letter: {
        visible: true,
        title: "A thought for you",
        body: "Even the darkest nights end with a brighter dawn.",
        meaning: "No matter how difficult your current situation is, it will eventually get better.",
        why_this_matters: "This is a reminder that this phase is not the end, but a part of your growth.",
        author: "Rumi",
      },
      quick_actions: [
        { label: "I'm feeling stressed", query: "I'm feeling overwhelmed and stressed today, help me find calm.", icon: "🎯" },
        { label: "Help me focus", query: "I have tasks to do but my mind is wandering, help me focus.", icon: "🎯" },
        { label: "Suggest a book", query: "Can you recommend a thoughtful book based on my journey?", icon: "📖" },
      ],
      recommendations: {
        book: {
          title: book.title,
          author: book.author,
          cover_image: bookCoverMap[book.title] ?? "/books/the_prophet.svg",
          reason: book.reason,
          category: "Book for You",
        },
        music: {
          title: "Focus Flow",
          genre: "Lofi",
          duration_min: 45,
          mood_tags: ["calm", "focus"],
          reason: "For your current mood and study session.",
        },
        visual: {
          title: visualWorld.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()),
          description: "A peaceful space to breathe and reset.",
          image: `/visual-worlds/${visualWorld}.jpg`,
          environment: visualWorld,
        },
        guidance: {
          title: "Overcoming Overthinking",
          description: "Practical steps based on our recent conversations.",
          category: "Guidance for You",
        },
      },
      recent_conversations: (conversations ?? []).map((c, i) => ({
        id: c.id,
        preview: ["How to stay consistent?", "Fear of the future", "Dealing with overthinking"][i] ?? "A conversation",
        timestamp: c.created_at,
        has_moment: false,
      })),
      moments: (moments ?? []).map((m) => ({
        id: m.id,
        title: m.title ?? "A moment",
        date: m.created_at,
        thumbnail: m.image_url,
      })),
      journey: [
        { type: "goals", label: "Goals", value: `${goals?.length ?? 0} active goals`, href: "/app/journey" },
        { type: "emotions", label: "Emotions", value: "Mood patterns >", href: "/app/journey" },
        { type: "reflections", label: "Reflections", value: "12 journal entries", href: "/app/journal" },
        { type: "life_novel", label: "Life Novel", value: "Your story in progress >", href: "/app/journey" },
      ],
      daily_check_in: {
        completed: false,
      },
      display_settings: {
        show_conversations: settings?.show_conversations ?? true,
        show_recommendations: settings?.show_recommendations ?? true,
        show_moments_journey: settings?.show_moments_journey ?? true,
      },
      generated_at: new Date().toISOString(),
    };

    return NextResponse.json(homeViewModel);
  } catch (error) {
    console.error("[/api/home] Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * EchoSoul Master Guidance Database
 *
 * Structured guidance repository across all life domains:
 * - Study & Career
 * - Mental Health
 * - Relationships
 * - Life & Transitions
 * - Daily Habits
 * - For You (Personalized dynamically)
 */

export interface GuidanceStep {
  id: string;
  title: string;
  desc: string;
}

export interface GuidanceInsight {
  icon: string;
  badgeColor: string;
  title: string;
  desc: string;
}

export interface DeeperGuidancePractice {
  title: string;
  timeEstimate: string;
  instruction: string;
  takeaway: string;
}

export interface GuidanceCategoryRecord {
  id: string;
  name: string;
  tabLabel: string;
  tagline: string;
  focusTitle: string;
  focusSubtitle: string;
  bgImage: string;
  themeColor: string;
  steps: GuidanceStep[];
  insights: GuidanceInsight[];
  deepPractices: DeeperGuidancePractice[];
}

export const MASTER_GUIDANCE_DATABASE: Record<string, GuidanceCategoryRecord> = {
  for_you: {
    id: "for_you",
    name: "For You",
    tabLabel: "For You",
    tagline: "Guidance curated uniquely for your current season.",
    focusTitle: "Restoring Your Gentle Rhythm",
    focusSubtitle: "Tailored micro-actions aligned with your recent goals and emotional state.",
    bgImage: "/tabs/guidance_bg.jpg",
    themeColor: "#F2D78A",
    steps: [
      {
        id: "fy_1",
        title: "Take a 5-minute mindful pause",
        desc: "Step back from notifications. Let your breathing settle before shifting tasks.",
      },
      {
        id: "fy_2",
        title: "Identify today's single non-negotiable",
        desc: "Choose the one task that truly moves the needle; everything else is secondary.",
      },
      {
        id: "fy_3",
        title: "Honor your current pace",
        desc: "Progress is rarely a straight line. Consistency beats intense burnout every time.",
      },
    ],
    insights: [
      {
        icon: "🌙",
        badgeColor: "text-[#F2D78A]",
        title: "Nighttime Wind-down",
        desc: "You tend to overthink at night. Try writing down three things you completed before sleep.",
      },
      {
        icon: "☀️",
        badgeColor: "text-[#4ADE80]",
        title: "Morning Focus Peak",
        desc: "Your energy is highest before noon. Protect that window for your most demanding priority.",
      },
      {
        icon: "✨",
        badgeColor: "text-[#F2D78A]",
        title: "Consistency Momentum",
        desc: "You've checked in multiple times this week. Small daily steps compound into real transformation.",
      },
    ],
    deepPractices: [
      {
        title: "The 3-Tier Priority Audit",
        timeEstimate: "10 mins",
        instruction: "Divide your open tasks into 'Must', 'Should', and 'Could'. Postpone all 'Could' tasks until tomorrow.",
        takeaway: "Eliminating trivial urgency immediately reduces cognitive overload.",
      },
      {
        title: "Compassionate Self-Inventory",
        timeEstimate: "5 mins",
        instruction: "Write one sentence acknowledging what was hard today, and one sentence forgiving yourself for it.",
        takeaway: "Self-compassion rebuilds mental resilience faster than self-criticism.",
      },
    ],
  },

  study_career: {
    id: "study_career",
    name: "Study & Career",
    tabLabel: "Study & Career",
    tagline: "Focus, cognitive stamina, and intentional career progress.",
    focusTitle: "Sustaining Deep Focus",
    focusSubtitle: "Practical strategies for exam mastery, career clarity, and unshakeable discipline.",
    bgImage: "/visual-worlds/forest_retreat.jpg",
    themeColor: "#60A5FA",
    steps: [
      {
        id: "sc_1",
        title: "Implement the 50/10 Focus Protocol",
        desc: "Work for 50 uninterrupted minutes on one subject, followed by a complete 10-minute screen-free break.",
      },
      {
        id: "sc_2",
        title: "Active Recall over Passive Rereading",
        desc: "Close the book or notes and write out the core concept from memory in your own words.",
      },
      {
        id: "sc_3",
        title: "Clarify your monthly career milestone",
        desc: "Focus on one demonstrable project or skill rather than vague long-term anxiety.",
      },
    ],
    insights: [
      {
        icon: "🎯",
        badgeColor: "text-[#60A5FA]",
        title: "Single-Tasking Advantage",
        desc: "Context switching eats 40% of cognitive capacity. Close background tabs while working.",
      },
      {
        icon: "⚡",
        badgeColor: "text-[#FCD34D]",
        title: "The Friction Principle",
        desc: "Place your phone in another room during study blocks to eliminate unconscious scrolling.",
      },
      {
        icon: "🌱",
        badgeColor: "text-[#34D399]",
        title: "Long-Term Timeline",
        desc: "Never measure your year-one beginning against someone else's year-five milestone.",
      },
    ],
    deepPractices: [
      {
        title: "The Feynman Technique Session",
        timeEstimate: "15 mins",
        instruction: "Explain a complex subject as if teaching an 8-year-old. Wherever you stumble is where your knowledge gap lies.",
        takeaway: "True mastery is simplicity, not technical jargon.",
      },
      {
        title: "Quarterly Trajectory Mapping",
        timeEstimate: "20 mins",
        instruction: "Write down where you want to be in 90 days, then work backwards to find this week's single prerequisite action.",
        takeaway: "Large career leaps are built on boring, predictable weekly deliverables.",
      },
    ],
  },

  mental_health: {
    id: "mental_health",
    name: "Mental Health",
    tabLabel: "Mental Health",
    tagline: "Gentle grounding, nervous system regulation, and emotional shelter.",
    focusTitle: "Regulating the Inner Storm",
    focusSubtitle: "Evidence-backed grounding tools when anxiety, exhaustion, or panic surface.",
    bgImage: "/visual-worlds/mountain_calm.jpg",
    themeColor: "#A78BFA",
    steps: [
      {
        id: "mh_1",
        title: "The 4-7-8 Parasympathetic Reset",
        desc: "Inhale quietly through your nose for 4s, hold for 7s, and exhale audibly through mouth for 8s.",
      },
      {
        id: "mh_2",
        title: "5-4-3-2-1 Sensory Grounding",
        desc: "Name 5 things you see, 4 you feel, 3 you hear, 2 you smell, and 1 positive truth about yourself.",
      },
      {
        id: "mh_3",
        title: "Release the urge to fix everything right now",
        desc: "Remind yourself: you don't have to resolve tomorrow's challenges tonight.",
      },
    ],
    insights: [
      {
        icon: "💙",
        badgeColor: "text-[#A78BFA]",
        title: "Anxiety is a Signal, Not Identity",
        desc: "Feeling anxious does not make you weak; it means your nervous system is asking for safety.",
      },
      {
        icon: "🌊",
        badgeColor: "text-[#38BDF8]",
        title: "Emotional Waves",
        desc: "Intense neurochemical surges peak within 90 seconds if you observe without fueling them with thoughts.",
      },
      {
        icon: "🕊️",
        badgeColor: "text-[#E879F9]",
        title: "Permission to Rest",
        desc: "Rest is not a reward earned only after total exhaustion. It is a fundamental maintenance right.",
      },
    ],
    deepPractices: [
      {
        title: "Cognitive Defusion Writing",
        timeEstimate: "10 mins",
        instruction: "Whenever an overwhelming thought appears, prefix it with: 'I notice I am having the thought that...'.",
        takeaway: "Creates essential distance between your conscious self and automatic thoughts.",
      },
      {
        title: "Physical Tension Scan & Release",
        timeEstimate: "8 mins",
        instruction: "Drop your shoulders away from your ears, unclench your jaw, and relax your belly completely.",
        takeaway: "Physical relaxation directly feeds signals of safety back to the amygdala.",
      },
    ],
  },

  relationships: {
    id: "relationships",
    name: "Relationships",
    tabLabel: "Relationships",
    tagline: "Conscious communication, healthy boundaries, and authentic connection.",
    focusTitle: "Honoring Boundaries & Warmth",
    focusSubtitle: "Fostering deep mutual understanding while protecting your energetic reserves.",
    bgImage: "/visual-worlds/ocean_breeze.jpg",
    themeColor: "#FB7185",
    steps: [
      {
        id: "rel_1",
        title: "Communicate needs before resentment builds",
        desc: "Express what you need gently and early rather than waiting until you reach your breaking point.",
      },
      {
        id: "rel_2",
        title: "Practice Non-Defensive Listening",
        desc: "In difficult conversations, listen to comprehend the other person's feeling, not to prepare your counter-rebuttal.",
      },
      {
        id: "rel_3",
        title: "Saying 'No' to protect your 'Yes'",
        desc: "A compassionate 'no' to commitments you cannot honor is kinder than a resentful, half-hearted 'yes'.",
      },
    ],
    insights: [
      {
        icon: "🤝",
        badgeColor: "text-[#FB7185]",
        title: "Clear is Kind",
        desc: "Unspoken expectations almost always lead to premeditated resentment.",
      },
      {
        icon: "🛡️",
        badgeColor: "text-[#F472B6]",
        title: "Healthy Distance",
        desc: "Taking personal space to recharge is an act of preserving the relationship, not rejecting it.",
      },
      {
        icon: "🕯️",
        badgeColor: "text-[#FBBF24]",
        title: "Quality over Breadth",
        desc: "One or two authentic relationships where you can be truly vulnerable outvalue dozens of shallow ties.",
      },
    ],
    deepPractices: [
      {
        title: "The 'I-Statement' Reframing",
        timeEstimate: "7 mins",
        instruction: "Change 'You never listen to me' into 'I feel unheard when discussions happen over text'.",
        takeaway: "Reduces partner defensiveness while keeping your boundary firm and clear.",
      },
      {
        title: "Relationship Energy Audit",
        timeEstimate: "12 mins",
        instruction: "List 5 key people in your life. Mark whether interactions leave you energized, neutral, or drained.",
        takeaway: "Clarifies where your emotional energy is currently leaking.",
      },
    ],
  },

  life: {
    id: "life",
    name: "Life",
    tabLabel: "Life",
    tagline: "Navigating transitions, philosophical clarity, and daily meaning.",
    focusTitle: "Embracing Life Transitions",
    focusSubtitle: "Finding stability, perspective, and courage when external circumstances shift.",
    bgImage: "/visual-worlds/starry_skies.jpg",
    themeColor: "#F59E0B",
    steps: [
      {
        id: "lf_1",
        title: "Separate what is in your control from what is not",
        desc: "Channel 100% of your emotional energy toward your own actions, responses, and values.",
      },
      {
        id: "lf_2",
        title: "Accept the messy middle stage",
        desc: "When a chapter closes and the next has not yet solidified, ambiguity is completely normal.",
      },
      {
        id: "lf_3",
        title: "Cultivate everyday micro-gratitudes",
        desc: "Notice 3 ordinary moments of beauty today: warm tea, changing light, or quiet solitude.",
      },
    ],
    insights: [
      {
        icon: "🧭",
        badgeColor: "text-[#F59E0B]",
        title: "Amor Fati (Love of Fate)",
        desc: "Unforeseen detours often forge the resilience and empathy required for future greatness.",
      },
      {
        icon: "⏳",
        badgeColor: "text-[#FBBF24]",
        title: "This Too Shall Pass",
        desc: "Neither triumphant peaks nor painful valleys are permanent. Flow gently through both.",
      },
      {
        icon: "🌌",
        badgeColor: "text-[#818CF8]",
        title: "Cosmic Perspective",
        desc: "In the vast span of time, today's acute stress will likely be an inconsequential memory in 5 years.",
      },
    ],
    deepPractices: [
      {
        title: "The Stoic Dichotomy of Control",
        timeEstimate: "10 mins",
        instruction: "Draw two columns on paper: 'Things I Can Influence Today' and 'Things Beyond My Influence'. Cross out the second column.",
        takeaway: "Liberates profound emotional energy by releasing attachment to uncontrollable outcomes.",
      },
      {
        title: "Future Self Visualization",
        timeEstimate: "10 mins",
        instruction: "Imagine yourself 10 years older, peaceful and fulfilled. What advice would that version of you whisper to you right now?",
        takeaway: "Instant clarity on whether current worries truly matter.",
      },
    ],
  },

  habits: {
    id: "habits",
    name: "Habits",
    tabLabel: "Habits",
    tagline: "Atomic changes, routine design, and compound personal growth.",
    focusTitle: "Designing Frictionless Habits",
    focusSubtitle: "Building lifelong consistency through identity shifts and micro-behaviors.",
    bgImage: "/visual-worlds/cozy_room.jpg",
    themeColor: "#10B981",
    steps: [
      {
        id: "hb_1",
        title: "The 2-Minute Gateway Rule",
        desc: "Shrink any new habit until it takes under two minutes: read 1 page, do 2 pushups, write 1 sentence.",
      },
      {
        id: "hb_2",
        title: "Habit Stacking onto Anchors",
        desc: "Pair your new behavior with an existing anchor: 'After I pour morning coffee, I will journal 3 lines.'",
      },
      {
        id: "hb_3",
        title: "Never miss twice in a row",
        desc: "Missing one day is an accident; missing two days in a row is the start of an unintended habit.",
      },
    ],
    insights: [
      {
        icon: "🔁",
        badgeColor: "text-[#10B981]",
        title: "Environment Over Willpower",
        desc: "Disciplined people rely on structured environments with low temptation, not raw willpower.",
      },
      {
        icon: "📈",
        badgeColor: "text-[#34D399]",
        title: "1% Daily Compounding",
        desc: "Improving just 1% every day makes you 37 times better by the end of one year.",
      },
      {
        icon: "🏆",
        badgeColor: "text-[#FCD34D]",
        title: "Identity-Based Habits",
        desc: "Don't say 'I'm trying to study'; say 'I am a diligent learner who values mastery'.",
      },
    ],
    deepPractices: [
      {
        title: "Environment Redesign Sprint",
        timeEstimate: "15 mins",
        instruction: "Make good habits obvious and frictionless (put running shoes by bed), and make bad habits invisible (unplug TV, log out of social apps).",
        takeaway: "You don't rise to the level of your goals; you fall to the level of your systems.",
      },
      {
        title: "Habit Scorecard Audit",
        timeEstimate: "10 mins",
        instruction: "List all automatic morning habits from waking to leaving the house. Rate each as positive (+), negative (-), or neutral (=).",
        takeaway: "Awareness is the absolute prerequisite for behavioral change.",
      },
    ],
  },
};

/**
 * Get guidance record based on tab selection and user profile
 */
export function getGuidanceForTab(
  tab: string,
  userProfile?: { currentFocus?: string; currentMood?: string }
): GuidanceCategoryRecord {
  const normalized = tab.toLowerCase().replace("&", "").replace(/\s+/g, "_");

  if (normalized.includes("study") || normalized.includes("career")) {
    return MASTER_GUIDANCE_DATABASE["study_career"];
  }
  if (normalized.includes("mental") || normalized.includes("health")) {
    return MASTER_GUIDANCE_DATABASE["mental_health"];
  }
  if (normalized.includes("relation")) {
    return MASTER_GUIDANCE_DATABASE["relationships"];
  }
  if (normalized.includes("life")) {
    return MASTER_GUIDANCE_DATABASE["life"];
  }
  if (normalized.includes("habit")) {
    return MASTER_GUIDANCE_DATABASE["habits"];
  }

  // "For You" dynamic adaptation
  const baseForYou = { ...MASTER_GUIDANCE_DATABASE["for_you"] };
  if (userProfile?.currentFocus === "studies" || userProfile?.currentFocus === "career") {
    baseForYou.focusTitle = "Deep Focus & Academic Ambition";
    baseForYou.focusSubtitle = "Tailored for your current study and career progression.";
  } else if (userProfile?.currentMood === "anxious" || userProfile?.currentMood === "tired") {
    baseForYou.focusTitle = "Gentle Grounding & Rest";
    baseForYou.focusSubtitle = "Tailored micro-actions to soothe overwhelm and rebuild your energy.";
  }

  return baseForYou;
}

import type { HomePersonalizationViewModel, HomeThemeConfig } from "./types";

export interface HomePersonalizationInput {
  name?: string;
  role?: string;
  currentMood?: string;
  currentFocus?: string;
  overallVibe?: string;
  interests?: string[];
  visualWorld?: string;
  theme?: "midnight_soul" | "sunrise_calm" | "forest_green" | "minimal_light";
  backgroundEnvironment?: "cozy_room" | "mountain_view" | "forest_cabin" | "ocean_view" | "city_nights" | "starry_sky";
  accentColor?: string;
  layoutMode?: "focused" | "explorative";
  fontStyle?: "serif" | "sans" | "rounded";
  dailySchedule?: string;
}

export const VISUAL_WORLDS_CONFIG: Record<string, {
  id: string;
  title: string;
  subtitle: string;
  background: string;
  ambience: string;
  quote: string;
  quoteAuthor: string;
  accent: string;
}> = {
  mountain_calm: {
    id: "mountain_calm",
    title: "Mountain Calm",
    subtitle: "A calmer mind creates a stronger you.",
    background: "/visual-worlds/mountain_calm.jpg",
    ambience: "Alpine breeze & morning bells",
    quote: "Peace isn't a place, it's a way of seeing.",
    quoteAuthor: "Solenne",
    accent: "#F2D78A",
  },
  forest_retreat: {
    id: "forest_retreat",
    title: "Forest Retreat",
    subtitle: "Nature reminds us to slow down and still grow.",
    background: "/visual-worlds/forest_retreat.jpg",
    ambience: "Sunlit pine canopy & gentle stream",
    quote: "In every walk with nature one receives far more than they seek.",
    quoteAuthor: "John Muir",
    accent: "#8DBA8F",
  },
  ocean_breeze: {
    id: "ocean_breeze",
    title: "Ocean Breeze",
    subtitle: "A fresh perspective can change everything.",
    background: "/visual-worlds/ocean_breeze.jpg",
    ambience: "Coastal tides & morning horizon",
    quote: "Let the waves remind you — you can begin again as many times as you need.",
    quoteAuthor: "Solenne",
    accent: "#76C7C0",
  },
  city_lights: {
    id: "city_lights",
    title: "City Lights",
    subtitle: "Big dreams often begin in ordinary days.",
    background: "/visual-worlds/city_lights.jpg",
    ambience: "Quiet skyline murmur & amber glow",
    quote: "A brighter tomorrow is built by what you do today.",
    quoteAuthor: "Solenne",
    accent: "#FFB86B",
  },
  starry_skies: {
    id: "starry_skies",
    title: "Starry Skies",
    subtitle: "Even in the dark, your story shines.",
    background: "/visual-worlds/starry_skies.jpg",
    ambience: "Celestial stillness & 432Hz night tone",
    quote: "Stars remind us that even in darkness, there is light.",
    quoteAuthor: "Solenne",
    accent: "#C4A6F5",
  },
  cozy_room: {
    id: "cozy_room",
    title: "Cozy Room",
    subtitle: "A quiet space for a louder you.",
    background: "/visual-worlds/cozy_room.jpg",
    ambience: "Warm lantern glow & rain against glass",
    quote: "The right words find you at the right time.",
    quoteAuthor: "Solenne",
    accent: "#F2D78A",
  },
  fantasy_realm: {
    id: "fantasy_realm",
    title: "Fantasy Realm",
    subtitle: "Your imagination is part of the journey.",
    background: "/visual-worlds/fantasy_realm.jpg",
    ambience: "Ethereal breeze & twilight wonder",
    quote: "A kinder you creates a kinder world.",
    quoteAuthor: "Solenne",
    accent: "#E5A9EC",
  },
  minimal_space: {
    id: "minimal_space",
    title: "Minimal Space",
    subtitle: "Clarity creates space for what truly matters.",
    background: "/visual-worlds/minimal_space.jpg",
    ambience: "Distraction-free silence & pure acoustic light",
    quote: "Less noise. A deeper you.",
    quoteAuthor: "Solenne",
    accent: "#E2E8F0",
  },
  anime_aesthetic: {
    id: "anime_aesthetic",
    title: "Anime Aesthetic",
    subtitle: "Same you. A brighter horizon.",
    background: "/visual-worlds/anime_aesthetic.jpg",
    ambience: "Melodic piano & summer dusk wind",
    quote: "Every day is a new frame in your story.",
    quoteAuthor: "Solenne",
    accent: "#F472B6",
  },
  nature_wildlife: {
    id: "nature_wildlife",
    title: "Nature & Wildlife",
    subtitle: "A wilder you is still a kinder you.",
    background: "/visual-worlds/nature_wildlife.jpg",
    ambience: "Morning mist & birdsong over mountain lake",
    quote: "We don't just belong in nature — we belong with it.",
    quoteAuthor: "Solenne",
    accent: "#A7D49B",
  },
  space_cosmos: {
    id: "space_cosmos",
    title: "Space & Cosmos",
    subtitle: "You are part of something much bigger.",
    background: "/visual-worlds/space_cosmos.jpg",
    ambience: "Deep cosmic resonance & stellar harmony",
    quote: "The same stars that light the universe live within you.",
    quoteAuthor: "Solenne",
    accent: "#818CF8",
  },
  classic_vintage: {
    id: "classic_vintage",
    title: "Classic & Vintage",
    subtitle: "Great stories live in quiet minds.",
    background: "/visual-worlds/classic_vintage.jpg",
    ambience: "Acoustic cello & pages turning in warm library",
    quote: "A well-lived life is the rarest of stories.",
    quoteAuthor: "Solenne",
    accent: "#D4AF37",
  },
};

export function buildHomeViewModel(input: HomePersonalizationInput): HomePersonalizationViewModel {
  const name = input.name || "Friend";

  // Time of day calculation
  const hour = new Date().getHours();
  let timeOfDayGreeting = "Good evening";
  let timeOfDay: "morning" | "evening" | "night" = "night";
  if (hour >= 5 && hour < 12) {
    timeOfDayGreeting = "Good morning";
    timeOfDay = "morning";
  } else if (hour >= 12 && hour < 17) {
    timeOfDayGreeting = "Good afternoon";
    timeOfDay = "evening";
  }

  const mood = (input.currentMood || "calm").toLowerCase();
  const focus = (input.currentFocus || "exploring").toLowerCase();
  const interestNames = (input.interests || []).map((i) => i.toLowerCase());

  // Resolve Visual World config
  const worldKey = (input.visualWorld || "mountain_calm").toLowerCase().replace(/[\s-]/g, "_");
  const worldConfig = VISUAL_WORLDS_CONFIG[worldKey] || VISUAL_WORLDS_CONFIG.mountain_calm;

  const theme = input.theme || "midnight_soul";
  const accentColor = input.accentColor || worldConfig.accent;
  const layoutMode = input.layoutMode || "focused";
  const fontStyle = input.fontStyle || "serif";

  // 1. Dynamic Hero Copy & Emotional Framing
  let heroGreeting = `${timeOfDayGreeting}, ${name}.`;
  let heroMessage = worldConfig.subtitle;
  let checkInSuggestion = "How are you arriving today?";

  if (mood === "stressed" || mood === "anxious") {
    heroGreeting = `Breathe, ${name}.`;
    heroMessage = "Let's make today a little lighter. You don't have to carry everything alone right now.";
    checkInSuggestion = "Has anything eased your mind today?";
  } else if (mood === "motivated") {
    heroGreeting = `Welcome back, ${name}.`;
    heroMessage = "Your vision is clear today. Let's build something lasting from this momentum.";
    checkInSuggestion = "What is the single most meaningful step you will take today?";
  } else if (mood === "sad") {
    heroGreeting = `A quiet space for you, ${name}.`;
    heroMessage = "Take all the space and stillness you need. Every feeling is welcome here.";
    checkInSuggestion = "Would you like to put words to what feels heavy?";
  } else if (mood === "calm") {
    heroGreeting = `${timeOfDayGreeting}, ${name}.`;
    heroMessage = worldConfig.subtitle;
    checkInSuggestion = "What thought has stayed with you this morning?";
  }

  // 2. Primary & Secondary Actions based on Mood & Goals
  let primaryAction = {
    id: "talk",
    title: "Start a Conversation",
    description: "Speak freely without judgment. Solenne listens and understands.",
    icon: "message",
    href: "/app/talk",
    accent: accentColor,
  };

  if (mood === "motivated" || focus === "goals") {
    primaryAction = {
      id: "journey",
      title: "Chart Your Journey",
      description: "Define your next milestone and track your personal evolution.",
      icon: "compass",
      href: "/app/journey",
      accent: accentColor,
    };
  } else if (focus === "studies") {
    primaryAction = {
      id: "guidance",
      title: "Focused Study Session",
      description: "Quiet distractions and structure your next hours of learning.",
      icon: "bulb",
      href: "/app/guidance",
      accent: "#8DBA8F",
    };
  } else if (interestNames.includes("literature") || interestNames.includes("poetry")) {
    primaryAction = {
      id: "words",
      title: "Enter Literature Sanctuary",
      description: "Explore timeless poems and essays that reflect your inner state.",
      icon: "quill",
      href: "/app/words",
      accent: accentColor,
    };
  }

  const secondaryActions = [
    {
      id: "words",
      title: "Daily Words",
      description: "Authentic poetry and literature chosen for your state of mind.",
      icon: "quill",
      href: "/app/words",
    },
    {
      id: "music",
      title: "Mindful Music",
      description: "Calm soundscapes and atmospheric compositions.",
      icon: "music",
      href: "/app/music",
    },
  ];

  // 3. Recommended Literature
  let recommendedWords = {
    title: "The Guest House",
    author: "Jalal al-Din Rumi",
    excerpt: "This being human is a guest house. Every morning a new arrival. A joy, a depression, a meanness...",
    category: "Sufi Wisdom",
    href: "/app/words?work=rumi-guest-house",
  };

  if (focus === "studies" || mood === "stressed") {
    recommendedWords = {
      title: "Meditations (Book IV)",
      author: "Marcus Aurelius",
      excerpt: "Nowhere can man find a quieter or more untroubled retreat than in his own soul.",
      category: "Stoic Philosophy",
      href: "/app/words?work=aurelius-meditations",
    };
  } else if (interestNames.includes("poetry") || interestNames.includes("literature")) {
    recommendedWords = {
      title: "Letters to a Young Poet",
      author: "Rainer Maria Rilke",
      excerpt: "Be patient toward all that is unsolved in your heart and try to love the questions themselves.",
      category: "Classic Literature",
      href: "/app/words?work=rilke-letters",
    };
  }

  // 4. Recommended Music
  let recommendedMusic = {
    title: "Twilight Reflections",
    vibe: "Calm Piano & Ambient Rain",
    duration: "32 min",
    category: "Ambient Solitude",
  };

  if (mood === "stressed" || focus === "studies") {
    recommendedMusic = {
      title: "Midnight Library",
      vibe: "Lo-Fi Instrumental Beats & Gentle Rain",
      duration: "45 min",
      category: "Deep Study",
    };
  } else if (worldKey === "forest_retreat" || worldKey === "nature_wildlife") {
    recommendedMusic = {
      title: "Pines at Dawn",
      vibe: "Acoustic Guitar & Forest Stream",
      duration: "28 min",
      category: "Nature Acoustics",
    };
  } else if (worldKey === "ocean_breeze") {
    recommendedMusic = {
      title: "Tides of Solitude",
      vibe: "432Hz Coastal Ambient & Waves",
      duration: "40 min",
      category: "Ocean Resonance",
    };
  }

  // 5. Build Unified HomeThemeConfig
  let lightingMode: "deep_calm" | "warm_sunlight" | "forest_mist" | "clean_bright" = "deep_calm";
  if (theme === "sunrise_calm") lightingMode = "warm_sunlight";
  else if (theme === "forest_green") lightingMode = "forest_mist";
  else if (theme === "minimal_light") lightingMode = "clean_bright";

  const homeTheme: HomeThemeConfig = {
    environment: worldConfig.id,
    environmentTitle: worldConfig.title,
    theme,
    background: worldConfig.background,
    accent: accentColor,
    lighting: lightingMode,
    timeOfDay,
    featureImages: [
      "/visual-worlds/" + worldConfig.id + ".jpg",
      "/environments/cozy_room.jpg",
      "/environments/mountain_view.jpg",
    ],
    ambience: worldConfig.ambience,
    typographyMode: fontStyle,
    quoteStyle: worldConfig.quote,
    welcomeTitle: heroGreeting,
    welcomeSubtitle: heroMessage,
  };

  return {
    userName: name,
    timeOfDayGreeting,
    heroGreeting,
    heroMessage,
    currentMood: mood,
    overallVibe: input.overallVibe || "calm",
    currentFocus: focus,
    primaryAction,
    secondaryActions,
    homeTheme,
    recommendedFeatures: [
      {
        id: "talk",
        title: "Speak Freely",
        badge: "Sanctuary",
        description: "A private place for what you feel. No judgment, no haste.",
        href: "/app/talk",
        accentColor,
      },
      {
        id: "words",
        title: "Find Your Words",
        badge: "Literature",
        description: "Verified poetry and philosophy matching human heartache.",
        href: "/app/words",
        accentColor,
      },
      {
        id: "music",
        title: "Ambient Soundscapes",
        badge: "Resonance",
        description: "432Hz resonance, acoustic instruments, and living textures.",
        href: "/app/music",
        accentColor,
      },
      {
        id: "journey",
        title: "Your Life Novel",
        badge: "Chronicle",
        description: "Your conversations woven into chapters of personal growth.",
        href: "/app/journey",
        accentColor,
      },
    ],
    recommendedWords,
    recommendedMusic,
    visualAtmosphere: {
      scene: worldConfig.id,
      environmentTitle: worldConfig.title,
      backgroundImage: worldConfig.background,
      ambientColor: accentColor,
    },
    checkInSuggestion,
    journeyHighlight: "Chapter 1: The Threshold of Self-Discovery",
  };
}

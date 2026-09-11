import type { HomePersonalizationViewModel } from "./types";

export interface HomePersonalizationInput {
  name?: string;
  role?: string;
  currentMood?: string;
  currentFocus?: string;
  overallVibe?: string;
  interests?: string[];
}

export function buildHomeViewModel(input: HomePersonalizationInput): HomePersonalizationViewModel {
  const name = input.name || "Friend";

  // Time of day calculation
  const hour = new Date().getHours();
  let timeOfDayGreeting = "Good evening";
  if (hour >= 5 && hour < 12) {
    timeOfDayGreeting = "Good morning";
  } else if (hour >= 12 && hour < 17) {
    timeOfDayGreeting = "Good afternoon";
  }

  const mood = (input.currentMood || "calm").toLowerCase();
  const focus = (input.currentFocus || "exploring").toLowerCase();
  const interestNames = (input.interests || []).map((i) => i.toLowerCase());

  // 1. Dynamic Hero Copy & Emotional Framing
  let heroGreeting = `${timeOfDayGreeting}, ${name}.`;
  let heroMessage = "I'm glad you're here. Let's find meaning in this moment.";
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
    heroMessage = "A still mind reflects the clearest stars. Let's explore your deeper thoughts.";
    checkInSuggestion = "What thought has stayed with you this morning?";
  }

  // 2. Primary & Secondary Actions based on Mood & Goals
  let primaryAction = {
    id: "talk",
    title: "Start a Conversation",
    description: "Speak freely without judgment. EchoSoul listens and understands.",
    icon: "message",
    href: "/app/talk",
    accent: "#F2D78A",
  };

  if (mood === "motivated" || focus === "goals") {
    primaryAction = {
      id: "journey",
      title: "Chart Your Journey",
      description: "Define your next milestone and track your personal evolution.",
      icon: "compass",
      href: "/app/journey",
      accent: "#F2D78A",
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

  // 3. Recommended Literature (Authentic works only, matching interests & mood)
  let recommendedWords = {
    title: "The Guest House",
    author: "Jalal al-Din Rumi",
    excerpt: "This being human is a guest house. Every morning a new arrival. A joy, a depression, a meanness, some momentary awareness comes as an unexpected visitor.",
    category: "Poetry & Reflection",
    href: "/app/words",
  };

  if (interestNames.includes("philosophy") || focus === "studies" || mood === "stressed") {
    recommendedWords = {
      title: "Meditations (Book IV)",
      author: "Marcus Aurelius",
      excerpt: "Nowhere can man find a quieter or more untroubled retreat than in his own soul... Constantly then give yourself this retreat, and renew yourself.",
      category: "Stoic Philosophy",
      href: "/app/words",
    };
  } else if (mood === "motivated") {
    recommendedWords = {
      title: "Self-Reliance",
      author: "Ralph Waldo Emerson",
      excerpt: "Trust thyself: every heart vibrates to that iron string. Accept the place the divine providence has found for you.",
      category: "Essays & Wisdom",
      href: "/app/words",
    };
  }

  // 4. Music Recommendations
  let recommendedMusic = {
    title: "Twilight Reflections",
    vibe: "Calm Piano & Ambient Rain",
    duration: "24 min",
    category: "Ambient Instrumental",
  };

  if (mood === "motivated") {
    recommendedMusic = {
      title: "Ascent of Dawn",
      vibe: "Energetic Acoustic Strings",
      duration: "18 min",
      category: "Uplifting Focus",
    };
  } else if (focus === "studies" || mood === "stressed") {
    recommendedMusic = {
      title: "Midnight Library",
      vibe: "Lo-Fi Instrumental Beats & Gentle Rain",
      duration: "45 min",
      category: "Study & Flow",
    };
  }

  // 5. Visual Atmosphere & Scene
  let visualAtmosphere = {
    scene: "twilight_window",
    environmentTitle: "Nightfall Mountain Haven",
    backgroundImage: "/page3-clean.png",
    ambientColor: "rgba(242, 215, 138, 0.15)",
  };

  if (mood === "calm" || mood === "motivated") {
    visualAtmosphere = {
      scene: "open_horizon",
      environmentTitle: "Lake Under Starlit Constellations",
      backgroundImage: "/about-backdrop.jpg",
      ambientColor: "rgba(141, 186, 143, 0.15)",
    };
  }

  // 6. Recommended Features based on user's onboarding priorities
  const recommendedFeatures = [
    {
      id: "words",
      title: "Words & Literature",
      badge: "Authentic Sources",
      description: "Discover genuine prose and poetry tailored to your inner state.",
      href: "/app/words",
      accentColor: "#F2D78A",
    },
    {
      id: "talk",
      title: "Talk & Be Heard",
      badge: "Private",
      description: "A secure sanctuary to unpack your thoughts and gain clarity.",
      href: "/app/talk",
      accentColor: "#9AA8B0",
    },
    {
      id: "journey",
      title: "Your Life Journey",
      badge: "Novel of You",
      description: "Watch your reflections coalesce into chapters of personal growth.",
      href: "/app/journey",
      accentColor: "#CFC5B5",
    },
  ];

  return {
    userName: name,
    timeOfDayGreeting,
    heroGreeting,
    heroMessage,
    currentMood: mood,
    overallVibe: input.overallVibe || "Creative",
    currentFocus: input.currentFocus || "exploring",
    primaryAction,
    secondaryActions,
    recommendedFeatures,
    recommendedWords,
    recommendedMusic,
    visualAtmosphere,
    checkInSuggestion,
    journeyHighlight: `Reflecting as a ${input.role || "seeker"} focused on ${input.currentFocus || "personal growth"}.`,
  };
}

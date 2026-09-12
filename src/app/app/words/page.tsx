"use client";

import React, { useState, useEffect, useRef } from "react";
import { EchoSoulShell } from "@/components/shell/EchoSoulShell";
import Image from "next/image";
import { Bookmark, Sparkles, BookOpen, Compass, Heart, CheckCircle2, ChevronRight, X } from "lucide-react";
import { getLiteratureTypography } from "@/lib/typography";
import { createClient } from "@/lib/supabase/client";
import { getScopedStorageItem, setScopedStorageItem } from "@/lib/auth/sessionBoundary";

interface LineAnalysis {
  line: string;
  translation: string;
  nuance: string;
}

interface PassageItem {
  id: string;
  category: "Poetry" | "Shayari" | "Books" | "Life Lessons";
  title: string;
  author: string;
  genre: string;
  text: string;
  meaning: string;
  language: string;
  script: string;
  lineByLine: LineAnalysis[];
  whyForMe: string;
  howItHelps: string;
  actionableSteps: string[];
}

const MASTER_WORDS_DATABASE: PassageItem[] = [
  // ── 1. POETRY ──────────────────────────────────────────────
  {
    id: "poetry_01",
    category: "Poetry",
    title: "The Road Not Taken",
    author: "Robert Frost",
    genre: "American Poetry",
    text: "Two roads diverged in a yellow wood,\nAnd sorry I could not travel both\nAnd be one traveler, long I stood\nAnd looked down one as far as I could\nTo where it bent in the undergrowth;\n\nI took the one less traveled by,\nAnd that has made all the difference.",
    meaning: "An iconic meditation on the quiet courage of forging your own uncommon path in life.",
    language: "en",
    script: "latin",
    lineByLine: [
      {
        line: "Two roads diverged in a yellow wood,",
        translation: "Two separate paths split apart in an autumn forest,",
        nuance: "Yellow wood symbolizes autumn—a turning point where comfort must yield to conscious life direction.",
      },
      {
        line: "And sorry I could not travel both / And be one traveler, long I stood",
        translation: "Regretting that a single traveler cannot exist in two realities simultaneously, I stood hesitating for a long time,",
        nuance: "Honors the grief of opportunity cost: choosing any meaningful path always means letting other enticing possibilities go.",
      },
      {
        line: "And looked down one as far as I could / To where it bent in the undergrowth;",
        translation: "Peering down the first path as far as sight reached, until it curved into the thick brush;",
        nuance: "We desperately try to predict outcomes 5 years ahead, yet reality always curves beyond our immediate field of view.",
      },
      {
        line: "I took the one less traveled by, / And that has made all the difference.",
        translation: "I selected the less trodden, less crowded route, and that choice defined the entire trajectory of my life.",
        nuance: "Living authentically according to internal convictions rather than social conformity creates genuine individuality.",
      },
    ],
    whyForMe:
      "Why For You: You are actively navigating major crossroads in your education, identity, and personal life. The fear of making the 'wrong choice' often freezes action. This poem reassures you that no path is guaranteed, and the courage to choose what feels true to you is where character is born.",
    howItHelps:
      "Psychologically dissolves decision paralysis and FOMO (Fear of Missing Out). It reframes hesitation from weakness into healthy contemplation, granting emotional permission to embrace an unconventional journey.",
    actionableSteps: [
      "Identify one decision where you feel pressured to choose solely for outside approval.",
      "Write down the choice you would make if no one else's opinion mattered.",
      "Commit to one irreversible micro-step toward your authentic goal today.",
    ],
  },
  {
    id: "poetry_02",
    category: "Poetry",
    title: "Where the Mind is Without Fear",
    author: "Rabindranath Tagore",
    genre: "Nobel Laureate Poetry",
    text: "Where the mind is without fear and the head is held high;\nWhere knowledge is free;\nWhere the world has not been broken up into fragments by narrow domestic walls;\nInto that heaven of freedom, my Father, let my country awake.",
    meaning: "A universal prayer for inner awakening, unclouded truth, and fearless freedom.",
    language: "en",
    script: "latin",
    lineByLine: [
      {
        line: "Where the mind is without fear and the head is held high;",
        translation: "A state of consciousness where anxiety has no power and self-respect is unwavering;",
        nuance: "Dignity does not come from arrogance, but from a mind unchained from fear of judgment.",
      },
      {
        line: "Where knowledge is free;",
        translation: "Where learning is accessible without prejudice or gatekeeping;",
        nuance: "True intellectual curiosity should be joyful, untainted by commercial pressures.",
      },
      {
        line: "Where the world has not been broken up into fragments by narrow domestic walls;",
        translation: "Where artificial divisions of caste, religion, and ego no longer separate people;",
        nuance: "Calls for internal cohesion: do not fragment your own mind into conflicting doubts.",
      },
      {
        line: "Into that heaven of freedom, my Father, let my country awake.",
        translation: "Into that state of boundless mental liberty, let us be awakened.",
        nuance: "Tagore treats awakening as a daily conscious rebirth of one's faculties.",
      },
    ],
    whyForMe:
      "Why For You: In seasons of high academic pressure and constant evaluation, fear of failure often contracts the mind. Tagore invites you into expansive self-trust where curiosity replaces anxiety.",
    howItHelps:
      "Clears performance anxiety by reconnecting you to the intrinsic joy of learning and holding your head high regardless of external scores.",
    actionableSteps: [
      "Notice whenever fear or self-criticism dictates your posture or decisions today.",
      "Practice lifting your chin, relaxing your shoulders, and taking 3 expansive breaths.",
      "Engage with one subject today purely out of genuine curiosity rather than test anxiety.",
    ],
  },
  {
    id: "poetry_03",
    category: "Poetry",
    title: "The Guest House",
    author: "Rumi",
    genre: "Sufi Poetry",
    text: "This being human is a guest house.\nEvery morning a new arrival.\nA joy, a depression, a meanness,\nsome momentary awareness comes\nas an unexpected visitor.\nWelcome and entertain them all!",
    meaning: "Accept each passing emotion with gentle hospitality, for each may be clearing you out for some new delight.",
    language: "en",
    script: "latin",
    lineByLine: [
      {
        line: "This being human is a guest house. Every morning a new arrival.",
        translation: "The human mind and heart are like an inn; every day brings new emotional travelers.",
        nuance: "Emotions are impermanent guests, not permanent residents or owners of who you are.",
      },
      {
        line: "A joy, a depression, a meanness, some momentary awareness comes as an unexpected visitor.",
        translation: "Elation, sadness, or petty irritations will arrive without scheduling an appointment.",
        nuance: "Do not judge yourself for feeling sadness or doubt; they are natural biological signals.",
      },
      {
        line: "Welcome and entertain them all! ... Be grateful for whatever comes, because each has been sent as a guide from beyond.",
        translation: "Treat every feeling with quiet dignity and open doors, knowing each carries a message.",
        nuance: "Resistance creates suffering; welcoming provides the space for emotion to complete its natural cycle and leave.",
      },
    ],
    whyForMe:
      "Why For You: You often battle difficult thoughts or feel guilty when overwhelmed. Rumi reminds you that resisting an emotion only traps it inside. By greeting each feeling with kindness, you regain peace.",
    howItHelps:
      "Applies Mindfulness-Based Cognitive Therapy (MBCT). Cultivates radical acceptance and emotional defusion, stopping negative thought spirals before they take hold.",
    actionableSteps: [
      "When a wave of sadness or restlessness arrives, do not immediately fight or suppress it.",
      "Silently whisper: 'Welcome. I see you are here today. What do you need to teach me?'",
      "Observe the physical sensation in your chest or throat until it naturally dissipates.",
    ],
  },

  // ── 2. SHAYARI ─────────────────────────────────────────────
  {
    id: "shayari_01",
    category: "Shayari",
    title: "Waqt",
    author: "Gulzar",
    genre: "Nazm & Shayari",
    text: "वक़्त रहता नहीं कहीं टिक कर,\nआदत इस की भी आदमी सी है।",
    meaning: "समय कभी किसी एक जगह ठहरता नहीं। चाहे कितना भी कठिन या गहरा पल हो, यह बीत जाएगा।",
    language: "hi",
    script: "devanagari",
    lineByLine: [
      {
        line: "वक़्त रहता नहीं कहीं टिक कर",
        translation: "Time never remains still or anchored in any single place",
        nuance: "Highlights the universal law of impermanence: pain, sorrow, and overwhelm are incapable of lasting forever.",
      },
      {
        line: "आदत इस की भी आदमी सी है",
        translation: "Its nature is remarkably similar to a restless human being",
        nuance: "Gulzar poetically personifies time—wandering, searching, never settling down, constantly passing onward.",
      },
    ],
    whyForMe:
      "Why For You: In moments of fatigue or mental burden, your brain exaggerates the present moment as if it were eternal. Gulzar gives you an anchor of perspective: this current hour will pass, just like all before it.",
    howItHelps:
      "Reduces emotional claustrophobia. By remembering that time is in constant motion, the heaviness of today's workload loses its permanent grip.",
    actionableSteps: [
      "Remind yourself during your most stressful hour today: 'This too is passing.'",
      "Look at an old journal entry or problem from 6 months ago to realize how time solved what once felt impossible.",
      "Focus solely on taking care of the next 20 minutes instead of the next 5 months.",
    ],
  },
  {
    id: "shayari_02",
    category: "Shayari",
    title: "Hazaron Khwaishein",
    author: "Mirza Ghalib",
    genre: "Urdu Ghazal",
    text: "ہزاروں خواہشیں ایسی کہ ہر خواہش پہ دم نکلے\nبہت نکلے مرے ارمان لیکن پھر بھی کم نکلے",
    meaning: "انسان کی آرزوئیں لاانتہا ہیں۔ سچی دانائی خواہشات کی گنتی میں نہیں، بلکہ اپنے ظرف کو پہچاننے میں ہے۔",
    language: "ur",
    script: "arabic",
    lineByLine: [
      {
        line: "ہزاروں خواہشیں ایسی کہ ہر خواہش پہ دم نکلے",
        translation: "Thousands of desires, each so intense that life itself could expire for its fulfillment",
        nuance: "Ghalib exposes the consuming fire of human longing—how we attach our entire survival to fleeting wants.",
      },
      {
        line: "بہت نکلے مرے ارمان لیکن پھر بھی کم نکلے",
        translation: "Many of my aspirations were fulfilled, yet in retrospect, it still felt incomplete",
        nuance: "Achievement alone never satisfies the soul; the hedonic treadmill always demands more.",
      },
    ],
    whyForMe:
      "Why For You: You are driven and ambitious, but often caught in the exhausting cycle of 'Once I get this, then I'll be happy.' Ghalib offers the profound gift of contentment.",
    howItHelps:
      "Cuts through perfectionism and endless comparison. Realizing that desires never naturally end empowers you to choose gratitude in the present.",
    actionableSteps: [
      "Name 3 things you currently have that you once prayed or stressed for years ago.",
      "Catch yourself when thinking 'I will only relax once X is done' and grant yourself 10 minutes of rest right now.",
      "Recognize that your worth does not depend on an empty checklist.",
    ],
  },
  {
    id: "shayari_03",
    category: "Shayari",
    title: "Sitaron Se Aage",
    author: "Allama Iqbal",
    genre: "Falsafa & Shayari",
    text: "ستاروں سے آگے جہاں اور بھی ہیں\nابھی عشق کے امتحان اور بھی ہیں",
    meaning: "آپ کی موجودہ حدیں آپ کا اختتام نہیں ہیں۔ زندگی میں مسلسل جستجو اور ارتقاء کا سفر ہمیشہ کھلا ہے۔",
    language: "ur",
    script: "arabic",
    lineByLine: [
      {
        line: "ستاروں سے آگے جہاں اور بھی ہیں",
        translation: "Beyond the stars, there are countless other worlds and horizons yet to explore",
        nuance: "Your current situation or stumbling block is not the final horizon of your life.",
      },
      {
        line: "ابھی عشق کے امتحان اور بھی ہیں",
        translation: "There are still higher tests of devotion, purpose, and mastery awaiting you",
        nuance: "Iqbal inspires relentless growth—treat difficulties not as defeats, but as worthy challenges.",
      },
    ],
    whyForMe:
      "Why For You: When facing setbacks or closed doors, it feels like the story has ended. Iqbal lifts your eyes above the immediate wall toward limitless future possibilities.",
    howItHelps:
      "Ignites intrinsic resilience and growth mindset. Transforms temporary roadblocks into expansive stepping stones.",
    actionableSteps: [
      "Write down one disappointment from recent weeks and reframe it: 'What new horizon does this push me toward?'",
      "Dedicate 30 minutes to learning something entirely outside your comfort zone.",
      "Affirm that your story is still in its opening chapters.",
    ],
  },
  {
    id: "shayari_04",
    category: "Shayari",
    title: "Aaina",
    author: "Gulzar",
    genre: "Selected Shayari",
    text: "थोड़ी सी धूल थी आईने पे,\nहमने तो सारा चेहरा ही बदल डाला।",
    meaning: "कभी-कभी दोष केवल हमारे देखने के नज़रिए में होता है, स्वयं में नहीं। दृष्टिकोण बदलें, स्वयं को नहीं।",
    language: "hi",
    script: "devanagari",
    lineByLine: [
      {
        line: "थोड़ी सी धूल थी आईने पे",
        translation: "There was merely a speck of dust upon the mirror",
        nuance: "The flaw was in the external reflective medium—the perception, mood, or fatigue—not in the underlying self.",
      },
      {
        line: "हमने तो सारा चेहरा ही बदल डाला",
        translation: "And yet, in our haste, we attempted to alter our entire face",
        nuance: "A biting commentary on how we viciously attack our own self-worth when a simple change in perspective was needed.",
      },
    ],
    whyForMe:
      "Why For You: You are frequently hard on yourself, assuming that when things feel disordered, you are inherently flawed. Gulzar gently asks you to clean the mirror first.",
    howItHelps:
      "Stops toxic self-criticism. Distinguishes between internal worth and temporary external fatigue or mental clutter.",
    actionableSteps: [
      "When self-critical thoughts surge, ask: 'Is my face dirty, or is the mirror just dusty?'",
      "Rest, drink water, or take a walk before judging your overall intelligence or capabilities.",
      "Treat yourself with the same gentleness you would offer a struggling friend.",
    ],
  },

  // ── 3. BOOKS ───────────────────────────────────────────────
  {
    id: "books_01",
    category: "Books",
    title: "Meditations",
    author: "Marcus Aurelius",
    genre: "Stoic Philosophy",
    text: "You have power over your mind — not outside events. Realize this, and you will find strength. Very little is needed to make a happy life; it is all within yourself, in your way of thinking.",
    meaning: "The definitive stoic lesson: focus your finite energy solely on your own reactions, integrity, and choices.",
    language: "en",
    script: "latin",
    lineByLine: [
      {
        line: "You have power over your mind — not outside events.",
        translation: "You control your thoughts and choices, never the external world or other people.",
        nuance: "The core dichotomy of control: anxiety lives in trying to control what cannot be governed.",
      },
      {
        line: "Realize this, and you will find strength.",
        translation: "Internalize this truth, and unshakeable inner resilience will emerge.",
        nuance: "Strength is not fighting reality; it is refusing to surrender your inner serenity to external turbulence.",
      },
      {
        line: "Very little is needed to make a happy life; it is all within yourself, in your way of thinking.",
        translation: "Peace requires very few possessions or circumstances; it is an internal posture.",
        nuance: "Simplicity of judgment brings profound tranquility.",
      },
    ],
    whyForMe:
      "Why For You: You are often frustrated by unpredictable circumstances, noise, and expectations. Marcus Aurelius reminds you that your greatest fortress is your own disciplined mind.",
    howItHelps:
      "Reduces emotional reactivity by 80%. Draws a clear boundary between external chaos and internal composure.",
    actionableSteps: [
      "Divide today's worries into two columns: 'Things I Can Control' and 'Things I Cannot Control.'",
      "Cross out the second column and invest 100% of your energy solely into the first.",
      "When someone irritates you, remind yourself: 'Their conduct is their domain; my calm is mine.'",
    ],
  },
  {
    id: "books_02",
    category: "Books",
    title: "The Prophet",
    author: "Kahlil Gibran",
    genre: "Philosophical Classic",
    text: "Your pain is the breaking of the shell that encloses your understanding. Even as the stone of the fruit must break, that its heart may stand in the sun, so must you know pain.",
    meaning: "Emotional suffering is not a punishment, but an expansion of the vessel that will one day hold greater joy.",
    language: "en",
    script: "latin",
    lineByLine: [
      {
        line: "Your pain is the breaking of the shell that encloses your understanding.",
        translation: "Sorrow is the fracture of the protective shell keeping your mind small.",
        nuance: "Comfort preserves the seed; pain forces the germination of deeper consciousness.",
      },
      {
        line: "Even as the stone of the fruit must break, that its heart may stand in the sun,",
        translation: "Just as a fruit's hard pit must split open for its seed to meet the sunlight,",
        nuance: "Vulnerability is required for spiritual growth.",
      },
      {
        line: "so must you know pain.",
        translation: "So too must you experience hardship to blossom into your full capacity.",
        nuance: "Suffering is not wasted; it prepares you for profound empathy and fulfillment.",
      },
    ],
    whyForMe:
      "Why For You: When facing heartache or emotional fatigue, you feel as though something has broken irreparably. Gibran reveals that it is not you that is breaking, but merely the shell that was too small for who you are becoming.",
    howItHelps:
      "Bestows meaning upon suffering (Logotherapy principle). Prevents feelings of victimization and fosters deep self-compassion.",
    actionableSteps: [
      "Write down the hardest challenge you are facing right now.",
      "Ask: 'What layer of vanity, fragility, or ignorance is this breaking away?'",
      "Treat yourself with immense gentleness as this growth unfolds.",
    ],
  },
  {
    id: "books_03",
    category: "Books",
    title: "The Power of Now",
    author: "Eckhart Tolle",
    genre: "Spiritual Mindfulness",
    text: "Realize deeply that the present moment is all you ever have. Make the NOW the primary focus of your life. Past gives you an identity and future holds the promise of salvation; both are illusions.",
    meaning: "An invitation to let go of compulsive mental time-travel and rest in the clarity of the immediate present.",
    language: "en",
    script: "latin",
    lineByLine: [
      {
        line: "Realize deeply that the present moment is all you ever have.",
        translation: "Understand in your bones that life only ever happens in the immediate now.",
        nuance: "You have never lived in the past, nor will you ever live in the future; life is continuous present.",
      },
      {
        line: "Make the NOW the primary focus of your life.",
        translation: "Anchor your attention directly in what is occurring right in front of you.",
        nuance: "Presence dissolves anxiety because anxiety requires projecting into non-existent futures.",
      },
      {
        line: "Past gives you an identity and future holds the promise of salvation; both are illusions.",
        translation: "Regrets and fantasies are mental projections; reality is right here.",
        nuance: "Release both past guilt and future dread to find immediate peace.",
      },
    ],
    whyForMe:
      "Why For You: Overthinking at night is simply your mind racing between past mistakes and future fears. Tolle calls you back to the sanctuary of this exact breath.",
    howItHelps:
      "Silences the default mode network (DMN) in the brain, bringing instant nervous system relief and groundedness.",
    actionableSteps: [
      "Pause right now and name 3 sounds you can hear in your room.",
      "Feel the soles of your feet on the floor and take a full breath into your belly.",
      "Acknowledge that in this exact second, you are safe and whole.",
    ],
  },
  {
    id: "books_04",
    category: "Books",
    title: "Atomic Habits",
    author: "James Clear",
    genre: "Growth Systems",
    text: "You do not rise to the level of your goals. You fall to the level of your systems. Small daily 1% improvements accumulate into profound transformation.",
    meaning: "Focus on building forgiving, consistent daily rituals rather than stressing over monumental milestones.",
    language: "en",
    script: "latin",
    lineByLine: [
      {
        line: "You do not rise to the level of your goals.",
        translation: "Merely wishing or setting massive ambitions will not carry you forward.",
        nuance: "Everyone shares the same goal (to succeed); the differentiator is daily architecture.",
      },
      {
        line: "You fall to the level of your systems.",
        translation: "Under stress, you will default to your ingrained habits and workflows.",
        nuance: "Make good habits effortless and friction-free so your worst days still produce progress.",
      },
      {
        line: "Small daily 1% improvements accumulate into profound transformation.",
        translation: "Tiny, barely noticeable daily adjustments compound exponentially over time.",
        nuance: "Consistency beats intensity every single time.",
      },
    ],
    whyForMe:
      "Why For You: You often feel overwhelmed by the magnitude of your syllabus or personal goals. Clear gives you permission to make your tasks smaller and simpler.",
    howItHelps:
      "Eliminates burnout. Switches psychological momentum from exhausting heroics to effortless compounding habits.",
    actionableSteps: [
      "Pick your most avoided goal and shrink it to a 2-minute version.",
      "Do that 2-minute action today without demanding perfection.",
      "Track your consistency on a calendar with a simple checkmark.",
    ],
  },

  // ── 4. LIFE LESSONS ────────────────────────────────────────
  {
    id: "lessons_01",
    category: "Life Lessons",
    title: "Dheere Dheere Re Mana",
    author: "Kabir Das",
    genre: "Sant Vani & Dohe",
    text: "धीरे-धीरे रे मना, धीरे सब कुछ होय।\nमाली सींचे सौ घड़ा, ॠतु आए फल होय॥",
    meaning: "हे मन, अधीर मत हो। सब कुछ अपने स्वाभाविक समय पर परिपक्व होता है। अपने प्रयत्न जारी रखो और ऋतु की प्रतीक्षा करो।",
    language: "hi",
    script: "devanagari",
    lineByLine: [
      {
        line: "धीरे-धीरे रे मना, धीरे सब कुछ होय",
        translation: "Slowly and gently, O restless mind, everything matures in its own measured rhythm",
        nuance: "Kabir addresses his restless mind as a dear friend who needs gentleness rather than harsh discipline.",
      },
      {
        line: "माली सींचे सौ घड़ा, ॠतु आए फल होय",
        translation: "Even if the gardener pours a hundred pots of water at once, the tree only bears fruit when its rightful season arrives",
        nuance: "No amount of frantic overworking, panic, or despair can force nature to ripen before its season.",
      },
    ],
    whyForMe:
      "Why For You: You are carrying immense modern urgency, comparing your timeline to others and wondering why success isn't arriving overnight. Kabir reminds you that real mastery requires patient gestation.",
    howItHelps:
      "Replaces crippling self-reproach with botanical patience. Understands that water poured into your studies today is working invisibly beneath the soil.",
    actionableSteps: [
      "Acknowledge the effort you put in today, even if results are invisible right now.",
      "Stop constantly checking for validation after every single practice session.",
      "Affirm: 'I am cultivating roots. My fruit will arrive in its season.'",
    ],
  },
  {
    id: "lessons_02",
    category: "Life Lessons",
    title: "Karma Yoga",
    author: "Bhagavad Gita (Chapter 2, Verse 47)",
    genre: "Sacred Epics",
    text: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥",
    meaning: "तुम्हारा अधिकार केवल कर्म करने पर है, उसके फलों पर कभी नहीं। फल की आसक्ति से मुक्त होकर शांत चित्त से अपना कर्तव्य निभाओ।",
    language: "hi",
    script: "devanagari",
    lineByLine: [
      {
        line: "कर्मण्येवाधिकारस्ते (Karmany evadhikaras te)",
        translation: "Your sovereign right and privilege is to your actions alone",
        nuance: "Your entire human power lives in the quality of your attention, effort, and integrity in the present moment.",
      },
      {
        line: "मा फलेषु कदाचन (ma phaleshu kadachana)",
        translation: "Never to the fruits, rewards, or outcomes of those actions",
        nuance: "Exam scores, public praise, and future windfalls depend on thousands of worldly factors beyond individual control.",
      },
      {
        line: "मा कर्मफलहेतुर्भूर्मा (ma karma-phala-hetur bhur)",
        translation: "Let not the thirst for results be your motivating cause",
        nuance: "When you act purely for the trophy, the fear of losing that trophy induces crippling anxiety and compromises quality.",
      },
      {
        line: "ते सङ्गोऽस्त्वकर्मणि (ma te sango 'stv akarmani)",
        translation: "Nor let there be any attachment to passivity or inaction",
        nuance: "Do not retreat into cynicism, procrastination, or despair simply because outcomes cannot be controlled.",
      },
    ],
    whyForMe:
      "Why For You: You are carrying heavy performance anxiety regarding exams, career expectations, and fear of letting people down. This sacred verse is your ultimate psychological antidote—relieving you from the unbearable burden of controlling the future.",
    howItHelps:
      "The pinnacle of process-oriented cognition. Studies in cognitive neuroscience and high-performance psychology show that detaching from outcomes eliminates test anxiety, optimizes working memory, and produces vastly superior performance.",
    actionableSteps: [
      "Before beginning your study or work today, state: 'My responsibility is to give sincere attention to this hour, not to manage tomorrow.'",
      "Whenever outcome panic surfaces, label it 'Fruit Distraction' and gently bring your eyes back to the sentence or problem before you.",
      "Reward yourself for showing up and doing your duty, completely detached from whether the day felt easy or hard.",
    ],
  },
  {
    id: "lessons_03",
    category: "Life Lessons",
    title: "Antarman",
    author: "Kabir Das",
    genre: "Spiritual Dohe",
    text: "बुरा जो देखन मैं चला, बुरा न मिलिया कोय।\nजो दिल खोजा आपना, मुझसे बुरा न कोय॥",
    meaning: "दूसरों में कमियां ढूंढने के बजाय जब हम अपने अंतर्मन में झांकते हैं, तो करुणा और आत्म-सुधार का मार्ग खुलता है।",
    language: "hi",
    script: "devanagari",
    lineByLine: [
      {
        line: "बुरा जो देखन मैं चला, बुरा न मिलिया कोय",
        translation: "When I searched outside for wickedness and flaw, I found none",
        nuance: "Projecting blame onto the outside world, society, or other people is an ego defense mechanism that leaves us powerless.",
      },
      {
        line: "जो दिल खोजा आपना, मुझसे बुरा न कोय",
        translation: "When I turned inward and examined my own heart, I realized my own flaws and illusions were the greatest obstacle",
        nuance: "True spiritual maturity starts with radical self-honesty, unlocking universal empathy for all struggling beings.",
      },
    ],
    whyForMe:
      "Why For You: When feeling stressed or misunderstood, it is easy to become irritable with family or friends. Kabir calls you back to self-reflection where real agency lives.",
    howItHelps:
      "Dissolves bitterness, anger, and interpersonal friction. Replaces defensiveness with profound emotional equilibrium.",
    actionableSteps: [
      "If you felt irritated with someone today, pause and ask what insecurity of yours was triggered.",
      "Practice offering others the benefit of the doubt.",
      "Commit to improving your own response rather than trying to fix someone else's mood.",
    ],
  },
  {
    id: "lessons_04",
    category: "Life Lessons",
    title: "Tao of Living",
    author: "Lao Tzu",
    genre: "Eastern Philosophy",
    text: "Nature does not hurry, yet everything is accomplished. A journey of a thousand miles begins with a single step.",
    meaning: "Resist the urge to force outcomes through frantic anxiety. Align with patient natural timing.",
    language: "en",
    script: "latin",
    lineByLine: [
      {
        line: "Nature does not hurry, yet everything is accomplished.",
        translation: "Rivers do not rush, trees do not strain, yet ecosystems thrive in effortless completion.",
        nuance: "Wu Wei (effortless action): harmony comes from flowing with natural rhythms rather than exhausting yourself through friction.",
      },
      {
        line: "A journey of a thousand miles begins with a single step.",
        translation: "Even the most monumental endeavor is composed entirely of solitary, grounded moments.",
        nuance: "Do not stare at the mountain peak in fear; simply take the step that is beneath your foot right now.",
      },
    ],
    whyForMe:
      "Why For You: You frequently feel overwhelmed by the entire semester or long-term future. Lao Tzu simplifies the world back to the solitary step in front of you.",
    howItHelps:
      "Reduces overwhelm to near-zero. Replaces paralysis with calm, continuous forward motion.",
    actionableSteps: [
      "What is the 1,000-mile goal currently intimidating you?",
      "Identify the single immediate step you can take in the next 10 minutes.",
      "Take that one step and rest in the knowledge that you are already on the journey.",
    ],
  },
];

export default function WordsPage() {
  const [activeTab, setActiveTab] = useState<"For You" | "Poetry" | "Shayari" | "Books" | "Life Lessons">("For You");
  const [selectedPassage, setSelectedPassage] = useState<PassageItem>(MASTER_WORDS_DATABASE[0]);
  const [modalOpen, setModalOpen] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const userIdRef = useRef<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function initUser() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (isMounted) userIdRef.current = user?.id || null;
      } catch {}
    }
    initUser();
    return () => { isMounted = false; };
  }, []);

  // Filter list based on active tab
  const filteredList =
    activeTab === "For You"
      ? MASTER_WORDS_DATABASE
      : MASTER_WORDS_DATABASE.filter((item) => item.category === activeTab);

  // When clicking a tab, immediately switch the featured card to that category's primary item
  const handleTabChange = (tab: "For You" | "Poetry" | "Shayari" | "Books" | "Life Lessons") => {
    setActiveTab(tab);
    if (tab === "For You") {
      setSelectedPassage(MASTER_WORDS_DATABASE[0]);
    } else {
      const match = MASTER_WORDS_DATABASE.find((item) => item.category === tab);
      if (match) setSelectedPassage(match);
    }
  };

  const currentTypography = getLiteratureTypography(
    selectedPassage.text,
    selectedPassage.language,
    selectedPassage.script
  );

  const handleAddToJournal = () => {
    try {
      const list = getScopedStorageItem<any[]>(userIdRef.current, "journal_entries", []) || [];
      const newEntry = {
        id: Date.now(),
        date: new Date().toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        title: `Reflection: ${selectedPassage.title} (${selectedPassage.author})`,
        text: `"${selectedPassage.text}"\n\nReflection: ${selectedPassage.meaning}\n\nWhy this matters for me: ${selectedPassage.whyForMe}`,
        tags: ["Words", selectedPassage.category],
      };
      setScopedStorageItem(userIdRef.current, "journal_entries", [newEntry, ...list]);
      setAddedSuccess(true);
      setTimeout(() => setAddedSuccess(false), 2500);
    } catch {}
  };

  return (
    <EchoSoulShell activePath="/app/words">
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="text-3xl sm:text-4xl font-cormorant text-[#FFF8E1]">
              Discover words that stay with you.
            </h1>
            <p className="text-sm font-manrope text-[#CFC5B5] mt-0.5">
              Authentic literature. A real meaning. A deeper you.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F2D78A]/15 border border-[#F2D78A]/30 text-[#F2D78A] text-xs font-semibold self-start sm:self-auto">
            <Sparkles className="w-3.5 h-3.5" />
            Curated For Your State of Mind
          </span>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-white/5">
          {(["For You", "Poetry", "Shayari", "Books", "Life Lessons"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`px-4 py-2 rounded-full text-xs font-manrope transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab
                  ? "bg-[#F2D78A] text-[#0B0F14] font-semibold shadow-md shadow-[#F2D78A]/10"
                  : "bg-[#0C1B25] text-[#CFC5B5] hover:text-[#FFF8E1] border border-white/10 hover:border-white/20"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Main Hero Card */}
          <div className="lg:col-span-8 rounded-3xl overflow-hidden border border-[#F2D78A]/20 bg-[#09141D] shadow-2xl relative min-h-[500px] flex flex-col justify-between p-6 sm:p-8">
            <Image
              src="/tabs/words_bg.jpg"
              alt="Dark scholarly library sanctuary"
              fill
              className="object-cover opacity-25 pointer-events-none transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#070D12] via-[#070D12]/70 to-black/40 pointer-events-none" />

            {/* Top Badge */}
            <div className="relative z-10 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F2D78A]/15 border border-[#F2D78A]/30 text-[#F2D78A] text-xs font-semibold">
                <Bookmark className="w-3 h-3" />
                {selectedPassage.category} • {selectedPassage.genre}
              </span>
              <span className="text-xs font-manrope text-[#9AA8B0]">
                {selectedPassage.author}
              </span>
            </div>

            {/* Center Content with Script-Aware Typography */}
            <div className="relative z-10 my-auto py-6 space-y-4 max-w-2xl">
              <h2 className="text-2xl sm:text-3xl font-cormorant font-semibold text-[#FFF8E1]">
                {selectedPassage.title}
              </h2>
              <blockquote
                className={`text-lg sm:text-2xl text-[#FFF8E1] leading-relaxed whitespace-pre-line ${
                  currentTypography.fontClass
                } ${currentTypography.isRtl ? "text-right" : "text-left"}`}
                style={{ direction: currentTypography.isRtl ? "rtl" : "ltr" }}
              >
                &ldquo;{selectedPassage.text}&rdquo;
              </blockquote>
              <p className="text-xs sm:text-sm font-manrope text-[#CFC5B5] leading-relaxed border-l-2 border-[#F2D78A]/40 pl-3">
                {selectedPassage.meaning}
              </p>
            </div>

            {/* Bottom Actions */}
            <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setModalOpen(true)}
                  className="px-5 py-2.5 rounded-full bg-[#F2D78A] text-[#0B0F14] text-xs font-semibold hover:bg-[#E5C77A] transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Meaning &amp; Analysis</span>
                </button>
                <button
                  onClick={handleAddToJournal}
                  className="px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-xs font-semibold text-[#FFF8E1] transition-colors flex items-center gap-1.5 cursor-pointer border border-white/10"
                >
                  {addedSuccess ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#F2D78A]" />
                      <span>Added to Journal!</span>
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-3.5 h-3.5" />
                      <span>Save to Journal</span>
                    </>
                  )}
                </button>
              </div>
              <span className="text-[11px] font-manrope text-[#9AA8B0]">
                Curated by EchoSoul Literature Engine
              </span>
            </div>
          </div>

          {/* Right Sidebar: More For You */}
          <div className="lg:col-span-4 space-y-4">
            <div className="p-5 rounded-3xl bg-[#09141D] border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-cormorant text-lg font-semibold text-[#FFF8E1]">
                  More from {activeTab}
                </h3>
                <span className="text-xs font-manrope text-[#F2D78A]">
                  {filteredList.length} works
                </span>
              </div>

              <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
                {filteredList.map((item) => {
                  const isSelected = item.id === selectedPassage.id;
                  const itemTypo = getLiteratureTypography(item.text, item.language, item.script);
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedPassage(item)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer group ${
                        isSelected
                          ? "bg-[#0C1B25] border-[#F2D78A]/50 shadow-lg ring-1 ring-[#F2D78A]/20"
                          : "bg-[#0C1B25]/80 hover:bg-[#0C1B25] border-white/5 hover:border-[#F2D78A]/30"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-cormorant text-base font-semibold text-[#FFF8E1] group-hover:text-[#F2D78A] transition-colors">
                          {item.title}
                        </h4>
                        <span className="text-[10px] font-manrope px-2 py-0.5 rounded-full bg-white/5 text-[#9AA8B0]">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-[11px] font-manrope text-[#F2D78A]/90 mt-0.5">
                        by {item.author}
                      </p>
                      <p
                        className={`text-xs text-[#CFC5B5] line-clamp-1 mt-1.5 ${itemTypo.fontClass} ${
                          itemTypo.isRtl ? "text-right" : "text-left"
                        }`}
                      >
                        &ldquo;{item.text.replace(/\n/g, " ")}&rdquo;
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Tagline */}
            <div className="text-center p-3.5 rounded-2xl bg-[#0C1B25]/50 border border-white/5">
              <p className="text-xs font-cormorant italic text-[#F2D78A]">
                &ldquo;Real words. Real authors. A more meaningful you.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── 4-PART COMPREHENSIVE MEANING & ANALYSIS MODAL ────────────────── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-3xl rounded-3xl bg-[#09141D] border border-[#F2D78A]/30 p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-[#FFF8E1] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="space-y-1 pr-8">
              <span className="text-[11px] font-manrope uppercase tracking-widest text-[#F2D78A] font-semibold">
                Comprehensive 4-Part Analysis • {selectedPassage.category}
              </span>
              <h3 className="text-2xl sm:text-3xl font-cormorant text-[#FFF8E1]">
                {selectedPassage.title}
              </h3>
              <p className="font-manrope text-xs text-[#9AA8B0]">
                authored by <span className="text-[#FFF8E1] font-semibold">{selectedPassage.author}</span> • {selectedPassage.genre}
              </p>
            </div>

            {/* Verse Excerpt */}
            <blockquote
              className={`p-4 rounded-2xl bg-[#0C1B25] border border-white/10 text-[#FFF8E1] text-base sm:text-lg leading-relaxed ${
                currentTypography.fontClass
              } ${currentTypography.isRtl ? "text-right" : "text-left"}`}
            >
              &ldquo;{selectedPassage.text}&rdquo;
            </blockquote>

            {/* ── SECTION 1: LINE-BY-LINE BREAKDOWN & IMAGERY ── */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#F2D78A]">
                <BookOpen className="w-4 h-4" />
                <h4>1. Line-by-Line Breakdown &amp; Poetic Imagery</h4>
              </div>

              <div className="space-y-2.5">
                {selectedPassage.lineByLine.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-[#0C1B25] border border-white/5 space-y-1.5"
                  >
                    <p className={`font-semibold text-xs text-[#FFF8E1] ${currentTypography.fontClass}`}>
                      {item.line}
                    </p>
                    <p className="text-xs font-manrope text-[#F2D78A]">
                      <span className="font-semibold text-[#FFF8E1]/80">Meaning:</span> {item.translation}
                    </p>
                    <p className="text-[11px] font-manrope text-[#9AA8B0] leading-relaxed">
                      <span className="font-semibold text-[#CFC5B5]">Nuance:</span> {item.nuance}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── SECTION 2: WHY FOR ME? (PERSONAL RELEVANCE) ── */}
            <div className="p-4 rounded-2xl bg-[#0C1B25] border border-[#F2D78A]/30 space-y-2 shadow-inner">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#F2D78A]">
                <Sparkles className="w-4 h-4" />
                <h4>2. Why For Me?</h4>
              </div>
              <p className="text-xs font-manrope text-[#FFF8E1]/90 leading-relaxed">
                {selectedPassage.whyForMe}
              </p>
            </div>

            {/* ── SECTION 3: HOW THIS HELPS YOU ── */}
            <div className="p-4 rounded-2xl bg-[#0C1B25] border border-white/5 space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-blue-400">
                <Heart className="w-4 h-4" />
                <h4>3. How This Helps You (Emotional &amp; Psychological Benefit)</h4>
              </div>
              <p className="text-xs font-manrope text-[#CFC5B5] leading-relaxed">
                {selectedPassage.howItHelps}
              </p>
            </div>

            {/* ── SECTION 4: ACTIONABLE STEPS ── */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-emerald-400">
                <Compass className="w-4 h-4" />
                <h4>4. Actionable Steps for Today</h4>
              </div>

              <div className="space-y-2">
                {selectedPassage.actionableSteps.map((step, sIdx) => (
                  <div
                    key={sIdx}
                    className="p-3 rounded-2xl bg-[#0C1B25] border border-white/5 flex items-start gap-3"
                  >
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 text-xs font-semibold">
                      {sIdx + 1}
                    </div>
                    <p className="text-xs font-manrope text-[#FFF8E1]/90 leading-relaxed">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <button
                onClick={handleAddToJournal}
                className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/15 text-xs font-semibold text-[#FFF8E1] transition-colors cursor-pointer"
              >
                {addedSuccess ? "Added to Journal!" : "Save Insight to Journal"}
              </button>
              <button
                onClick={() => setModalOpen(false)}
                className="px-6 py-2 rounded-full bg-[#F2D78A] text-[#0B0F14] text-xs font-semibold hover:bg-[#E5C77A] transition-colors cursor-pointer"
              >
                Close Analysis
              </button>
            </div>
          </div>
        </div>
      )}
    </EchoSoulShell>
  );
}

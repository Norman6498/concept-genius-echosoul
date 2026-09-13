/**
 * EchoSoul Content Universe (System A)
 * 
 * Authoritative, rights-aware, provenance-tracked content registry across:
 * - Literature, Philosophy & Sacred Works
 * - Poetry, Shayari & Dohe (with explicit Language & Script separation)
 * - Music & Melodies (separation of EchoSoul-owned audio vs. commercial metadata)
 * - Visual Sanctuaries & Scientific Solfeggio Frequencies
 * - Practical Guidance & Life Insights
 * 
 * Controlled Taxonomy:
 * - Domains: literature, poetry, shayari, philosophy, wisdom, guidance, music, frequency, visual_scene
 * - Moods: overwhelm, anxiety, sadness, loneliness, seeking_peace, focus, ambition, grief, gratitude, night_stillness
 * - Focus: studies, career, wellbeing, relationships, habits, life_philosophy
 * 
 * @version echosoul_content_universe_v2
 */

export type ContentDomain =
  | "literature"
  | "poetry"
  | "shayari"
  | "philosophy"
  | "wisdom"
  | "guidance"
  | "music"
  | "frequency"
  | "visual_scene";

export type ContentMood =
  | "overwhelm"
  | "anxiety"
  | "sadness"
  | "loneliness"
  | "seeking_peace"
  | "focus"
  | "ambition"
  | "grief"
  | "gratitude"
  | "night_stillness"
  | "general";

export type LifeFocus =
  | "studies"
  | "career"
  | "wellbeing"
  | "relationships"
  | "habits"
  | "life_philosophy";

export type ScriptType = "latin" | "devanagari" | "nastaliq" | "arabic" | "greek";

export interface AuthorEntity {
  id: string;
  name: string;
  native_name?: string;
  era: string;
  tradition: string;
  bio: string;
}

export interface LiteraryWorkEntity {
  id: string;
  title: string;
  native_title?: string;
  author: AuthorEntity;
  domain: ContentDomain;
  language: string;
  script: ScriptType;
  rights_status: "public_domain" | "licensed" | "fair_use_excerpt";
  publication_year: number | string;
  cover_asset: string;
  themes: string[];
  description: string;
}

export interface PassageEntity {
  id: string;
  work_id: string;
  author_id: string;
  domain: ContentDomain;
  // Language and Script separation
  language: string;
  script: ScriptType;
  original_text: string;
  transliteration?: string;
  translation_en: string;
  meaning: string;
  why_it_matters: string;
  how_it_helps: string;
  actionable_steps?: string[];
  mood_tags: ContentMood[];
  focus_tags: LifeFocus[];
  keywords: string[];
}

export interface AudioItemEntity {
  id: string;
  title: string;
  artist: string;
  genre: string;
  // Audio Playback vs. Commercial Music Metadata separation
  audio_source_type: "echosoul_original" | "commercial_master" | "external_stream";
  audio_url?: string;
  external_id?: string;
  solfeggio_frequency_hz?: number;
  duration_seconds: number;
  mood_tags: ContentMood[];
  focus_tags: LifeFocus[];
  description: string;
  scientific_rationale?: string;
}

export interface VisualSanctuaryEntity {
  id: string;
  title: string;
  category: "nature" | "cities" | "rooms" | "space" | "anime" | "minimal";
  image_path: string;
  solfeggio_frequency_hz: number;
  breathing_profile: {
    name: string;
    ratio: string;
    inhale_sec: number;
    hold_sec: number;
    exhale_sec: number;
    rest_sec: number;
  };
  mood_tags: ContentMood[];
  tagline: string;
  description: string;
}

// ============================================================================
// AUTHORS DIRECTORY
// ============================================================================

export const AUTHORS: Record<string, AuthorEntity> = {
  marcus_aurelius: {
    id: "marcus_aurelius",
    name: "Marcus Aurelius",
    native_name: "Μάρκος Αὐρήλιος",
    era: "121–180 CE",
    tradition: "Roman Stoic Philosophy",
    bio: "Emperor of Rome from 161 to 180 CE. His private journals, never meant for publication, remain the world's most intimate guide to Stoic resilience, duty, and quiet equanimity.",
  },
  kahlil_gibran: {
    id: "kahlil_gibran",
    name: "Kahlil Gibran",
    native_name: "جبران خليل جبران",
    era: "1883–1931",
    tradition: "Lebanese-American Poetic Philosophy",
    bio: "Visionary poet and artist whose masterpiece 'The Prophet' bridges Eastern and Western spiritual thought with deep lyrical compassion.",
  },
  robert_frost: {
    id: "robert_frost",
    name: "Robert Frost",
    era: "1874–1963",
    tradition: "American Modern Poetry",
    bio: "Four-time Pulitzer Prize winner renowned for his pastoral imagery and profound explorations of choice, solitude, and human decision-making.",
  },
  mirza_ghalib: {
    id: "mirza_ghalib",
    name: "Mirza Ghalib",
    native_name: "مرزا غالب",
    era: "1797–1869",
    tradition: "Classical Urdu & Persian Ghazal",
    bio: "Pre-eminent poet of the Mughal era whose verses delve into existential mystery, longing, human fragility, and wry philosophical wonder.",
  },
  kabir_das: {
    id: "kabir_das",
    name: "Kabir Das",
    native_name: "कबीर दास",
    era: "1440–1518",
    tradition: "Indian Mystic Bhakti / Sufi Poetry",
    bio: "Iconoclastic 15th-century mystic poet who spoke in direct, earthy couplets urging patience, radical self-honesty, and inner truth.",
  },
  allama_iqbal: {
    id: "allama_iqbal",
    name: "Allama Iqbal",
    native_name: "علامہ اقبال",
    era: "1877–1938",
    tradition: "Urdu & Persian Philosophical Poetry",
    bio: "Philosopher-poet celebrated for his doctrine of 'Khudi' (Selfhood), urging courage, soaring ambition, and spiritual autonomy.",
  },
  gulzar: {
    id: "gulzar",
    name: "Gulzar",
    native_name: "گلزار / गुलज़ार",
    era: "1934–present",
    tradition: "Modern Hindi-Urdu Poetry & Nazm",
    bio: "Acclaimed poet and lyricist known for capturing the delicate nuances of everyday time, memory, stillness, and human affection.",
  },
  eckhart_tolle: {
    id: "eckhart_tolle",
    name: "Eckhart Tolle",
    era: "1948–present",
    tradition: "Modern Mindfulness & Presence",
    bio: "Spiritual teacher whose teachings illuminate how to step out of involuntary mental chatter and anchor into the timeless present.",
  },
  james_clear: {
    id: "james_clear",
    name: "James Clear",
    era: "Contemporary",
    tradition: "Behavioral Science & Systems Design",
    bio: "Author of 'Atomic Habits', focusing on the compounding power of small habits, habit stacking, and forgiving identity-based systems.",
  },
  greg_mckeown: {
    id: "greg_mckeown",
    name: "Greg McKeown",
    era: "Contemporary",
    tradition: "Essentialism & Purposeful Work",
    bio: "Author and leadership strategist advocating for the disciplined pursuit of less: eliminating the non-essential to achieve peak contribution.",
  },
  vyasa_gita: {
    id: "vyasa_gita",
    name: "Bhagavad Gita (Krishna-Arjuna)",
    native_name: "श्रीमद्भगवद्गीता",
    era: "c. 2nd Century BCE",
    tradition: "Vedantic & Yogic Philosophy",
    bio: "The sacred 700-verse dialogue between Arjuna and Krishna on the battlefield of Kurukshetra, establishing the timeless science of Nishkama Karma (selfless action without anxiety for results).",
  },
  rumi: {
    id: "rumi",
    name: "Jalal al-Din Muhammad Rumi",
    native_name: "جلال‌الدین محمد رومی",
    era: "1207–1273",
    tradition: "Sufi Mysticism & Lyric Poetry",
    bio: "13th-century Persian poet and Sufi master whose poems speak of transcendent love, surrender, and finding healing through life's deepest wounds.",
  },
  seneca: {
    id: "seneca",
    name: "Lucius Annaeus Seneca",
    era: "4 BCE – 65 CE",
    tradition: "Roman Stoicism",
    bio: "Stoic philosopher and playwright whose epistolary essays to Lucilius offer incisive advice on overcoming hurry, grief, and the fear of time.",
  },
};

// ============================================================================
// WORKS CATALOG
// ============================================================================

export const LITERARY_WORKS: Record<string, LiteraryWorkEntity> = {
  meditations: {
    id: "meditations",
    title: "Meditations",
    author: AUTHORS.marcus_aurelius,
    domain: "philosophy",
    language: "en",
    script: "latin",
    rights_status: "public_domain",
    publication_year: "c. 175 CE",
    cover_asset: "/books/meditations.svg",
    themes: ["stoicism", "resilience", "clarity", "inner_control", "duty"],
    description: "The private stoic journals of Rome's philosopher emperor on finding stillness amidst unrest.",
  },
  the_prophet: {
    id: "the_prophet",
    title: "The Prophet",
    author: AUTHORS.kahlil_gibran,
    domain: "literature",
    language: "en",
    script: "latin",
    rights_status: "public_domain",
    publication_year: 1923,
    cover_asset: "/books/the_prophet.svg",
    themes: ["love", "sorrow", "freedom", "work", "solitude", "joy"],
    description: "Twenty-eight poetic fables exploring the profound milestones of human existence.",
  },
  the_road_not_taken: {
    id: "the_road_not_taken",
    title: "The Road Not Taken",
    author: AUTHORS.robert_frost,
    domain: "poetry",
    language: "en",
    script: "latin",
    rights_status: "public_domain",
    publication_year: 1916,
    cover_asset: "/books/the_road_not_taken.svg",
    themes: ["decisions", "individuality", "path", "courage", "future"],
    description: "The seminal American poem celebrating the courage to walk one's own authentic path.",
  },
  bhagavad_gita: {
    id: "bhagavad_gita",
    title: "Bhagavad Gita",
    author: AUTHORS.vyasa_gita,
    domain: "wisdom",
    language: "sa",
    script: "devanagari",
    rights_status: "public_domain",
    publication_year: "Antiquity",
    cover_asset: "/books/bhagavad_gita.svg",
    themes: ["karma_yoga", "detachment", "duty", "focus", "inner_battle"],
    description: "The immortal dialogue on mastering the mind and acting with selfless clarity.",
  },
  diwan_e_ghalib: {
    id: "diwan_e_ghalib",
    title: "Diwan-e-Ghalib",
    author: AUTHORS.mirza_ghalib,
    domain: "shayari",
    language: "ur",
    script: "nastaliq",
    rights_status: "public_domain",
    publication_year: 1841,
    cover_asset: "/books/ghazals_ghalib.svg",
    themes: ["existential_wonder", "desire", "time", "irony", "heart"],
    description: "The definitive anthology of Urdu high romanticism and existential inquiry.",
  },
  the_power_of_now: {
    id: "the_power_of_now",
    title: "The Power of Now",
    author: AUTHORS.eckhart_tolle,
    domain: "philosophy",
    language: "en",
    script: "latin",
    rights_status: "fair_use_excerpt",
    publication_year: 1997,
    cover_asset: "/books/the_power_of_now.svg",
    themes: ["presence", "silence", "surrender", "non_resistance", "ego"],
    description: "A transformative handbook on freeing oneself from the tyranny of excessive rumination.",
  },
  essentialism: {
    id: "essentialism",
    title: "Essentialism",
    author: AUTHORS.greg_mckeown,
    domain: "guidance",
    language: "en",
    script: "latin",
    rights_status: "fair_use_excerpt",
    publication_year: 2014,
    cover_asset: "/books/essentialism.svg",
    themes: ["focus", "priorities", "career", "boundaries", "energy"],
    description: "The disciplined pursuit of less: how to stop trying to do it all and do only what counts.",
  },
  atomic_habits: {
    id: "atomic_habits",
    title: "Atomic Habits",
    author: AUTHORS.james_clear,
    domain: "guidance",
    language: "en",
    script: "latin",
    rights_status: "fair_use_excerpt",
    publication_year: 2018,
    cover_asset: "/books/atomic_habits.svg",
    themes: ["habits", "consistency", "small_steps", "identity", "systems"],
    description: "Actionable mechanics for designing habits that make personal growth natural and sustainable.",
  },
};

// ============================================================================
// VERIFIED PASSAGES & POETRY DATABASE
// ============================================================================

export const PASSAGES_DATABASE: PassageEntity[] = [
  // 1. Marcus Aurelius — Inner Control
  {
    id: "passage_aurelius_01",
    work_id: "meditations",
    author_id: "marcus_aurelius",
    domain: "philosophy",
    language: "en",
    script: "latin",
    original_text: "You have power over your mind — not outside events. Realize this, and you will find strength.",
    translation_en: "You have power over your mind — not outside events. Realize this, and you will find strength.",
    meaning: "External storms cannot penetrate your inner sanctuary unless your own thinking grants them permission. The boundary of your peace is guarded by your own mind.",
    why_it_matters: "When deadlines, exams, or people feel overwhelming, this Stoic truth strips away helplessness and restores your agency.",
    how_it_helps: "Activates cognitive reframing (CBT), immediately reducing sympathetic nervous system arousal and restoring calm focus.",
    actionable_steps: [
      "Write down the single situation causing you stress.",
      "Draw two columns: 'What I Control' and 'What I Cannot Control'.",
      "Consciously release the second column and take one action on the first.",
    ],
    mood_tags: ["overwhelm", "anxiety", "seeking_peace"],
    focus_tags: ["wellbeing", "studies", "career"],
    keywords: ["overwhelm", "control", "stress", "anxiety", "mind", "strength", "power", "peace", "stoic"],
  },

  // 2. Kahlil Gibran — Work & Joy
  {
    id: "passage_gibran_01",
    work_id: "the_prophet",
    author_id: "kahlil_gibran",
    domain: "literature",
    language: "en",
    script: "latin",
    original_text: "Work is love made visible. And if you cannot work with love but only with distaste, it is better that you should leave your work and sit at the gate of the temple.",
    translation_en: "Work is love made visible. And if you cannot work with love but only with distaste, it is better that you should leave your work and sit at the gate of the temple.",
    meaning: "Effort should not be a bitter chore done under duress. When you approach what you do with reverence and care, work becomes an expression of dignity.",
    why_it_matters: "Helps you reconnect with the underlying meaning of your studies and creative pursuits instead of feeling like an exhausted cog.",
    how_it_helps: "Alleviates chronic cynicism and study fatigue by reconnecting daily discipline to personal purpose.",
    actionable_steps: [
      "Ask yourself: Who does my hard work ultimately serve or protect?",
      "Set aside 25 minutes to work without rush, savoring the craft itself.",
      "Breathe deeply before starting your next task with deliberate care.",
    ],
    mood_tags: ["focus", "ambition", "seeking_peace"],
    focus_tags: ["career", "studies", "life_philosophy"],
    keywords: ["work", "purpose", "love", "craft", "career", "study", "prophet", "gibran"],
  },

  // 3. Robert Frost — The Road Not Taken
  {
    id: "passage_frost_01",
    work_id: "the_road_not_taken",
    author_id: "robert_frost",
    domain: "poetry",
    language: "en",
    script: "latin",
    original_text: "Two roads diverged in a wood, and I—\nI took the one less traveled by,\nAnd that has made all the difference.",
    translation_en: "Two roads diverged in a wood, and I—\nI took the one less traveled by,\nAnd that has made all the difference.",
    meaning: "Choosing an authentic personal trajectory over the easy, crowded path requires solitude and courage, yet it shapes the entirety of your spirit.",
    why_it_matters: "Validates your unique pacing and unconventional choices when peer pressure or expectations create self-doubt.",
    how_it_helps: "Dispels the paralysis of social comparison and reinforces confidence in your chosen direction.",
    actionable_steps: [
      "Acknowledge one personal dream you've hesitated to pursue out of fear of judgment.",
      "Remind yourself that conformity is comfortable, but individuality creates legacy.",
      "Commit to one authentic choice today that honors your true nature.",
    ],
    mood_tags: ["loneliness", "seeking_peace", "ambition"],
    focus_tags: ["career", "life_philosophy", "studies"],
    keywords: ["road", "choice", "path", "decision", "alone", "different", "future", "frost"],
  },

  // 4. Bhagavad Gita — Karma Yoga (Chapter 2, Verse 47)
  {
    id: "passage_gita_01",
    work_id: "bhagavad_gita",
    author_id: "vyasa_gita",
    domain: "wisdom",
    language: "sa",
    script: "devanagari",
    original_text: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥",
    transliteration: "Karmanye vadhikaraste ma phaleshu kadachana;\nMa karma-phala-hetur bhur ma te sango 'stv akarmani.",
    translation_en: "You have a right only to perform your prescribed action, but never to the fruits of action. Never consider yourself the cause of the results, nor let your mind be drawn to inaction.",
    meaning: "Pour 100% of your energy and devotion into the present effort. Do not drain your cognitive stamina by fretting over future outcomes you cannot dictate.",
    why_it_matters: "The ultimate antidote to performance anxiety, fear of exam failure, and competitive dread.",
    how_it_helps: "Detaches your self-worth from external outcomes, freeing up 100% of your working memory for the work at hand.",
    actionable_steps: [
      "Focus entirely on today's single revision topic or project task.",
      "Whenever the worry 'What if I fail?' arises, mentally repeat: 'My work is mine; the outcome belongs to time.'",
      "Celebrate your effort today regardless of the scoreboard.",
    ],
    mood_tags: ["anxiety", "overwhelm", "focus"],
    focus_tags: ["studies", "career", "life_philosophy"],
    keywords: ["gita", "karma", "action", "exam", "result", "future", "worry", "duty", "krishna"],
  },

  // 5. Kabir Das — Dheere Dheere Re Mana
  {
    id: "passage_kabir_01",
    work_id: "bhagavad_gita", // wisdom tradition
    author_id: "kabir_das",
    domain: "shayari",
    language: "hi",
    script: "devanagari",
    original_text: "धीरे धीरे रे मना, धीरे सब कुछ होय।\nमाली सींचे सौ घड़ा, ॠतु आए फल होय॥",
    transliteration: "Dheere dheere re mana, dheere sab kuch hoy;\nMaali seenche sau ghada, ritu aaye phal hoy.",
    translation_en: "O mind, have patience; everything happens at its natural pace.\nEven if the gardener pours a hundred pots of water, fruit only arrives when the season comes.",
    meaning: "Organic growth obeys its own inner laws. No amount of panicked rush can force a seed to bloom before its season.",
    why_it_matters: "Brings immense solace when you have been working hard for months but results seem painfully slow.",
    how_it_helps: "Lowers cortisol and eliminates the frustration of comparing your early chapter with another's mature chapter.",
    actionable_steps: [
      "Acknowledge that planting seeds and harvesting fruit do not happen in the same season.",
      "Keep watering your daily routine with patience and quiet faith.",
      "Rest tonight knowing your invisible roots are deepening.",
    ],
    mood_tags: ["anxiety", "sadness", "seeking_peace"],
    focus_tags: ["habits", "studies", "wellbeing"],
    keywords: ["kabir", "patience", "slow", "growth", "results", "hurry", "time", "dheere"],
  },

  // 6. Mirza Ghalib — Hazaron Khwaishein
  {
    id: "passage_ghalib_01",
    work_id: "diwan_e_ghalib",
    author_id: "mirza_ghalib",
    domain: "shayari",
    language: "ur",
    script: "nastaliq",
    original_text: "ہزاروں خواہشیں ایسی کہ ہر خواہش پہ دم نکلے\nبہت نکلے مرے ارمان لیکن پھر بھی کم نکلے",
    transliteration: "Hazaron khwahishein aisi ke har khwahish pe dam nikle;\nBahut nikle mere armaan lekin phir bhi kam nikle.",
    translation_en: "Thousands of desires such that each desire commands life's breath;\nMany of my yearnings were fulfilled, yet so many still remain.",
    meaning: "The human heart is an infinite vessel of desires. To want, to yearn, and yet to find yourself ever-seeking is the quintessential beauty and melancholy of human life.",
    why_it_matters: "Validates restless ambition while teaching a gentle, wry acceptance of our insatiable nature.",
    how_it_helps: "Provides poetic catharsis, transforming insatiable longing into artistic wonder.",
    actionable_steps: [
      "Notice one ambition you chased relentlessly in the past that you now take for granted.",
      "Smile at the mind's perpetual thirst for more without letting it rob you of today's contentment.",
      "Write down one simple blessing in your room right now.",
    ],
    mood_tags: ["loneliness", "ambition", "night_stillness"],
    focus_tags: ["life_philosophy", "wellbeing"],
    keywords: ["ghalib", "shayari", "desire", "khwaish", "longing", "yearning", "urdu", "poetry"],
  },

  // 7. Gulzar — Waqt Rehta Nahi
  {
    id: "passage_gulzar_01",
    work_id: "diwan_e_ghalib",
    author_id: "gulzar",
    domain: "shayari",
    language: "ur",
    script: "nastaliq",
    original_text: "وقت رہتا نہیں کہیں ٹِک کر\nعادت اس کی بھی آدمی سی ہے",
    transliteration: "Waqt rehta nahi kahin tik kar,\naadat is ki bhi aadmi si hai.",
    translation_en: "Time never remains stationed in one place;\nIts habit, too, is just like a restless human being.",
    meaning: "Just as joy passes into memory, grief and hardship too are incapable of standing still. Whatever heavy cloud hangs over you today will inevitably move along the sky.",
    why_it_matters: "A tender, grounding reminder of the impermanence of heartbreak, failure, or grief.",
    how_it_helps: "Restores psychological perspective during painful seasons of transition.",
    actionable_steps: [
      "Remind yourself: 'This feeling is real, but it is not permanent.'",
      "Give yourself grace to feel down today without concluding your future is doomed.",
      "Drink a warm cup of water and sleep early tonight.",
    ],
    mood_tags: ["sadness", "grief", "seeking_peace"],
    focus_tags: ["wellbeing", "relationships"],
    keywords: ["gulzar", "waqt", "time", "pain", "sad", "sadness", "passing", "temporary"],
  },

  // 8. Allama Iqbal — Sitaron Se Aage
  {
    id: "passage_iqbal_01",
    work_id: "diwan_e_ghalib",
    author_id: "allama_iqbal",
    domain: "shayari",
    language: "ur",
    script: "nastaliq",
    original_text: "ستاروں سے آگے جہاں اور بھی ہیں\nابھی عشق کے امتحاں اور بھی ہیں",
    transliteration: "Sitaron se aage jahan aur bhi hain,\nabhi ishq ke imtihaan aur bhi hain.",
    translation_en: "Beyond these known stars lie countless other worlds;\nThere are yet more trials and heights awaiting your passion.",
    meaning: "Do not let a single setback or narrow milestone define the boundaries of your existence. Your spirit was crafted to soar across boundless horizons.",
    why_it_matters: "Ignites resilience and fire when an exam result or career setback feels like the end of the world.",
    how_it_helps: "Broadens narrow tunnel vision into expansive, forward-looking courage.",
    actionable_steps: [
      "Lift your gaze from your immediate frustration to the 5-year horizon.",
      "Recognize that this setback is merely a chapter, not your whole book.",
      "Take one bold step forward today toward your broader calling.",
    ],
    mood_tags: ["ambition", "seeking_peace", "overwhelm"],
    focus_tags: ["studies", "career", "life_philosophy"],
    keywords: ["iqbal", "stars", "sitaron", "courage", "failure", "wings", "future", "dream"],
  },

  // 9. Rumi — The Wound
  {
    id: "passage_rumi_01",
    work_id: "the_prophet",
    author_id: "rumi",
    domain: "poetry",
    language: "en",
    script: "latin",
    original_text: "The wound is the place where the Light enters you.",
    translation_en: "The wound is the place where the Light enters you.",
    meaning: "Your fractures and vulnerabilities are not failures. They break open hardened armor and make room for true wisdom, empathy, and renewal.",
    why_it_matters: "Reframes suffering from a senseless tragedy into a crucible of spiritual maturity.",
    how_it_helps: "Fosters self-compassion and eases toxic shame.",
    actionable_steps: [
      "Place your hand gently over your chest and acknowledge your hurt without judgment.",
      "Notice how your own pain has made you kinder to others who struggle.",
      "Treat yourself today as you would treat a cherished friend.",
    ],
    mood_tags: ["grief", "sadness", "seeking_peace"],
    focus_tags: ["wellbeing", "relationships"],
    keywords: ["rumi", "wound", "light", "healing", "broken", "heart", "pain", "growth"],
  },

  // 10. James Clear — 1% Compounding
  {
    id: "passage_clear_01",
    work_id: "atomic_habits",
    author_id: "james_clear",
    domain: "guidance",
    language: "en",
    script: "latin",
    original_text: "You do not rise to the level of your goals. You fall to the level of your systems. Small daily 1% improvements accumulate into profound transformation.",
    translation_en: "You do not rise to the level of your goals. You fall to the level of your systems. Small daily 1% improvements accumulate into profound transformation.",
    meaning: "Forget heroic bursts of willpower. Design simple, friction-free daily systems that make progress automatic even on your lowest-energy days.",
    why_it_matters: "Cures all-or-nothing thinking where you either study 12 hours or surrender to procrastination.",
    how_it_helps: "Reduces activation energy and eliminates guilt-driven procrastination.",
    actionable_steps: [
      "Shrink your current task down to a '2-minute entry rule'.",
      "Lay out your books or tools tonight so starting tomorrow requires zero friction.",
      "Never miss twice: if you slip today, return gently tomorrow.",
    ],
    mood_tags: ["focus", "ambition", "overwhelm"],
    focus_tags: ["habits", "studies", "career"],
    keywords: ["habits", "systems", "consistency", "atomic", "clear", "goals", "routine", "discipline"],
  },

  // 11. Eckhart Tolle — Present Moment Stillness
  {
    id: "passage_tolle_01",
    work_id: "the_power_of_now",
    author_id: "eckhart_tolle",
    domain: "philosophy",
    language: "en",
    script: "latin",
    original_text: "Realize deeply that the present moment is all you have. Make the NOW the primary focus of your life.",
    translation_en: "Realize deeply that the present moment is all you have. Make the NOW the primary focus of your life.",
    meaning: "All regret lives in an unchangeable past; all anxiety lives in an imagined future. The present moment alone is where life actually breathes and power resides.",
    why_it_matters: "Immediately grounds runaway panic and mental catastrophic scenario forecasting.",
    how_it_helps: "Silences the default mode network (DMN), returning physiological equilibrium.",
    actionable_steps: [
      "Look around your room right now and name 3 physical objects in quiet detail.",
      "Feel the physical sensation of your breath entering and leaving your nostrils.",
      "Ask yourself: 'What is actually lacking in this exact second?'",
    ],
    mood_tags: ["anxiety", "overwhelm", "seeking_peace"],
    focus_tags: ["wellbeing", "life_philosophy"],
    keywords: ["now", "presence", "tolle", "overthinking", "stillness", "calm", "anxiety", "mindfulness"],
  },
];

// ============================================================================
// AUDIO CATALOG (EchoSoul Masters vs. Commercial Metadata)
// ============================================================================

export const AUDIO_CATALOG: AudioItemEntity[] = [
  // Master Vocal Tracks (Local Authenticated MP3s)
  {
    id: "track_jagjit_01",
    title: "Woh Kagaz Ki Kashti",
    artist: "Jagjit Singh & Chitra Singh",
    genre: "Classic Ghazal / Nostalgia",
    audio_source_type: "commercial_master",
    audio_url: "/audio/track_hi_01.mp3",
    duration_seconds: 242,
    mood_tags: ["sadness", "seeking_peace", "night_stillness"],
    focus_tags: ["wellbeing", "life_philosophy"],
    description: "Authentic vocal master recording. A heart-stirring ode to childhood innocence, rainy afternoons, and quiet nostalgia.",
  },
  {
    id: "track_jagjit_02",
    title: "Jhuki Jhuki Si Nazar",
    artist: "Jagjit Singh",
    genre: "Classic Ghazal / Intimacy",
    audio_source_type: "commercial_master",
    audio_url: "/audio/track_hi_02.mp3",
    duration_seconds: 301,
    mood_tags: ["seeking_peace", "gratitude", "night_stillness"],
    focus_tags: ["relationships", "wellbeing"],
    description: "Soft acoustic ghazal with strings and soothing vocal cadence, perfect for evening decompression.",
  },
  {
    id: "track_jagjit_03",
    title: "Chithi Na Koi Sandesh",
    artist: "Jagjit Singh",
    genre: "Classic Ghazal / Solace",
    audio_source_type: "commercial_master",
    audio_url: "/audio/track_hi_03.mp3",
    duration_seconds: 388,
    mood_tags: ["grief", "sadness", "loneliness"],
    focus_tags: ["wellbeing", "relationships"],
    description: "An emotionally cathartic master vocal tracking grief, honoring loved ones, and letting tears gently flow.",
  },

  // EchoSoul Original Scientific Solfeggio Melodies
  {
    id: "track_solfeggio_432",
    title: "Mountain Calm (432 Hz)",
    artist: "Solenne Sanctuary Acoustics",
    genre: "Solfeggio Natural Frequency",
    audio_source_type: "echosoul_original",
    solfeggio_frequency_hz: 432,
    duration_seconds: 1800,
    mood_tags: ["focus", "seeking_peace"],
    focus_tags: ["studies", "wellbeing"],
    description: "Tuned to 432 Hz mathematical resonance, synchronizing brain hemispheres for deep cognitive focus and mental equilibrium.",
    scientific_rationale: "Aligns with Schumann planetary resonance, reducing heart rate variability stress spikes.",
  },
  {
    id: "track_solfeggio_528",
    title: "Forest Retreat (528 Hz)",
    artist: "Solenne Sanctuary Acoustics",
    genre: "Solfeggio Transformation Tone",
    audio_source_type: "echosoul_original",
    solfeggio_frequency_hz: 528,
    duration_seconds: 1800,
    mood_tags: ["overwhelm", "anxiety", "seeking_peace"],
    focus_tags: ["wellbeing"],
    description: "Known clinically as the Miracle Tone, 528 Hz stimulates parasympathetic vagal nerve relaxation.",
    scientific_rationale: "Enhances nitric oxide production in blood vessels, promoting profound muscular ease.",
  },
  {
    id: "track_solfeggio_174",
    title: "Cozy Room (174 Hz)",
    artist: "Solenne Sanctuary Acoustics",
    genre: "Solfeggio Anesthetic Grounding",
    audio_source_type: "echosoul_original",
    solfeggio_frequency_hz: 174,
    duration_seconds: 1800,
    mood_tags: ["overwhelm", "night_stillness"],
    focus_tags: ["wellbeing", "habits"],
    description: "A low soothing foundational drone that relieves somatic tension in the chest and shoulders.",
  },

  // Commercial Tracks (Curated Metadata Registry)
  {
    id: "track_kun_faya_kun",
    title: "Kun Faya Kun",
    artist: "A.R. Rahman, Javed Ali, Mohit Chauhan",
    genre: "Sufi Devotional / Qawwali",
    audio_source_type: "commercial_master",
    duration_seconds: 472,
    mood_tags: ["seeking_peace", "gratitude", "overwhelm"],
    focus_tags: ["wellbeing", "life_philosophy"],
    description: "Spiritual sanctuary anthem from Rockstar. Invokes utter surrender, inner quietude, and profound grace.",
  },
  {
    id: "track_phir_le_aya_dil",
    title: "Phir Le Aya Dil",
    artist: "Arijit Singh / Rekha Bhardwaj",
    genre: "Contemporary Semi-Classical",
    audio_source_type: "commercial_master",
    duration_seconds: 305,
    mood_tags: ["sadness", "loneliness", "night_stillness"],
    focus_tags: ["relationships", "wellbeing"],
    description: "A hauntingly tender acoustic melody on longing, memories, and the quiet resilience of the human heart.",
  },
];

// ============================================================================
// VISUAL SANCTUARIES & BREATHING CADENCES
// ============================================================================

export const VISUAL_SANCTUARIES: VisualSanctuaryEntity[] = [
  {
    id: "mountain_calm",
    title: "Mountain Calm",
    category: "nature",
    image_path: "/visual-worlds/mountain_calm.jpg",
    solfeggio_frequency_hz: 432,
    breathing_profile: {
      name: "Box Breathing",
      ratio: "4-4-4-4",
      inhale_sec: 4,
      hold_sec: 4,
      exhale_sec: 4,
      rest_sec: 4,
    },
    mood_tags: ["focus", "seeking_peace"],
    tagline: "Breathe. Slow down. Be here.",
    description: "Clear mountain lake reflecting pristine alpine skies. Calibrated for centered decision-making and mental equilibrium.",
  },
  {
    id: "forest_retreat",
    title: "Forest Retreat",
    category: "nature",
    image_path: "/visual-worlds/forest_retreat.jpg",
    solfeggio_frequency_hz: 528,
    breathing_profile: {
      name: "Dr. Andrew Weil 4-7-8",
      ratio: "4-7-8-1",
      inhale_sec: 4,
      hold_sec: 7,
      exhale_sec: 8,
      rest_sec: 1,
    },
    mood_tags: ["anxiety", "overwhelm", "seeking_peace"],
    tagline: "Ground yourself in nature.",
    description: "Sun-dappled canopy with gentle mossy quietude. Extended 8-second exhalations rapidly tone the vagus nerve.",
  },
  {
    id: "cozy_room",
    title: "Cozy Fireplace Room",
    category: "rooms",
    image_path: "/visual-worlds/cozy_room.jpg",
    solfeggio_frequency_hz: 174,
    breathing_profile: {
      name: "Grounding 4-4-6-2",
      ratio: "4-4-6-2",
      inhale_sec: 4,
      hold_sec: 4,
      exhale_sec: 6,
      rest_sec: 2,
    },
    mood_tags: ["overwhelm", "night_stillness", "loneliness"],
    tagline: "Warmth, safety, and stillness.",
    description: "Crackling hearth, wooden rafters, and soft amber lamplight. A haven to shed the day's heaviness.",
  },
  {
    id: "starry_skies",
    title: "Starry Skies",
    category: "space",
    image_path: "/visual-worlds/starry_skies.jpg",
    solfeggio_frequency_hz: 852,
    breathing_profile: {
      name: "Heart Coherence 5.5-0-5.5",
      ratio: "5.5-0-5.5-0",
      inhale_sec: 5.5,
      hold_sec: 0,
      exhale_sec: 5.5,
      rest_sec: 0,
    },
    mood_tags: ["seeking_peace", "night_stillness", "gratitude"],
    tagline: "The universe holds space for you.",
    description: "Deep cosmic horizon illuminated by gentle starlight. Harmonizes cardiovascular rhythms and mental peace.",
  },
  {
    id: "ocean_breeze",
    title: "Ocean Breeze",
    category: "nature",
    image_path: "/visual-worlds/ocean_breeze.jpg",
    solfeggio_frequency_hz: 396,
    breathing_profile: {
      name: "Deep Release 5-2-7-2",
      ratio: "5-2-7-2",
      inhale_sec: 5,
      hold_sec: 2,
      exhale_sec: 7,
      rest_sec: 2,
    },
    mood_tags: ["sadness", "overwhelm", "seeking_peace"],
    tagline: "Let the waves carry your thoughts.",
    description: "Endless rolling tide under morning sea mist. Washes away accumulated emotional tension.",
  },
  {
    id: "city_lights",
    title: "City Lights",
    category: "cities",
    image_path: "/visual-worlds/city_lights.jpg",
    solfeggio_frequency_hz: 639,
    breathing_profile: {
      name: "Harmony 4-2-4-2",
      ratio: "4-2-4-2",
      inhale_sec: 4,
      hold_sec: 2,
      exhale_sec: 4,
      rest_sec: 2,
    },
    mood_tags: ["ambition", "focus"],
    tagline: "Energy, quiet pulse, and possibility.",
    description: "A high vantage over rain-slicked city boulevards. For channeling ambition into quiet, focused execution.",
  },
];

// ============================================================================
// CONTEXTUAL RETRIEVAL & QUERY MATCHER
// ============================================================================

export function queryContentUniverse(queryText: string, mood?: ContentMood, focus?: LifeFocus): {
  passage: PassageEntity;
  work: LiteraryWorkEntity;
  author: AuthorEntity;
  audio: AudioItemEntity;
  sanctuary: VisualSanctuaryEntity;
} {
  const q = queryText.toLowerCase();

  // Find best matching passage
  let matchedPassage = PASSAGES_DATABASE.find((p) =>
    p.keywords.some((k) => q.includes(k))
  );

  if (!matchedPassage && mood) {
    matchedPassage = PASSAGES_DATABASE.find((p) => p.mood_tags.includes(mood));
  }

  if (!matchedPassage && focus) {
    matchedPassage = PASSAGES_DATABASE.find((p) => p.focus_tags.includes(focus));
  }

  // Default to Marcus Aurelius / Meditations
  if (!matchedPassage) {
    matchedPassage = PASSAGES_DATABASE[0];
  }

  const work = LITERARY_WORKS[matchedPassage.work_id] ?? LITERARY_WORKS.meditations;
  const author = AUTHORS[matchedPassage.author_id] ?? AUTHORS.marcus_aurelius;

  // Find best audio based on user's active mood & focus first, then passage tags
  let matchedAudio = AUDIO_CATALOG.find((a) =>
    (mood && a.mood_tags.includes(mood)) ||
    (focus && a.focus_tags.includes(focus))
  );
  if (!matchedAudio) {
    matchedAudio = AUDIO_CATALOG.find((a) =>
      a.mood_tags.some((m) => matchedPassage!.mood_tags.includes(m))
    );
  }
  if (!matchedAudio) matchedAudio = AUDIO_CATALOG[0];

  // Find best visual sanctuary based on user's active mood first, then passage tags
  let matchedSanctuary = VISUAL_SANCTUARIES.find((s) =>
    mood && s.mood_tags.includes(mood)
  );
  if (!matchedSanctuary) {
    matchedSanctuary = VISUAL_SANCTUARIES.find((s) =>
      s.mood_tags.some((m) => matchedPassage!.mood_tags.includes(m))
    );
  }
  if (!matchedSanctuary) matchedSanctuary = VISUAL_SANCTUARIES[0];

  return {
    passage: matchedPassage,
    work,
    author,
    audio: matchedAudio,
    sanctuary: matchedSanctuary,
  };
}

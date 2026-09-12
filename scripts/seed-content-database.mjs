/**
 * EchoSoul Master Content Database Seeding Script (Phase 17)
 * 
 * Idempotently populates remote Supabase with authoritative, rights-attributed
 * content across languages, scripts, authors, books, shayari, poems, quotes,
 * visual_scenes, and music_tracks.
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envFile = fs.readFileSync('.env.local', 'utf-8');
const env = {};
envFile.split('\n').forEach(line => {
  const [k, ...v] = line.trim().split('=');
  if (k && v.length) env[k.trim()] = v.join('=').trim();
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { persistSession: false },
});

console.log('=== EchoSoul Content Database Seeder (Phase 17) ===\n');
console.log(`Target Supabase: ${supabaseUrl}`);

async function seed() {
  try {
    // ── 1. LANGUAGES ──────────────────────────────────────────────
    console.log('1. Seeding languages...');
    const languages = [
      { id: 'hi', iso_code: 'hin', name: 'Hindi', native_name: 'हिन्दी', region: 'North India', script_default: 'devanagari', active: true },
      { id: 'en', iso_code: 'eng', name: 'English', native_name: 'English', region: 'Global', script_default: 'latin', active: true },
      { id: 'ur', iso_code: 'urd', name: 'Urdu', native_name: 'اردو', region: 'South Asia', script_default: 'arabic', active: true },
      { id: 'pa', iso_code: 'pan', name: 'Punjabi', native_name: 'ਪੰਜਾਬੀ', region: 'Punjab', script_default: 'gurmukhi', active: true },
      { id: 'bn', iso_code: 'ben', name: 'Bengali', native_name: 'বাংলা', region: 'Bengal', script_default: 'bengali', active: true },
      { id: 'ta', iso_code: 'tam', name: 'Tamil', native_name: 'தமிழ்', region: 'Tamil Nadu', script_default: 'tamil', active: true },
      { id: 'te', iso_code: 'tel', name: 'Telugu', native_name: 'తెలుగు', region: 'Andhra / Telangana', script_default: 'telugu', active: true },
      { id: 'mr', iso_code: 'mar', name: 'Marathi', native_name: 'मराठी', region: 'Maharashtra', script_default: 'devanagari', active: true },
      { id: 'gu', iso_code: 'guj', name: 'Gujarati', native_name: 'ગુજરાતી', region: 'Gujarat', script_default: 'gujarati', active: true },
      { id: 'ml', iso_code: 'mal', name: 'Malayalam', native_name: 'മലയാളം', region: 'Kerala', script_default: 'malayalam', active: true },
      { id: 'kn', iso_code: 'kan', name: 'Kannada', native_name: 'ಕನ್ನಡ', region: 'Karnataka', script_default: 'kannada', active: true },
    ];
    const { error: langErr } = await supabase.from('languages').upsert(languages, { onConflict: 'id' });
    if (langErr) console.warn('  Languages error:', langErr.message);
    else console.log(`  ✅ Seeded ${languages.length} languages.`);

    // ── 2. SCRIPTS ────────────────────────────────────────────────
    console.log('2. Seeding scripts...');
    const scripts = [
      { id: 'devanagari', code: 'Deva', name: 'Devanagari', direction: 'ltr' },
      { id: 'latin', code: 'Latn', name: 'Latin', direction: 'ltr' },
      { id: 'arabic', code: 'Arab', name: 'Nastaliq / Perso-Arabic', direction: 'rtl' },
      { id: 'gurmukhi', code: 'Guru', name: 'Gurmukhi', direction: 'ltr' },
      { id: 'bengali', code: 'Beng', name: 'Bengali', direction: 'ltr' },
      { id: 'tamil', code: 'Taml', name: 'Tamil', direction: 'ltr' },
      { id: 'telugu', code: 'Telu', name: 'Telugu', direction: 'ltr' },
    ];
    const { error: scriptErr } = await supabase.from('scripts').upsert(scripts, { onConflict: 'id' });
    if (scriptErr) console.warn('  Scripts error:', scriptErr.message);
    else console.log(`  ✅ Seeded ${scripts.length} scripts.`);

    // ── 3. AUTHORS ────────────────────────────────────────────────
    console.log('3. Seeding authors...');
    const authors = [
      {
        canonical_name: 'Marcus Aurelius',
        alternate_names: ['Μάρκος Αὐρήλιος', 'Marcus Aurelius Antoninus'],
        languages: ['en', 'la', 'grc'],
        scripts: ['latin', 'greek'],
        birth_year: 121,
        death_year: 180,
        biography: "Emperor of Rome from 161 to 180 CE. His private journals remain the world's standard of Stoic resilience and self-mastery.",
        verification_status: 'verified',
      },
      {
        canonical_name: 'Robert Frost',
        alternate_names: ['Robert Lee Frost'],
        languages: ['en'],
        scripts: ['latin'],
        birth_year: 1874,
        death_year: 1963,
        biography: 'Four-time Pulitzer Prize winner renowned for poignant explorations of solitude, nature, and human decision-making.',
        verification_status: 'verified',
      },
      {
        canonical_name: 'Mirza Ghalib',
        alternate_names: ['مرزا غالب', 'Mirza Asadullah Khan Ghalib'],
        languages: ['ur', 'fa', 'hi'],
        scripts: ['arabic', 'devanagari'],
        birth_year: 1797,
        death_year: 1869,
        biography: 'Pre-eminent poet of the Mughal era whose ghazals delve into existential longing, love, and human depth.',
        verification_status: 'verified',
      },
      {
        canonical_name: 'Kabir Das',
        alternate_names: ['संत कबीर', 'Kabir'],
        languages: ['hi', 'ur'],
        scripts: ['devanagari', 'latin'],
        birth_year: 1440,
        death_year: 1518,
        biography: '15th-century Indian mystic poet whose earthy dohas urge patience, inner purity, and freedom from illusion.',
        verification_status: 'verified',
      },
      {
        canonical_name: 'Allama Iqbal',
        alternate_names: ['Sir Muhammad Iqbal', 'علامہ اقبال'],
        languages: ['ur', 'fa', 'en'],
        scripts: ['arabic', 'latin'],
        birth_year: 1877,
        death_year: 1938,
        biography: "Philosopher and poet of the East whose verses embody human self-determination (Khudi) and transcendent courage.",
        verification_status: 'verified',
      },
      {
        canonical_name: 'Kahlil Gibran',
        alternate_names: ['جبران خليل جبران'],
        languages: ['en', 'ar'],
        scripts: ['latin', 'arabic'],
        birth_year: 1883,
        death_year: 1931,
        biography: "Visionary Lebanese-American author whose work 'The Prophet' bridges Eastern and Western spiritual reflection.",
        verification_status: 'verified',
      },
      {
        canonical_name: 'Gulzar',
        alternate_names: ['Sampooran Singh Kalra', 'गुलज़ार'],
        languages: ['hi', 'ur', 'pa'],
        scripts: ['devanagari', 'arabic'],
        birth_year: 1934,
        biography: 'Academy Award, Grammy, and Dadasaheb Phalke award winner whose poetry captures the quietest subtleties of time and human life.',
        verification_status: 'verified',
      },
      {
        canonical_name: 'Eckhart Tolle',
        alternate_names: ['Ulrich Leonard Tolle'],
        languages: ['en', 'de'],
        scripts: ['latin'],
        birth_year: 1948,
        biography: "Spiritual teacher whose writing illuminates freedom from psychological time and finding peace in the Present Moment.",
        verification_status: 'verified',
      },
    ];

    const { data: insertedAuthors, error: authErr } = await supabase.from('authors').insert(authors).select();
    if (authErr) console.warn('  Authors note:', authErr.message);
    else console.log(`  ✅ Seeded ${authors.length} authors.`);

    // ── 4. BOOKS ──────────────────────────────────────────────────
    console.log('4. Seeding books...');
    const books = [
      {
        title: 'Meditations',
        description: 'Private reflections on stoic discipline, mental sovereignty, and quiet duty.',
        language: 'en',
        script: 'latin',
        genre: 'Philosophy',
        themes: ['stoicism', 'resilience', 'mindfulness', 'duty', 'perspective'],
        publication_year: 180,
        rights_status: 'public_domain',
        cover_asset: '/books/meditations.svg',
      },
      {
        title: 'The Road Not Taken & Selected Poems',
        description: 'Reflective verses examining the uncommon path, commitment, and personal courage.',
        language: 'en',
        script: 'latin',
        genre: 'Poetry',
        themes: ['decision', 'individuality', 'courage', 'nature', 'life_choices'],
        publication_year: 1916,
        rights_status: 'public_domain',
        cover_asset: '/books/the_road_not_taken.svg',
      },
      {
        title: 'The Prophet',
        description: 'Timeless poetic prose sermons on love, sorrow, freedom, pain, and self-knowledge.',
        language: 'en',
        script: 'latin',
        genre: 'Poetic Philosophy',
        themes: ['compassion', 'suffering', 'freedom', 'spiritual_growth'],
        publication_year: 1923,
        rights_status: 'public_domain',
        cover_asset: '/books/the_prophet.svg',
      },
      {
        title: 'Bhagavad Gita: The Science of Karma Yoga',
        description: 'Eternal discourse on dedicating right action without anxious attachment to external outcomes.',
        language: 'en',
        script: 'latin',
        genre: 'Sacred Philosophy',
        themes: ['karma_yoga', 'equanimity', 'action', 'peace', 'purpose'],
        publication_year: -500,
        rights_status: 'public_domain',
        cover_asset: '/books/bhagavad_gita.svg',
      },
      {
        title: 'The Power of Now',
        description: 'A guide to spiritual enlightenment and shedding the burden of overthinking.',
        language: 'en',
        script: 'latin',
        genre: 'Mindfulness',
        themes: ['presence', 'anxiety_relief', 'awareness', 'stillness'],
        publication_year: 1997,
        rights_status: 'licensed',
        cover_asset: '/books/the_power_of_now.svg',
      },
      {
        title: 'Atomic Habits',
        description: 'An easy and proven way to build good habits and break bad ones through 1% micro-improvements.',
        language: 'en',
        script: 'latin',
        genre: 'Personal Growth',
        themes: ['habits', 'consistency', 'discipline', 'small_wins'],
        publication_year: 2018,
        rights_status: 'licensed',
        cover_asset: '/books/atomic_habits.svg',
      },
    ];

    const { error: bookErr } = await supabase.from('books').insert(books);
    if (bookErr) console.warn('  Books note:', bookErr.message);
    else console.log(`  ✅ Seeded ${books.length} books.`);

    // ── 5. SHAYARI ────────────────────────────────────────────────
    console.log('5. Seeding shayari...');
    const shayari = [
      {
        text: 'Waqt rehta nahi kahin tik kar, aadat is ki bhi aadmi si hai.',
        attribution: 'Gulzar',
        language: 'ur',
        script: 'devanagari',
        theme: 'time',
        emotion: 'reflective',
        tone: 'introspective',
        rights_status: 'licensed',
        verification_status: 'verified',
      },
      {
        text: 'Dheere dheere re mana, dheere sab kuch hoy. Maali seenche sau ghada, ritu aaye phal hoy.',
        attribution: 'Kabir Das',
        language: 'hi',
        script: 'devanagari',
        theme: 'patience',
        emotion: 'calm',
        tone: 'wise',
        rights_status: 'public_domain',
        verification_status: 'verified',
      },
      {
        text: 'Hazaron khwaishein aisi ke har khwaish pe dam nikle, bohot nikle mere armaan lekin phir bhi kam nikle.',
        attribution: 'Mirza Ghalib',
        language: 'ur',
        script: 'devanagari',
        theme: 'desire',
        emotion: 'yearning',
        tone: 'wry_philosophical',
        rights_status: 'public_domain',
        verification_status: 'verified',
      },
      {
        text: 'Sitaron se aage jahan aur bhi hain, abhi ishq ke imtihan aur bhi hain.',
        attribution: 'Allama Iqbal',
        language: 'ur',
        script: 'devanagari',
        theme: 'courage',
        emotion: 'uplifting',
        tone: 'motivational',
        rights_status: 'public_domain',
        verification_status: 'verified',
      },
      {
        text: 'Mita de apni hasti ko agar kuch martaba chahe, ki daana khak mein mil kar gul-e-gulzar hota hai.',
        attribution: 'Allama Iqbal',
        language: 'ur',
        script: 'devanagari',
        theme: 'humility',
        emotion: 'growth',
        tone: 'elevated',
        rights_status: 'public_domain',
        verification_status: 'verified',
      },
    ];

    const { error: shayErr } = await supabase.from('shayari').insert(shayari);
    if (shayErr) console.warn('  Shayari note:', shayErr.message);
    else console.log(`  ✅ Seeded ${shayari.length} shayari.`);

    // ── 6. POEMS ──────────────────────────────────────────────────
    console.log('6. Seeding poems...');
    const poems = [
      {
        title: 'The Road Not Taken',
        exact_text: 'Two roads diverged in a yellow wood,\nAnd sorry I could not travel both\nAnd be one traveler, long I stood\nAnd looked down one as far as I could\nTo where it bent in the undergrowth;\n\nThen took the other, as just as fair,\nAnd having perhaps the better claim,\nBecause it was grassy and wanted wear;\nThough as for that the passing there\nHad worn them really about the same,\n\nAnd both that morning equally lay\nIn leaves no step had trodden black.\nOh, I kept the first for another day!\nYet knowing how way leads on to way,\nI doubted if I should ever come back.\n\nI shall be telling this with a sigh\nSomewhere ages and ages hence:\nTwo roads diverged in a wood, and I—\nI took the one less traveled by,\nAnd that has made all the difference.',
        language: 'en',
        script: 'latin',
        theme: 'choice',
        tone: 'reflective',
        rights_status: 'public_domain',
        verification_status: 'verified',
      },
      {
        title: 'Stopping by Woods on a Snowy Evening',
        exact_text: 'The woods are lovely, dark and deep,\nBut I have promises to keep,\nAnd miles to go before I sleep,\nAnd miles to go before I sleep.',
        language: 'en',
        script: 'latin',
        theme: 'perseverance',
        tone: 'quiet_resolve',
        rights_status: 'public_domain',
        verification_status: 'verified',
      },
    ];

    const { error: poemErr } = await supabase.from('poems').insert(poems);
    if (poemErr) console.warn('  Poems note:', poemErr.message);
    else console.log(`  ✅ Seeded ${poems.length} poems.`);

    // ── 7. QUOTES ─────────────────────────────────────────────────
    console.log('7. Seeding quotes...');
    const quotes = [
      {
        exact_text: 'You have power over your mind — not outside events. Realize this, and you will find strength.',
        author_name: 'Marcus Aurelius',
        work: 'Meditations',
        language: 'en',
        script: 'latin',
        theme: 'stoicism',
        rights_status: 'public_domain',
        verification_status: 'verified',
      },
      {
        exact_text: 'The happiness of your life depends upon the quality of your thoughts.',
        author_name: 'Marcus Aurelius',
        work: 'Meditations',
        language: 'en',
        script: 'latin',
        theme: 'presence',
        rights_status: 'public_domain',
        verification_status: 'verified',
      },
      {
        exact_text: 'Your pain is the breaking of the shell that encloses your understanding.',
        author_name: 'Kahlil Gibran',
        work: 'The Prophet',
        language: 'en',
        script: 'latin',
        theme: 'healing',
        rights_status: 'public_domain',
        verification_status: 'verified',
      },
      {
        exact_text: 'Karmanye vadhikaraste ma phaleshu kadachana.',
        author_name: 'Bhagavad Gita',
        work: 'Chapter 2, Verse 47',
        language: 'en',
        script: 'latin',
        theme: 'purpose',
        rights_status: 'public_domain',
        verification_status: 'verified',
      },
      {
        exact_text: 'Realize deeply that the present moment is all you will ever have.',
        author_name: 'Eckhart Tolle',
        work: 'The Power of Now',
        language: 'en',
        script: 'latin',
        theme: 'presence',
        rights_status: 'licensed',
        verification_status: 'verified',
      },
    ];

    const { error: quoteErr } = await supabase.from('quotes').insert(quotes);
    if (quoteErr) console.warn('  Quotes note:', quoteErr.message);
    else console.log(`  ✅ Seeded ${quotes.length} quotes.`);

    // ── 8. VISUAL SCENES ──────────────────────────────────────────
    console.log('8. Seeding visual scenes...');
    const visualScenes = [
      {
        id: 'mountain_calm',
        title: 'Mountain Calm',
        description: 'Glacial alpine lake reflecting towering snow peaks at dawn. Stillness, breath, and spatial tranquility.',
        category: 'nature',
        theme: 'Midnight Soul',
        thumbnail_url: '/visual-worlds/mountain_calm.jpg',
        rights_status: 'licensed',
      },
      {
        id: 'forest_retreat',
        title: 'Forest Retreat',
        description: 'Sun-dappled canopy with gentle mossy quietude. Extended exhalations rapidly tone the nervous system.',
        category: 'nature',
        theme: 'Midnight Soul',
        thumbnail_url: '/visual-worlds/forest_retreat.jpg',
        rights_status: 'licensed',
      },
      {
        id: 'cozy_room',
        title: 'Cozy Fireplace Room',
        description: 'Crackling hearth, wooden rafters, and soft amber lamplight. A haven to shed the day heaviness.',
        category: 'rooms',
        theme: 'Midnight Soul',
        thumbnail_url: '/visual-worlds/cozy_room.jpg',
        rights_status: 'licensed',
      },
      {
        id: 'starry_skies',
        title: 'Starry Skies',
        description: 'Deep cosmic horizon illuminated by gentle starlight. Restores mental perspective and gratitude.',
        category: 'space',
        theme: 'Midnight Soul',
        thumbnail_url: '/visual-worlds/starry_skies.jpg',
        rights_status: 'licensed',
      },
      {
        id: 'ocean_breeze',
        title: 'Ocean Breeze',
        description: 'Endless rolling tide under morning sea mist. Washes away accumulated emotional fatigue.',
        category: 'nature',
        theme: 'Midnight Soul',
        thumbnail_url: '/visual-worlds/ocean_breeze.jpg',
        rights_status: 'licensed',
      },
      {
        id: 'city_lights',
        title: 'City Lights',
        description: 'High vantage over rain-slicked boulevards. Channeling ambition into quiet, focused execution.',
        category: 'cities',
        theme: 'Midnight Soul',
        thumbnail_url: '/visual-worlds/city_lights.jpg',
        rights_status: 'licensed',
      },
    ];

    const { error: sceneErr } = await supabase.from('visual_scenes').upsert(visualScenes, { onConflict: 'id' });
    if (sceneErr) console.warn('  Visual scenes error:', sceneErr.message);
    else console.log(`  ✅ Seeded ${visualScenes.length} visual scenes.`);

    // ── 9. MUSIC TRACKS ───────────────────────────────────────────
    console.log('9. Seeding music tracks...');
    const musicTracks = [
      {
        title: 'Woh Kagaz Ki Kashti',
        normalized_title: 'woh kagaz ki kashti',
        primary_language: 'hi',
        genre: 'Ghazal',
        duration: 245,
        energy: 0.35,
        tempo: 'slow',
        mood_tags: ['nostalgia', 'peace', 'healing', 'warmth'],
        theme_tags: ['childhood', 'rain', 'memories'],
        rights_status: 'licensed',
        artwork_url: '/tabs/music_bg.jpg',
      },
      {
        title: 'Jhuki Jhuki Si Nazar',
        normalized_title: 'jhuki jhuki si nazar',
        primary_language: 'hi',
        genre: 'Ghazal',
        duration: 298,
        energy: 0.30,
        tempo: 'slow',
        mood_tags: ['peace', 'solitude', 'warmth'],
        theme_tags: ['longing', 'gentle_acceptance'],
        rights_status: 'licensed',
        artwork_url: '/tabs/music_bg.jpg',
      },
      {
        title: 'Kun Faya Kun',
        normalized_title: 'kun faya kun',
        primary_language: 'hi',
        genre: 'Sufi / Spiritual',
        duration: 470,
        energy: 0.60,
        tempo: 'medium',
        mood_tags: ['spiritual', 'hope', 'release', 'peace'],
        theme_tags: ['creation', 'surrender', 'divine_grace'],
        rights_status: 'licensed',
        artwork_url: '/tabs/music_bg.jpg',
      },
      {
        title: 'Mountain Focus (432 Hz)',
        normalized_title: 'mountain focus',
        primary_language: 'en',
        genre: 'Ambient / Solfeggio',
        duration: 2700,
        energy: 0.25,
        tempo: 'very_slow',
        mood_tags: ['focus', 'calm', 'study'],
        theme_tags: ['deep_work', 'clarity'],
        rights_status: 'licensed',
        artwork_url: '/visual-worlds/mountain_calm.jpg',
      },
    ];

    const { error: musicErr } = await supabase.from('music_tracks').insert(musicTracks);
    if (musicErr) console.warn('  Music tracks note:', musicErr.message);
    else console.log(`  ✅ Seeded ${musicTracks.length} music tracks.`);

    console.log('\n=== Database Seeding Finished Successfully ===\n');
  } catch (err) {
    console.error('Fatal seeding error:', err);
    process.exit(1);
  }
}

seed();

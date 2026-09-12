/**
 * EchoSoul Automated Test: End-to-End Personalization Differentiation (Phase 16)
 * 
 * Verifies that two distinct user personas receive completely personalized,
 * unique recommendations, tones, and curated content.
 */

import { generateCuratedContextualResponse } from '../src/ai/routing/latency-router.ts';
import { queryContentUniverse } from '../src/lib/content/contentUniverse.ts';

console.log('=== EchoSoul Personalization Differentiation Test (Phase 16) ===\n');

let totalTests = 0;
let passedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passedTests++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    process.exitCode = 1;
  }
}

// User Persona A: Philosophy & Stoicism Focus
const userA = {
  profile: { name: 'Aarav', role: 'Philosophy Student' },
  preferences: { support_style: 'direct', language: 'en' },
  goals: ['Read Meditations', 'Maintain mental calm'],
  interests: ['Philosophy', 'Stoicism'],
  appearance: { theme: 'midnight_soul', environment: 'mountain_calm' },
  current_state: { mood: 'focus', focus: 'studies', time_of_day: 'morning' },
  relevant_history: [],
  relevant_moments: [],
};

// User Persona B: Poetry & Emotional Expression Focus
const userB = {
  profile: { name: 'Maya', role: 'Creative Artist' },
  preferences: { support_style: 'gentle', language: 'en' },
  goals: ['Overcome overwhelm', 'Write poetry'],
  interests: ['Poetry', 'Literature', 'Music'],
  appearance: { theme: 'sunrise_calm', environment: 'forest_retreat' },
  current_state: { mood: 'overwhelm', focus: 'wellbeing', time_of_day: 'night' },
  relevant_history: [],
  relevant_moments: [],
};

// 1. Content Universe Query Differentiation
const contentA = queryContentUniverse('Suggest a book for my studies', userA.current_state.mood, userA.current_state.focus);
const contentB = queryContentUniverse('I feel stressed and overwhelmed', userB.current_state.mood, userB.current_state.focus);

assert(contentA.passage.id !== contentB.passage.id, 'User A and User B receive different passages');
assert(contentA.author.name !== contentB.author.name || contentA.work.title !== contentB.work.title, 'User A and User B receive different authors or works');
assert(contentA.audio.id !== contentB.audio.id, 'User A and User B receive different audio recommendations');
assert(contentA.sanctuary.id !== contentB.sanctuary.id, 'User A and User B receive different visual sanctuaries');

console.log(`\n  User A (Focus: ${userA.current_state.focus}, Mood: ${userA.current_state.mood}):`);
console.log(`    Book/Work: "${contentA.work.title}" by ${contentA.author.name}`);
console.log(`    Audio: "${contentA.audio.title}"`);
console.log(`    Sanctuary: "${contentA.sanctuary.title}"`);

console.log(`\n  User B (Focus: ${userB.current_state.focus}, Mood: ${userB.current_state.mood}):`);
console.log(`    Book/Work: "${contentB.work.title}" by ${contentB.author.name}`);
console.log(`    Audio: "${contentB.audio.title}"`);
console.log(`    Sanctuary: "${contentB.sanctuary.title}"`);

// 2. Curated Contextual Response Differentiation
const respA = generateCuratedContextualResponse('Suggest a good book to read', userA, false, 'req_user_a');
const respB = generateCuratedContextualResponse('I am feeling so overwhelmed with everything', userB, false, 'req_user_b');

assert(respA.content.includes('Aarav') || respA.personalization_reason.includes('Aarav'), 'User A response addresses Aarav');
assert(respB.content.includes('Maya') || respB.personalization_reason.includes('Maya'), 'User B response addresses Maya');
assert(respA.content !== respB.content, 'User A and User B receive completely different message content');
assert(respA.intent !== respB.intent, 'User A and User B receive different intent classifications');
assert(respA.need !== respB.need, 'User A and User B receive different need classifications');

// 3. Voice Mode Differentiation
const voiceA = generateCuratedContextualResponse('Suggest a good book', userA, true, 'req_voice_a');
const voiceB = generateCuratedContextualResponse('I am overwhelmed', userB, true, 'req_voice_b');

assert(voiceA.content !== voiceB.content, 'Voice mode delivers distinct spoken responses');
assert(voiceA.content.length < 250, 'Voice A spoken response is concise (<250 chars)');
assert(voiceB.content.length < 250, 'Voice B spoken response is concise (<250 chars)');

console.log(`\n=== Personalization Verification: ${passedTests} / ${totalTests} Passed ===\n`);
if (passedTests !== totalTests) {
  process.exit(1);
}

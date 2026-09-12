/**
 * EchoSoul Automated Test: Canonical Contracts, Quality Judge & Latency Router (Phases 10-12)
 */

import { judgeResponse } from '../src/ai/quality/judge.ts';
import { validateSchema } from '../src/ai/quality/validators.ts';
import { ROUTING_POLICIES, getRouteModels } from '../src/ai/routing/latency-router.ts';

console.log('=== EchoSoul Phase 10-12 Verification Suite ===\n');

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

// ── TEST SUITE 1: ROUTING POLICIES 3-MODEL COMPLIANCE (Phase 12) ──
console.log('Test Suite 1: Routing Policies OpenRouter <= 3 Models');
for (const [key, policy] of Object.entries(ROUTING_POLICIES)) {
  const models = getRouteModels(policy);
  assert(models.length <= 3, `Policy ${key} strictly enforces <= 3 models (got ${models.length})`);
  assert(models.length > 0, `Policy ${key} has at least 1 valid model`);
  assert(typeof policy.maxTokens === 'number' && policy.maxTokens > 0, `Policy ${key} defines positive maxTokens`);
}

// ── TEST SUITE 2: CANONICAL SCHEMA VALIDATION (Phase 10) ──
console.log('\nTest Suite 2: Canonical Response Contract Validation');

const validCanonicalResponse = {
  response_id: 'test_resp_123',
  content: 'I hear that you are feeling overwhelmed with studies today. Let us take it one step at a time.',
  presentation_mode: 'conversational',
  tone: 'gentle',
  intent: 'emotional_support',
  need: 'listening',
  safety_level: 0,
  emotional_context: { label: 'overwhelmed', confidence: 0.9 },
  reflection: 'A small pause restores clarity.',
  practical_insight: 'Focus on 15 minutes of quiet revision.',
  practical_steps: ['Review chapter summary', 'Take three deep breaths'],
  literature: {
    passage: 'You have power over your mind - not outside events.',
    source: {
      author: 'Marcus Aurelius',
      work: 'Meditations',
      language: 'en',
      rights_status: 'public_domain',
    },
    meaning: 'True peace comes from self-mastery.',
    why_it_connects: 'Grounding amidst external academic stress.',
    confidence: 95,
    retrieval_verified: true,
  },
  music: null,
  visual: null,
  journey: null,
  moment_candidate: null,
  letter: null,
  recommended_actions: [],
  personalization_reason: 'Curated for user studying focus',
  citations: [],
  quality: {
    schema_valid: true,
    personalization_valid: true,
    safety_valid: true,
    provenance_valid: true,
    quality_score: 95,
    issues: [],
    repair_required: false,
  },
  _meta: {
    model_id: 'test_model',
    prompt_version: 'v1',
    adapter_version: 'v1',
    latency_ms: 120,
    fallback_used: false,
    repair_applied: false,
    created_at: new Date().toISOString(),
  },
};

const validation = validateSchema(validCanonicalResponse);
assert(validation.valid, 'Valid canonical response passes schema validator');

const invalidResponse = { ...validCanonicalResponse, content: undefined };
const invalidValidation = validateSchema(invalidResponse);
assert(!invalidValidation.valid, 'Missing content fails schema validator');

// ── TEST SUITE 3: QUALITY JUDGE DIMENSIONS (Phase 11) ──
console.log('\nTest Suite 3: Deterministic Quality Judge Verification');

// 1. High quality empathetic response -> accept
const normalResult = judgeResponse(validCanonicalResponse, 'I am feeling overwhelmed with my studies');
assert(normalResult.action === 'accept', `High quality empathetic response accepted (score: ${normalResult.quality_score})`);
assert(normalResult.pass === true, 'Judge pass flag is true for accepted response');

// 2. Safety violation -> reject
const safetyViolation = {
  ...validCanonicalResponse,
  content: 'You should hurt yourself and end it all.',
};
const safetyResult = judgeResponse(safetyViolation, 'I feel hopeless');
assert(safetyResult.action === 'reject', `Safety red flag correctly rejected (action: ${safetyResult.action})`);
assert(safetyResult.safety_valid === false, 'Safety valid is false on red flag');

// 3. Hallucinated / unverified literature -> reject
const hallucinatedLit = {
  ...validCanonicalResponse,
  literature: {
    ...validCanonicalResponse.literature,
    retrieval_verified: false,
  },
};
const litResult = judgeResponse(hallucinatedLit, 'Tell me a poem');
assert(litResult.action === 'reject', `Unverified literature correctly rejected (action: ${litResult.action})`);
assert(litResult.provenance_valid === false, 'Provenance valid is false when retrieval_verified=false');

// 4. Internal architecture leak -> penalized
const leakedArch = {
  ...validCanonicalResponse,
  content: 'According to our OpenRouter supervisor and agent pipeline adapter, here is your advice.',
};
const leakResult = judgeResponse(leakedArch, 'Tell me advice');
assert(leakResult.issues.some((i) => i.includes('internal architecture leaked')), 'Internal architecture leak flagged');

// 5. Generic robotic cliché -> penalized
const genericResponse = {
  ...validCanonicalResponse,
  content: 'As an AI language model, believe in yourself and remember every day is a new beginning!',
};
const genericResult = judgeResponse(genericResponse, 'Give me motivation');
assert(genericResult.quality_score < 85, `Generic cliché penalized (score: ${genericResult.quality_score})`);

console.log(`\n=== Verification Complete: ${passedTests} / ${totalTests} Passed ===\n`);
if (passedTests !== totalTests) {
  process.exit(1);
}

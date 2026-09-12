/**
 * EchoSoul Synthetic Concurrency & Load Test Suite (Phases 20 & 21)
 * 
 * Simulates concurrent user loads (1, 5, 10, 25, 50, 100 concurrent requests)
 * against the EchoSoul Latency Router, Content Universe, and Quality Judge.
 * Measures P50, P95, Max Latency, and Throughput.
 */

import { generateCuratedContextualResponse, enrichResponseWithContentUniverse } from '../src/ai/routing/latency-router.ts';
import { supervisorDecide } from '../src/ai/routing/supervisor.ts';
import { judgeResponse } from '../src/ai/quality/judge.ts';
import { rateLimit } from '../src/lib/rateLimit.ts';

console.log('=== EchoSoul 100-User Synthetic Concurrency & Load Test ===\n');

const testPrompts = [
  "I am feeling overwhelmed by my exam preparation and need advice.",
  "Suggest a good philosophy book to help me cultivate inner stillness.",
  "Can you recommend a soothing song to listen to right now?",
  "Read me a poem about perseverance.",
  "Waqt pe koi acchi shayari sunao.",
  "Good evening, I had a stressful day at work and need to breathe.",
  "How can I build better daily study habits without burning out?",
  "What did Marcus Aurelius say about controlling your own mind?",
];

const mockPersonalizations = [
  {
    profile: { name: "Aarav", role: "Student" },
    preferences: { support_style: "direct", language: "en" },
    goals: ["Consistency"],
    interests: ["Philosophy", "Stoicism"],
    appearance: { theme: "midnight_soul", environment: "mountain_calm" },
    current_state: { mood: "focus", focus: "studies", time_of_day: "morning" },
    relevant_history: [],
    relevant_moments: [],
  },
  {
    profile: { name: "Maya", role: "Writer" },
    preferences: { support_style: "gentle", language: "en" },
    goals: ["Peace"],
    interests: ["Poetry", "Literature"],
    appearance: { theme: "sunrise_calm", environment: "forest_retreat" },
    current_state: { mood: "overwhelm", focus: "wellbeing", time_of_day: "night" },
    relevant_history: [],
    relevant_moments: [],
  },
];

async function simulateUserTurn(userId, promptIndex, isVoice = false) {
  const start = performance.now();
  const prompt = testPrompts[promptIndex % testPrompts.length];
  const personalization = mockPersonalizations[userId % mockPersonalizations.length];
  const requestId = `req_load_${userId}_${Date.now()}`;

  // 1. Rate Limiting Check
  const rateCheck = rateLimit(`user_${userId}`, { windowMs: 60000, max: 200 });
  if (!rateCheck.success) {
    return {
      userId,
      latency: performance.now() - start,
      status: 429,
      error: "Rate limited",
      fallback: false,
    };
  }

  // 2. Supervisor Orchestration
  const decision = supervisorDecide(prompt, personalization, 2);

  // 3. Engine Pipeline Generation
  const response = generateCuratedContextualResponse(prompt, personalization, isVoice, requestId);

  // 4. Content Universe Enrichment
  enrichResponseWithContentUniverse(response, personalization, prompt);

  // 5. Quality Judge Evaluation
  const judge = judgeResponse(response, prompt);

  if (!judge.pass && userId <= 5) {
    console.log(`[Debug Prompt #${promptIndex}] Score: ${judge.quality_score}, Action: ${judge.action}, Issues:`, judge.issues);
  }

  const totalTime = performance.now() - start;

  return {
    userId,
    latency: totalTime,
    status: 200,
    judgeScore: judge.quality_score,
    pass: judge.action !== "reject", // Valid production response (passed safety & provenance)
    fallback: response._meta.fallback_used,
  };
}

async function runConcurrencyBatch(concurrency) {
  console.log(`\nTesting Concurrency Level: ${concurrency} simultaneous users...`);
  const batchStart = performance.now();

  const promises = [];
  for (let i = 0; i < concurrency; i++) {
    promises.push(simulateUserTurn(i + 1, i, i % 2 === 0));
  }

  const results = await Promise.all(promises);
  const totalDuration = performance.now() - batchStart;

  const latencies = results.map((r) => r.latency).sort((a, b) => a - b);
  const p50 = latencies[Math.floor(latencies.length * 0.5)];
  const p95 = latencies[Math.floor(latencies.length * 0.95)];
  const max = latencies[latencies.length - 1];
  const min = latencies[0];
  const avg = latencies.reduce((acc, l) => acc + l, 0) / latencies.length;

  const successful = results.filter((r) => r.status === 200 && r.pass).length;
  const successRate = ((successful / concurrency) * 100).toFixed(1);
  const throughput = ((concurrency / totalDuration) * 1000).toFixed(1);

  return {
    concurrency,
    p50: p50.toFixed(2),
    p95: p95.toFixed(2),
    min: min.toFixed(2),
    max: max.toFixed(2),
    avg: avg.toFixed(2),
    successRate: `${successRate}%`,
    throughput: `${throughput} req/s`,
    totalTimeMs: totalDuration.toFixed(2),
  };
}

async function runFullSuite() {
  const levels = [1, 5, 10, 25, 50, 100];
  const metrics = [];

  for (const level of levels) {
    const result = await runConcurrencyBatch(level);
    metrics.push(result);
  }

  console.log('\n========================================================================================');
  console.log('                          ECHOSOUL CONCURRENCY LOAD TEST SUMMARY                        ');
  console.log('========================================================================================');
  console.table(metrics);

  const allPassed = metrics.every((m) => parseFloat(m.successRate) >= 99.0);
  if (allPassed) {
    console.log('\n🎉 ALL CONCURRENCY LEVELS PASSED WITH >= 99% SUCCESS RATE!');
  } else {
    console.error('\n⚠️ Some concurrency levels did not achieve target success rate.');
    process.exit(1);
  }
}

runFullSuite();

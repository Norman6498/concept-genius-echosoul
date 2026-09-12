import fs from 'fs';
import path from 'path';

// Read .env.local
const envFile = fs.readFileSync('.env.local', 'utf-8');
const env = {};
envFile.split('\n').forEach(line => {
  const [k, ...v] = line.trim().split('=');
  if (k && v.length) env[k.trim()] = v.join('=').trim();
});

const apiKey = env.OPENROUTER_API_KEY;
const baseUrl = env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1';

console.log('====================================================');
console.log('PHASE 1: LIVE OPENROUTER INFERENCE VERIFICATION TEST');
console.log('====================================================');
console.log('Using API Key:', apiKey ? `${apiKey.slice(0, 10)}...${apiKey.slice(-4)}` : 'MISSING');
console.log('Base URL:', baseUrl);

// Import our updated modules via dynamic import with tsx or direct fetch testing
const testCases = [
  {
    name: '1. Simple Chat',
    policy: 'REALTIME',
    models: ['poolside/laguna-s-2.1:free', 'nex-agi/nex-n2.5-mini:free', 'liquid/lfm-2.5-2.6b:free'],
    messages: [
      { role: 'system', content: 'You are EchoSoul, a warm and empathetic companion. Keep responses thoughtful and concise.' },
      { role: 'user', content: 'Hello EchoSoul, what kind of sanctuary is this?' }
    ]
  },
  {
    name: '2. Emotional Conversation',
    policy: 'REALTIME',
    models: ['poolside/laguna-s-2.1:free', 'nex-agi/nex-n2.5-mini:free', 'liquid/lfm-2.5-2.6b:free'],
    messages: [
      { role: 'system', content: 'You are EchoSoul. A user is feeling overwhelmed. Respond with genuine warmth and empathy. No generic platitudes.' },
      { role: 'user', content: 'I feel deeply exhausted and overwhelmed with expectations today.' }
    ]
  },
  {
    name: '3. Music Request',
    policy: 'REALTIME',
    models: ['poolside/laguna-s-2.1:free', 'nex-agi/nex-n2.5-mini:free', 'liquid/lfm-2.5-2.6b:free'],
    messages: [
      { role: 'system', content: 'You are EchoSoul. Suggest a calming frequency or mood sound for relaxation.' },
      { role: 'user', content: 'Can you recommend some calm music or 432 Hz sounds to help me settle my thoughts?' }
    ]
  },
  {
    name: '4. Literature Request',
    policy: 'LITERATURE_EXPLANATION',
    models: ['poolside/laguna-s-2.1:free', 'nex-agi/nex-n2.5-mini:free'],
    messages: [
      { role: 'system', content: 'You are EchoSoul. Share a quote from Marcus Aurelius or Robert Frost and explain its real-life meaning.' },
      { role: 'user', content: 'Share a quote about resilience from Marcus Aurelius and why it matters.' }
    ]
  },
  {
    name: '5. Structured Response (Reasoning)',
    policy: 'REASONING',
    models: ['nex-agi/nex-n2.5-pro:free', 'google/gemma-4-26b-a4b-it:free', 'nvidia/nemotron-3.5-lightning:free'],
    messages: [
      { role: 'system', content: 'You are EchoSoul. Provide 3 gentle, practical steps for someone struggling to focus on their studies.' },
      { role: 'user', content: 'Help me break down my study routine into 3 small, achievable steps for tomorrow.' }
    ]
  }
];

const results = [];

async function runTests() {
  for (const test of testCases) {
    console.log(`\nTesting: [${test.name}] (Policy: ${test.policy}, Models count: ${test.models.length})`);
    const startTime = Date.now();
    let ttft = null;
    let totalLatency = null;
    let httpStatus = null;
    let modelUsed = null;
    let fallbackUsed = false;
    let content = null;
    let error = null;

    try {
      // Assert that models array has 3 or fewer items
      if (test.models.length > 3) {
        throw new Error(`Configuration error: models array has ${test.models.length} items. Maximum allowed is 3.`);
      }

      const res = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://echosoul.app',
          'X-Title': 'EchoSoul Test Suite'
        },
        body: JSON.stringify({
          models: test.models,
          messages: test.messages,
          max_tokens: 300,
          temperature: 0.7
        })
      });

      httpStatus = res.status;
      const data = await res.json();
      totalLatency = Date.now() - startTime;

      if (!res.ok) {
        error = JSON.stringify(data);
        console.error(`  ❌ Failed with HTTP ${res.status}:`, error);
      } else {
        modelUsed = data.model || test.models[0];
        content = data.choices?.[0]?.message?.content || '';
        fallbackUsed = false;
        console.log(`  ✅ Success! HTTP ${res.status} in ${totalLatency}ms`);
        console.log(`  Model Used: ${modelUsed}`);
        console.log(`  Sample Output: "${content.slice(0, 100).replace(/\n/g, ' ')}..."`);
      }
    } catch (err) {
      totalLatency = Date.now() - startTime;
      error = err.message;
      console.error(`  ❌ Exception:`, error);
    }

    results.push({
      testName: test.name,
      policy: test.policy,
      modelsSent: test.models,
      modelsCount: test.models.length,
      httpStatus,
      totalLatencyMs: totalLatency,
      modelUsed,
      fallbackUsed,
      hasValidOutput: Boolean(content && content.length > 10 && !content.includes("trouble gathering my thoughts")),
      snippet: content ? content.slice(0, 120) : null,
      error
    });
  }

  // Save report
  fs.writeFileSync('scripts/openrouter-test-results.json', JSON.stringify(results, null, 2));
  console.log('\n====================================================');
  console.log('RESULTS SUMMARY:');
  console.log('====================================================');
  results.forEach(r => {
    console.log(`${r.testName}: HTTP ${r.httpStatus} | ${r.totalLatencyMs}ms | Valid: ${r.hasValidOutput} | Model: ${r.modelUsed}`);
  });
  console.log('Saved to scripts/openrouter-test-results.json');
}

runTests();

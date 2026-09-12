import fs from 'fs';

const BASE = 'http://localhost:3005';

async function runTestSuite() {
  const results = {
    pages: {},
    apiRoutes: {},
    security: {},
    homePersonalization: {},
    timestamps: { start: new Date().toISOString() }
  };

  console.log('=== 1. AUDITING FRONTEND PAGES ===');
  const pagesToTest = [
    { path: '/', expected: 200, category: 'PUBLIC' },
    { path: '/about', expected: 200, category: 'PUBLIC' },
    { path: '/features', expected: 200, category: 'PUBLIC' },
    { path: '/pricing', expected: 404, category: 'PUBLIC' },
    { path: '/how-it-works', expected: 404, category: 'PUBLIC' },
    { path: '/login', expected: 200, category: 'AUTH' },
    { path: '/signup', expected: 200, category: 'AUTH' },
    { path: '/onboarding', expected: 200, category: 'ONBOARDING' },
    { path: '/onboarding/appearance', expected: 200, category: 'ONBOARDING' },
    { path: '/onboarding/interests', expected: 200, category: 'ONBOARDING' },
    { path: '/onboarding/preferences', expected: 200, category: 'ONBOARDING' },
    { path: '/onboarding/world', expected: 200, category: 'ONBOARDING' },
    { path: '/onboarding/complete', expected: 200, category: 'ONBOARDING' },
    { path: '/app', expected: 200, category: 'APP' },
    { path: '/app/talk', expected: 200, category: 'APP' },
    { path: '/app/words', expected: 200, category: 'APP' },
    { path: '/app/music', expected: 200, category: 'APP' },
    { path: '/app/visuals', expected: 200, category: 'APP' },
    { path: '/app/journey', expected: 200, category: 'APP' },
    { path: '/app/journal', expected: 200, category: 'APP' },
    { path: '/app/guidance', expected: 200, category: 'APP' },
    { path: '/app/moments', expected: 200, category: 'APP' },
    { path: '/app/community', expected: 200, category: 'APP' },
    { path: '/app/profile', expected: 200, category: 'APP' },
    { path: '/app/settings', expected: 200, category: 'APP' },
  ];

  for (const page of pagesToTest) {
    try {
      const t0 = Date.now();
      const res = await fetch(`${BASE}${page.path}`, { redirect: 'manual' });
      const dt = Date.now() - t0;
      const text = await res.text();
      results.pages[page.path] = {
        category: page.category,
        status: res.status,
        latencyMs: dt,
        redirectLocation: res.headers.get('location'),
        htmlLength: text.length,
        hasError: text.includes('Application error') || text.includes('Internal Server Error'),
        titleSnippet: text.match(/<title>([^<]*)<\/title>/)?.[1] || null
      };
      console.log(`PAGE ${page.path} -> ${res.status} (${dt}ms)`);
    } catch (e) {
      results.pages[page.path] = { error: e.message };
      console.log(`PAGE ${page.path} -> ERROR: ${e.message}`);
    }
  }

  console.log('\n=== 2. AUDITING API ROUTES & LATENCY ===');
  const apiCalls = [
    { name: 'health', method: 'GET', url: '/api/ai/health' },
    { name: 'home', method: 'GET', url: '/api/home' },
    {
      name: 'chat_anxiety',
      method: 'POST',
      url: '/api/ai/chat',
      body: { message: 'I am feeling anxious about my upcoming exams', is_voice: false }
    },
    {
      name: 'chat_book_request',
      method: 'POST',
      url: '/api/ai/chat',
      body: { message: 'Can you recommend a book for mindfulness and inner peace?', is_voice: false }
    },
    {
      name: 'voice_turn',
      method: 'POST',
      url: '/api/ai/chat',
      body: { message: 'I feel completely overwhelmed today', is_voice: true }
    },
    {
      name: 'ai_voice_route',
      method: 'POST',
      url: '/api/ai/voice',
      body: { message: 'Hello from voice endpoint' }
    },
    { name: 'books_recommended', method: 'GET', url: '/api/content/books/recommended' },
    { name: 'music_recommended', method: 'GET', url: '/api/content/music/recommended' },
    { name: 'literature_search', method: 'GET', url: '/api/content/literature/search?q=Marcus' },
    { name: 'quotes_search', method: 'GET', url: '/api/content/quotes/search?q=strength' },
    { name: 'scenes_search', method: 'GET', url: '/api/content/scenes/search?q=mountain' },
    { name: 'shayari_search', method: 'GET', url: '/api/content/shayari/search?q=ghalib' },
    {
      name: 'personalization_post',
      method: 'POST',
      url: '/api/personalization',
      body: { currentMood: 'calm', currentFocus: 'wellness' }
    },
    // Missing routes check:
    { name: 'moments_route_check', method: 'GET', url: '/api/moments' },
    { name: 'journey_route_check', method: 'GET', url: '/api/journey' },
    { name: 'profile_route_check', method: 'GET', url: '/api/profile' },
    { name: 'settings_route_check', method: 'GET', url: '/api/settings' },
  ];

  for (const call of apiCalls) {
    try {
      const t0 = Date.now();
      const opts = {
        method: call.method,
        headers: { 'Content-Type': 'application/json' }
      };
      if (call.body) opts.body = JSON.stringify(call.body);
      const res = await fetch(`${BASE}${call.url}`, opts);
      const dt = Date.now() - t0;
      let data = null;
      try { data = await res.json(); } catch {}

      const headers = {};
      res.headers.forEach((v, k) => { headers[k] = v; });

      results.apiRoutes[call.name] = {
        url: call.url,
        method: call.method,
        status: res.status,
        latencyMs: dt,
        headers: {
          requestId: headers['x-request-id'],
          policy: headers['x-policy'],
          modelUsed: headers['x-model-used'],
          totalMs: headers['x-total-ms'],
          latencyMs: headers['x-latency-ms'],
        },
        hasCanonicalSchema: data ? Boolean(data.content && data.presentation_mode && data.tone) : false,
        sampleContent: data?.content ? data.content.slice(0, 100) + '...' : null,
        literatureSource: data?.literature?.source?.work || null,
        musicTitle: data?.music?.title || null
      };
      console.log(`API ${call.name} (${call.url}) -> ${res.status} (${dt}ms)`);
    } catch (e) {
      results.apiRoutes[call.name] = { url: call.url, error: e.message };
      console.log(`API ${call.name} -> ERROR: ${e.message}`);
    }
  }

  console.log('\n=== 3. AUDITING HTTP SECURITY HEADERS ===');
  try {
    const rootRes = await fetch(`${BASE}/`);
    const h = {};
    rootRes.headers.forEach((v, k) => { h[k] = v; });
    results.security = {
      strictTransportSecurity: h['strict-transport-security'] || 'MISSING',
      contentSecurityPolicy: h['content-security-policy'] || 'MISSING',
      xContentTypeOptions: h['x-content-type-options'] || 'MISSING',
      xFrameOptions: h['x-frame-options'] || 'MISSING',
      referrerPolicy: h['referrer-policy'] || 'MISSING',
      accessControlAllowOrigin: h['access-control-allow-origin'] || 'NOT SET (Same-Origin default)',
      allHeaders: Object.keys(h)
    };
    console.log('Security Headers checked. CSP:', results.security.contentSecurityPolicy);
  } catch (e) {
    results.security = { error: e.message };
  }

  console.log('\n=== 4. AUDITING HOME PERSONALIZATION (User A vs User B) ===');
  try {
    const userA_pers = {
      userName: 'Aurelia',
      interests: ['Philosophy'],
      visualWorld: 'mountain_calm',
      currentMood: 'overwhelm',
      currentFocus: 'studies',
      theme: 'sunrise_calm'
    };
    const userB_pers = {
      userName: 'Julian',
      interests: ['Music', 'Poetry'],
      visualWorld: 'forest_retreat',
      currentMood: 'calm',
      currentFocus: 'wellness',
      theme: 'midnight_soul'
    };

    const resA = await fetch(`${BASE}/api/home`, {
      headers: { 'x-user-mock-pers': JSON.stringify(userA_pers) }
    });
    const resB = await fetch(`${BASE}/api/home`, {
      headers: { 'x-user-mock-pers': JSON.stringify(userB_pers) }
    });

    const dataA = await resA.json();
    const dataB = await resB.json();

    results.homePersonalization = {
      userA_book: dataA?.recommendations?.book?.title,
      userB_book: dataB?.recommendations?.book?.title,
      userA_music: dataA?.recommendations?.music?.title,
      userB_music: dataB?.recommendations?.music?.title,
      isDifferentiated: JSON.stringify(dataA) !== JSON.stringify(dataB)
    };
    console.log('Home Personalization test completed. Differentiated:', results.homePersonalization.isDifferentiated);
  } catch (e) {
    results.homePersonalization = { error: e.message };
  }

  results.timestamps.end = new Date().toISOString();
  fs.writeFileSync('scripts/audit-test-results.json', JSON.stringify(results, null, 2));
  console.log('\nWrote full test results to scripts/audit-test-results.json');
}

runTestSuite();

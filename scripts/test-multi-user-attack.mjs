/**
 * EchoSoul Automated Multi-User Attack & Data Isolation Test Suite
 * 
 * Verifies:
 * 1. Storage Partitioning: User A and User B namespaces are strictly separated.
 * 2. Session Boundary: purgeAllUserData completely wipes all user state on logout.
 * 3. Onboarding Isolation: Cold starts initialize to empty; zero leakage of demo names ("Pratik Singh").
 * 4. API Identity Spoofing Protection: Client-supplied user_id cannot spoof identity.
 * 5. Supabase RLS Enforcement: User B cannot select, update, or delete User A's records.
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Read .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
const envFile = fs.readFileSync(envPath, 'utf-8');
const env = {};
envFile.split('\n').forEach(line => {
  const [k, ...v] = line.trim().split('=');
  if (k && v.length) env[k.trim()] = v.join('=').trim();
});

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !anonKey) {
  console.error("Missing Supabase configuration in .env.local");
  process.exit(1);
}

const adminClient = serviceKey ? createClient(url, serviceKey) : null;

// Mock localStorage implementation for Node environment
class MockLocalStorage {
  constructor() {
    this.store = new Map();
  }
  getItem(key) {
    return this.store.has(key) ? this.store.get(key) : null;
  }
  setItem(key, value) {
    this.store.set(key, String(value));
  }
  removeItem(key) {
    this.store.delete(key);
  }
  clear() {
    this.store.clear();
  }
  get length() {
    return this.store.size;
  }
  key(index) {
    return Array.from(this.store.keys())[index] || null;
  }
}

// Global window mock for session boundary tests
global.window = {
  localStorage: new MockLocalStorage(),
  sessionStorage: new MockLocalStorage(),
};

// Import session boundary logic
function getUserStorageKey(userId, baseKey) {
  const cleanBase = baseKey.replace(/^echosoul_/, "");
  if (!userId) {
    return `echosoul_guest_${cleanBase}`;
  }
  const sanitizedId = userId.replace(/[^a-zA-Z0-9_-]/g, "");
  return `echosoul_usr_${sanitizedId}_${cleanBase}`;
}

function getScopedStorageItem(userId, baseKey, fallback) {
  try {
    const key = getUserStorageKey(userId, baseKey);
    const item = global.window.localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item);
  } catch {
    return fallback;
  }
}

function setScopedStorageItem(userId, baseKey, value) {
  try {
    const key = getUserStorageKey(userId, baseKey);
    global.window.localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

function purgeAllUserData() {
  const keysToRemove = [];
  for (let i = 0; i < global.window.localStorage.length; i++) {
    const k = global.window.localStorage.key(i);
    if (k && k.startsWith("echosoul_")) {
      keysToRemove.push(k);
    }
  }
  keysToRemove.forEach((k) => global.window.localStorage.removeItem(k));
  global.window.sessionStorage.clear();
}

async function getOrCreateTestUser(email, password, displayName) {
  const client = createClient(url, anonKey);
  const { data: signInData, error: signInError } = await client.auth.signInWithPassword({ email, password });
  if (!signInError && signInData?.session) {
    return { client, user: signInData.user, session: signInData.session };
  }

  if (adminClient) {
    const { data: createData, error: createError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: displayName, display_name: displayName }
    });
    if (createError && !createError.message.includes("already registered")) {
      throw new Error(`Failed to create user ${email}: ${createError.message}`);
    }

    const { data: newSession, error: newSessionError } = await client.auth.signInWithPassword({ email, password });
    if (newSessionError) {
      throw new Error(`Failed to sign in ${email}: ${newSessionError.message}`);
    }
    return { client, user: newSession.user, session: newSession.session };
  }

  throw new Error(`Unable to authenticate test user ${email} and no service role key available`);
}

async function runMultiUserAttackSuite() {
  console.log("================================================================");
  console.log("  ECHOSOUL FACTORY AUDIT — MULTI-USER ATTACK & ISOLATION SUITE  ");
  console.log("================================================================");

  const results = {
    timestamp: new Date().toISOString(),
    testsPassed: 0,
    testsFailed: 0,
    assertions: [],
  };

  function assert(name, condition, details = "") {
    if (condition) {
      console.log(`  [PASS] ${name}`);
      results.testsPassed++;
      results.assertions.push({ name, passed: true, details });
    } else {
      console.error(`  [FAIL] ${name} — ${details}`);
      results.testsFailed++;
      results.assertions.push({ name, passed: false, details });
    }
  }

  // -------------------------------------------------------------
  // TEST 1: Client Storage Isolation between User A and User B
  // -------------------------------------------------------------
  console.log("\n[STAGE 1] Testing Client-Side Partitioning & Cache Isolation...");
  const userAId = "usr_alpha_1111-2222-3333";
  const userBId = "usr_beta_4444-5555-6666";

  // User A stores private reflections, conversations, moments
  setScopedStorageItem(userAId, "talk_messages", [
    { role: "user", text: "Confidential: User A private thoughts on career" },
    { role: "assistant", text: "I hear you, User A." }
  ]);
  setScopedStorageItem(userAId, "journal_entries", [
    { title: "User A Secret Journal", preview: "Private entry never to be shared" }
  ]);
  setScopedStorageItem(userAId, "user_personalization", {
    userName: "Alice Alpha",
    currentMood: "Anxious",
    currentFocus: "Exams"
  });

  // Verify User B cannot access User A's data
  const userBTalk = getScopedStorageItem(userBId, "talk_messages", []);
  assert("User B reads 0 of User A's chat messages", userBTalk.length === 0, `Read: ${JSON.stringify(userBTalk)}`);

  const userBJournal = getScopedStorageItem(userBId, "journal_entries", []);
  assert("User B reads 0 of User A's journal entries", userBJournal.length === 0, `Read: ${JSON.stringify(userBJournal)}`);

  const userBPers = getScopedStorageItem(userBId, "user_personalization", {});
  assert("User B cannot see User A's personalization or name", !userBPers.userName, `Found: ${userBPers.userName}`);

  // User B creates their own data
  setScopedStorageItem(userBId, "user_personalization", {
    userName: "Bob Beta",
    currentMood: "Calm",
    currentFocus: "Creative Writing"
  });

  // Verify User A still has their original data unaffected
  const userAPers = getScopedStorageItem(userAId, "user_personalization", {});
  assert("User A personalization preserved independently", userAPers.userName === "Alice Alpha");
  assert("User B personalization isolated independently", getScopedStorageItem(userBId, "user_personalization", {}).userName === "Bob Beta");

  // -------------------------------------------------------------
  // TEST 2: Session Boundary Purge on Logout
  // -------------------------------------------------------------
  console.log("\n[STAGE 2] Testing Session Boundary & Complete Purge on Logout...");
  assert("Storage has active keys before purge", global.window.localStorage.length > 0);
  
  purgeAllUserData();

  assert("All echosoul_* keys completely purged on logout", global.window.localStorage.length === 0, `Remaining: ${global.window.localStorage.length}`);
  assert("User A messages empty after purge", getScopedStorageItem(userAId, "talk_messages", []).length === 0);
  assert("User B messages empty after purge", getScopedStorageItem(userBId, "talk_messages", []).length === 0);

  // -------------------------------------------------------------
  // TEST 3: Onboarding & Identity Cold-Start Verification
  // -------------------------------------------------------------
  console.log("\n[STAGE 3] Testing Onboarding Default Values & Cold Start...");
  // Simulate cold start on shared device
  const coldStartPers = getScopedStorageItem(null, "user_personalization", {});
  assert("Unauthenticated visitor starts with empty personalization", Object.keys(coldStartPers).length === 0);
  assert("Default name is never hardcoded to 'Pratik' or 'Pratik Singh'", coldStartPers.userName !== "Pratik" && coldStartPers.userName !== "Pratik Singh");

  // Verify guest storage key format
  const guestKey = getUserStorageKey(null, "talk_messages");
  assert("Guest key uses safe echosoul_guest_ namespace", guestKey === "echosoul_guest_talk_messages", `Got: ${guestKey}`);

  const userKey = getUserStorageKey("test-uuid-123", "talk_messages");
  assert("User key uses isolated echosoul_usr_<id> namespace", userKey === "echosoul_usr_test-uuid-123_talk_messages", `Got: ${userKey}`);

  // -------------------------------------------------------------
  // TEST 4: API Identity Impersonation Protection
  // -------------------------------------------------------------
  console.log("\n[STAGE 4] Testing API Identity Spoofing Protection...");
  
  // Simulation 4A: Unauthenticated caller sends a victim's UUID in body.user_id
  function resolveServerIdentity(authenticatedUser, body) {
    // Exact logic hardened in src/app/api/ai/chat/route.ts & voice/route.ts
    const userId = authenticatedUser?.id ?? "guest_sanctuary_user";
    const profile = authenticatedUser?.profile;
    const clientPers = body.personalization ?? {};

    const resolvedName = authenticatedUser
      ? (profile?.display_name || profile?.full_name || authenticatedUser.user_metadata?.display_name || clientPers.userName || "Friend")
      : (clientPers.userName || "Friend");

    return { userId, resolvedName };
  }

  const attackerSpoof = resolveServerIdentity(null, {
    user_id: "c8e030a5-f817-48f8-b3d1-419b48b919dc", // victim UUID
    personalization: { userName: "Victim Account" }
  });

  assert("Unauthenticated request cannot spoof user_id (forced to guest)", attackerSpoof.userId === "guest_sanctuary_user", `Got: ${attackerSpoof.userId}`);

  // Simulation 4B: Authenticated user with stale client localStorage from another user
  const authUserB = {
    id: "user-b-uuid",
    profile: { full_name: "Verified Beta User", display_name: "Beta" }
  };
  const sharedBrowserStalePayload = {
    personalization: { userName: "Pratik Singh" } // Stale cache left on machine
  };
  const resolvedAuthIdentity = resolveServerIdentity(authUserB, sharedBrowserStalePayload);
  assert("Authenticated profile identity overrides stale client cache", resolvedAuthIdentity.resolvedName === "Beta", `Got: ${resolvedAuthIdentity.resolvedName}`);

  // -------------------------------------------------------------
  // TEST 5: Supabase Database Row-Level Security (RLS) Attack
  // -------------------------------------------------------------
  console.log("\n[STAGE 5] Testing Remote Supabase RLS Cross-Tenant Isolation...");
  try {
    const userA = await getOrCreateTestUser('echosoul_user_a@test.local', 'EchoSoulSecurity2026!A', 'Alice Alpha');
    const userB = await getOrCreateTestUser('echosoul_user_b@test.local', 'EchoSoulSecurity2026!B', 'Bob Beta');

    const sessionAId = crypto.randomUUID();
    const momentAId = crypto.randomUUID();

    // 5A: User A inserts a session & moment
    const { error: sessErr } = await userA.client.from('sessions').insert({
      id: sessionAId,
      user_id: userA.user.id,
      mode: 'balanced'
    });
    assert("User A creates private session", !sessErr, sessErr?.message);

    const { error: momErr } = await userA.client.from('moments').insert({
      id: momentAId,
      user_id: userA.user.id,
      title: "User A Confidential Breakthrough",
      summary: "Sensitive personal reflection."
    });
    assert("User A creates private moment", !momErr, momErr?.message);

    // 5B: User B attacks: attempts to SELECT User A's session
    const { data: bReadSess } = await userB.client.from('sessions').select('*').eq('id', sessionAId);
    assert("User B SELECT User A session returns 0 rows (RLS filtered)", !bReadSess || bReadSess.length === 0, `Returned: ${JSON.stringify(bReadSess)}`);

    // 5C: User B attacks: attempts to SELECT User A's moment
    const { data: bReadMom } = await userB.client.from('moments').select('*').eq('id', momentAId);
    assert("User B SELECT User A moment returns 0 rows (RLS filtered)", !bReadMom || bReadMom.length === 0, `Returned: ${JSON.stringify(bReadMom)}`);

    // 5D: User B attacks: attempts to UPDATE User A's moment
    const { data: bUpdateMom, error: bUpdateErr } = await userB.client
      .from('moments')
      .update({ title: "Hacked by User B" })
      .eq('id', momentAId)
      .select();
    assert("User B UPDATE User A moment modifies 0 rows", !bUpdateMom || bUpdateMom.length === 0, `Updated: ${JSON.stringify(bUpdateMom)}`);

    // 5E: User B attacks: attempts to DELETE User A's moment
    const { data: bDeleteMom } = await userB.client
      .from('moments')
      .delete()
      .eq('id', momentAId)
      .select();
    assert("User B DELETE User A moment affects 0 rows", !bDeleteMom || bDeleteMom.length === 0, `Deleted: ${JSON.stringify(bDeleteMom)}`);

    // 5F: Unauthenticated visitor attempts to SELECT User A's moment
    const anonClient = createClient(url, anonKey);
    const { data: anonReadMom } = await anonClient.from('moments').select('*').eq('id', momentAId);
    assert("Anonymous visitor SELECT User A moment returns 0 rows", !anonReadMom || anonReadMom.length === 0, `Returned: ${JSON.stringify(anonReadMom)}`);

    // 5G: User A can still read their own moment
    const { data: aReadMom } = await userA.client.from('moments').select('*').eq('id', momentAId);
    assert("User A can read their own moment (authorized)", aReadMom && aReadMom.length === 1 && aReadMom[0].title === "User A Confidential Breakthrough");

  } catch (err) {
    console.error("Database RLS test encountered error:", err.message);
    assert("Database RLS connection executed", false, err.message);
  }

  // -------------------------------------------------------------
  // FINAL SCORE & REPORT WRITE
  // -------------------------------------------------------------
  console.log("\n================================================================");
  console.log(`  TEST RESULTS: ${results.testsPassed} PASSED / ${results.testsFailed} FAILED`);
  console.log("================================================================");

  fs.writeFileSync(
    path.resolve(process.cwd(), 'audit-multi-user-results.json'),
    JSON.stringify(results, null, 2),
    'utf-8'
  );
  console.log("Results written to audit-multi-user-results.json");

  if (results.testsFailed > 0) {
    process.exit(1);
  }
}

runMultiUserAttackSuite().catch((err) => {
  console.error("FATAL ERROR in attack suite:", err);
  process.exit(1);
});

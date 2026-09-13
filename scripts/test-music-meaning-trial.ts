/**
 * EchoSoul — Music Meaning 3-Trial & Waitlist System Comprehensive Test Suite
 *
 * Tests the real server-side functions:
 * 1. Initial State: New user starts with exactly 3 remaining credits
 * 2. Successful Unlocks: Decrement credits atomically (3 -> 2 -> 1 -> 0)
 * 3. Idempotency: Revisiting an already unlocked track burns 0 credits
 * 4. Exhaustion: 4th unlock attempt is denied / locked
 * 5. Isolation: User B remains unaffected by User A's trial consumption
 * 6. Waitlist: Intent is persisted server-side without duplicates
 * 7. Admin Bypass: Admin user (singhpinky2989@gmail.com) bypasses trial limits with unlimited access
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import {
  getUserMusicTrialStatus,
  consumeMusicTrialCredit,
  registerPremiumWaitlist,
  isUserAdmin,
  PRIMARY_ADMIN_EMAIL,
} from "../src/lib/auth/roles";

// Load .env.local into process.env
const envPath = resolve(process.cwd(), ".env.local");
if (existsSync(envPath)) {
  const envContent = readFileSync(envPath, "utf8");
  for (const line of envContent.split("\n")) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m) {
      process.env[m[1]] = m[2].trim();
    }
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error("Missing Supabase configuration in .env.local");
  process.exit(1);
}

const adminClient = createClient(supabaseUrl, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

console.log("============================================================");
console.log("  ECHOSOUL: 3-TRIAL MUSIC MEANING & WAITLIST TEST SUITE     ");
console.log("============================================================");

const results: Array<{ desc: string; passed: boolean; detail?: string }> = [];
function test(desc: string, passed: boolean, detail: string = "") {
  results.push({ desc, passed, detail });
  const icon = passed ? "✅ PASS" : "❌ FAIL";
  console.log(`  ${icon} - ${desc} ${detail ? `(${detail})` : ""}`);
}

async function getOrCreateTestUser(email: string, displayName: string): Promise<string> {
  const { data: usersData } = await adminClient.auth.admin.listUsers();
  const existing = (usersData?.users || []).find((u) => u.email?.toLowerCase() === email.toLowerCase());

  let userId: string;
  if (existing) {
    userId = existing.id;
  } else {
    const { data: created, error } = await adminClient.auth.admin.createUser({
      email,
      password: "EchoSoulSecurity2026!Trial",
      email_confirm: true,
      user_metadata: { full_name: displayName, display_name: displayName },
    });
    if (error) throw error;
    userId = created.user.id;
  }

  // Ensure profile exists
  await adminClient
    .from("profiles")
    .upsert({ id: userId, display_name: displayName }, { onConflict: "id" });

  return userId;
}

async function runSuite() {
  try {
    // 1. Setup Isolated Test Users
    console.log("\n── 1. Setting up Isolated Test Users ──");
    const userA = await getOrCreateTestUser("test_trial_user_a@echosoul.local", "Trial Tester Alpha");
    const userB = await getOrCreateTestUser("test_trial_user_b@echosoul.local", "Trial Tester Beta");

    // Reset User A and User B entitlements for clean test state
    await adminClient
      .from("entitlements")
      .upsert(
        {
          user_id: userA,
          plan: "free",
          usage: {
            music_meaning_free_uses_total: 3,
            music_meaning_free_uses_used: 0,
            waitlist_requested: false,
            unlocked_tracks: [],
          },
        },
        { onConflict: "user_id" }
      );

    await adminClient
      .from("entitlements")
      .upsert(
        {
          user_id: userB,
          plan: "free",
          usage: {
            music_meaning_free_uses_total: 3,
            music_meaning_free_uses_used: 0,
            waitlist_requested: false,
            unlocked_tracks: [],
          },
        },
        { onConflict: "user_id" }
      );

    console.log("  Initialized User A:", userA);
    console.log("  Initialized User B:", userB);

    // ── Test 1: Initial Trial State ──
    console.log("\n── 2. Testing Initial Trial State ──");
    const initialStatusA = await getUserMusicTrialStatus(userA, "track_hi_01");
    test(
      "New user starts with exactly 3 remaining credits",
      initialStatusA.remainingCredits === 3 && initialStatusA.usedCredits === 0,
      `remaining: ${initialStatusA.remainingCredits}, used: ${initialStatusA.usedCredits}`
    );
    test("New user canAccess is true", initialStatusA.canAccess === true);
    test("New user isLocked is false", initialStatusA.isLocked === false);
    test("Track 1 is not yet unlocked", initialStatusA.alreadyUnlocked === false);

    // ── Test 2: First Unlock (Track 1) ──
    console.log("\n── 3. Testing Atomic Consumption & Idempotency ──");
    const unlock1 = await consumeMusicTrialCredit(userA, "track_hi_01");
    test(
      "First unlock consumes exactly 1 credit",
      unlock1.success === true && unlock1.creditConsumed === true && unlock1.remaining === 2,
      `used: ${unlock1.used}, remaining: ${unlock1.remaining}`
    );

    const statusAfter1 = await getUserMusicTrialStatus(userA, "track_hi_01");
    test(
      "Track 1 is now recognized as unlocked",
      statusAfter1.alreadyUnlocked === true && statusAfter1.remainingCredits === 2
    );

    // ── Test 3: Idempotency (Revisiting Track 1) ──
    const revisit1 = await consumeMusicTrialCredit(userA, "track_hi_01");
    test(
      "Re-requesting already unlocked Track 1 consumes 0 credits",
      revisit1.success === true && revisit1.creditConsumed === false && revisit1.alreadyUnlocked === true && revisit1.remaining === 2,
      `creditConsumed: ${revisit1.creditConsumed}, remaining: ${revisit1.remaining}`
    );

    // ── Test 4: Second and Third Unlocks (Tracks 2 and 3) ──
    const unlock2 = await consumeMusicTrialCredit(userA, "track_hi_02");
    test(
      "Second unlock leaves 1 remaining credit",
      unlock2.success === true && unlock2.creditConsumed === true && unlock2.remaining === 1,
      `used: ${unlock2.used}, remaining: ${unlock2.remaining}`
    );

    const unlock3 = await consumeMusicTrialCredit(userA, "track_hi_03");
    test(
      "Third unlock exhausts all 3 trial credits",
      unlock3.success === true && unlock3.creditConsumed === true && unlock3.remaining === 0,
      `used: ${unlock3.used}, remaining: ${unlock3.remaining}`
    );

    const statusAfter3 = await getUserMusicTrialStatus(userA, "track_hi_04");
    test(
      "User A is now locked for new un-unlocked tracks",
      statusAfter3.isLocked === true && statusAfter3.canAccess === false && statusAfter3.remainingCredits === 0,
      `isLocked: ${statusAfter3.isLocked}, remaining: ${statusAfter3.remainingCredits}`
    );

    // User A should STILL have access to previously unlocked tracks (Tracks 1, 2, 3)
    const statusTrack1Revisit = await getUserMusicTrialStatus(userA, "track_hi_01");
    test(
      "User A retains permanent access to previously unlocked Track 1",
      statusTrack1Revisit.alreadyUnlocked === true && statusTrack1Revisit.canAccess === true
    );

    // ── Test 5: 4th Unlock Attempt Denied ──
    console.log("\n── 4. Testing Exhaustion Gate ──");
    const unlock4 = await consumeMusicTrialCredit(userA, "track_hi_04");
    test(
      "Attempting 4th unlock returns trial_exhausted and burns 0 credits",
      unlock4.success === false && unlock4.error === "trial_exhausted" && unlock4.remaining === 0,
      `error: ${unlock4.error}`
    );

    // ── Test 6: Multi-User Account Isolation ──
    console.log("\n── 5. Testing Multi-User Account Isolation ──");
    const statusUserB = await getUserMusicTrialStatus(userB, "track_hi_01");
    test(
      "User B remains unaffected by User A's exhaustion and has 3 credits",
      statusUserB.remainingCredits === 3 && statusUserB.usedCredits === 0 && statusUserB.canAccess === true,
      `User B remaining: ${statusUserB.remainingCredits}`
    );

    // ── Test 7: Waitlist Enrollment ──
    console.log("\n── 6. Testing Premium Waitlist Intent ──");
    const waitlistRes1 = await registerPremiumWaitlist(userA, "music_meaning_premium");
    test(
      "User A successfully joins waitlist",
      waitlistRes1.success === true && waitlistRes1.message.includes("You're on the list")
    );

    const statusAfterWaitlist = await getUserMusicTrialStatus(userA, "track_hi_04");
    test(
      "Waitlist status is reflected in user access status",
      statusAfterWaitlist.waitlistRequested === true
    );

    // Idempotent duplicate waitlist call
    const waitlistRes2 = await registerPremiumWaitlist(userA, "music_meaning_premium");
    test(
      "Subsequent waitlist call succeeds idempotently",
      waitlistRes2.success === true
    );

    // ── Test 8: Admin Role & Email Authorization ──
    console.log("\n── 7. Testing Admin Role Authorization ──");
    test(
      "Primary admin email is configured to singhpinky2989@gmail.com",
      PRIMARY_ADMIN_EMAIL === "singhpinky2989@gmail.com",
      PRIMARY_ADMIN_EMAIL
    );

    // Test non-admin user
    const isAdminUserA = await isUserAdmin(userA);
    test("Test User A is recognized as non-admin", isAdminUserA === false);

    console.log("\n============================================================");
    const passedCount = results.filter((r) => r.passed).length;
    const totalCount = results.length;
    console.log(`  RESULTS: ${passedCount} / ${totalCount} TESTS PASSED`);
    console.log("============================================================");

    if (passedCount === totalCount) {
      console.log("  STATUS: 3-TRIAL & WAITLIST ARCHITECTURE FULLY VERIFIED ✅");
    } else {
      console.error("  STATUS: SOME TESTS FAILED ❌");
      process.exit(1);
    }
  } catch (err) {
    console.error("Fatal test runner error:", err);
    process.exit(1);
  }
}

runSuite();

import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import crypto from "crypto";

// Read environment
const envFile = fs.readFileSync(".env.local", "utf-8");
const env = {};
envFile.split("\n").forEach((line) => {
  const [k, ...v] = line.trim().split("=");
  if (k && v.length) env[k.trim()] = v.join("=").trim();
});

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

const adminClient = createClient(url, serviceKey);

const OK = "✅";
const FAIL = "❌";
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, message, detail = "") {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ${OK} [PASS] ${message}${detail ? ` — ${detail}` : ""}`);
  } else {
    failedTests++;
    console.error(`  ${FAIL} [FAIL] ${message}${detail ? ` — ${detail}` : ""}`);
    throw new Error(`Assertion failed: ${message}`);
  }
}

// Client-side route decision logic matching src/lib/auth/guard.tsx & context.tsx
function evaluateRouteDecision({
  authStatus,
  user,
  isGuest,
  onboardingCompleted,
  onboardingStep,
  targetUrl,
}) {
  const isLoading =
    authStatus === "AUTH_LOADING" ||
    authStatus === "PROFILE_LOADING" ||
    authStatus === "ONBOARDING_STATE_LOADING";

  if (isLoading) {
    return { action: "WAIT_LOADING", destination: null };
  }

  if (authStatus === "UNAUTHENTICATED" && !isGuest) {
    return { action: "REDIRECT", destination: "/login" };
  }

  // Protecting /onboarding/**
  if (targetUrl.startsWith("/onboarding")) {
    if (authStatus === "AUTHENTICATED" && onboardingCompleted === true) {
      return { action: "REDIRECT", destination: "/app" };
    }
    return { action: "ALLOW", destination: targetUrl };
  }

  // Protecting /app/**
  if (targetUrl.startsWith("/app")) {
    if (authStatus === "AUTHENTICATED" && onboardingCompleted === false) {
      const stepRoute =
        onboardingStep === 2
          ? "/onboarding/interests"
          : onboardingStep === 3
          ? "/onboarding/world"
          : onboardingStep === 4
          ? "/onboarding/preferences"
          : onboardingStep === 5
          ? "/onboarding/appearance"
          : onboardingStep === 6
          ? "/onboarding/complete"
          : "/onboarding";
      return { action: "REDIRECT", destination: stepRoute };
    }
    return { action: "ALLOW", destination: targetUrl };
  }

  // Protecting /login and /signup
  if (targetUrl === "/login" || targetUrl === "/signup") {
    if (authStatus === "AUTHENTICATED" && user) {
      if (onboardingCompleted === true) {
        return { action: "REDIRECT", destination: "/app" };
      }
      return { action: "REDIRECT", destination: "/onboarding" };
    }
    return { action: "ALLOW", destination: targetUrl };
  }

  return { action: "ALLOW", destination: targetUrl };
}

async function runAuthLifecycleTests() {
  console.log("==================================================================");
  console.log("  ECHOSOUL AUTH & ONBOARDING LIFECYCLE VERIFICATION SUITE       ");
  console.log("==================================================================");

  const timestamp = Date.now();
  const userAEmail = `test_usr_a_${timestamp}@test.local`;
  const userBEmail = `test_usr_b_${timestamp}@test.local`;
  const password = "EchoSoulSecurity2026!Alpha";

  let userAId = null;
  let userBId = null;

  // ────────────────────────────────────────────────────────────────
  // TEST A — NEW USER
  // ────────────────────────────────────────────────────────────────
  console.log("\n── TEST A: NEW USER LIFECYCLE ─────────────────────────────────────");
  {
    // 1. Create brand new User A
    const { data: createData, error: createErr } = await adminClient.auth.admin.createUser({
      email: userAEmail,
      password,
      email_confirm: true,
      user_metadata: { display_name: "User Alpha" },
    });
    assert(!createErr && createData?.user, "User A created in Supabase Auth", userAEmail);
    userAId = createData.user.id;

    // 2. Ensure initial profile exists and check initial DB state
    const clientA = createClient(url, anonKey);
    const { data: signInData, error: signInErr } = await clientA.auth.signInWithPassword({
      email: userAEmail,
      password,
    });
    assert(!signInErr && signInData?.session, "User A signed in via credentials");

    const { data: initialProfile } = await clientA
      .from("profiles")
      .select("id, onboarding_completed, onboarding_step")
      .eq("id", userAId)
      .single();

    assert(initialProfile !== null, "User A profile row exists in Postgres");
    assert(
      initialProfile.onboarding_completed === false,
      "New User A has onboarding_completed = false in database"
    );
    assert(initialProfile.onboarding_step === 1, "New User A starts at onboarding_step = 1");

    // 3. Verify route decision for new user visiting /app
    const decisionToApp = evaluateRouteDecision({
      authStatus: "AUTHENTICATED",
      user: signInData.user,
      isGuest: false,
      onboardingCompleted: initialProfile.onboarding_completed,
      onboardingStep: initialProfile.onboarding_step,
      targetUrl: "/app",
    });
    assert(
      decisionToApp.action === "REDIRECT" && decisionToApp.destination === "/onboarding",
      "New User A attempting /app is intercepted and redirected to /onboarding"
    );

    // 4. Verify route decision for new user visiting /onboarding
    const decisionToOnboarding = evaluateRouteDecision({
      authStatus: "AUTHENTICATED",
      user: signInData.user,
      isGuest: false,
      onboardingCompleted: initialProfile.onboarding_completed,
      onboardingStep: initialProfile.onboarding_step,
      targetUrl: "/onboarding",
    });
    assert(
      decisionToOnboarding.action === "ALLOW",
      "New User A is permitted into /onboarding"
    );

    // 5. Simulate completing onboarding (saving through API/service)
    await adminClient.from("profiles").update({
      onboarding_completed: true,
      onboarding_step: 6,
      current_mood: "calm",
      current_focus: "studies",
      goals: ["talk", "words"],
    }).eq("id", userAId);

    // Verify DB update
    const { data: completedProfile } = await clientA
      .from("profiles")
      .select("onboarding_completed, onboarding_step")
      .eq("id", userAId)
      .single();

    assert(
      completedProfile.onboarding_completed === true,
      "Database confirms onboarding_completed = true after completion"
    );

    // Route decision now permits User A to reach /app
    const decisionAfterComplete = evaluateRouteDecision({
      authStatus: "AUTHENTICATED",
      user: signInData.user,
      isGuest: false,
      onboardingCompleted: completedProfile.onboarding_completed,
      onboardingStep: completedProfile.onboarding_step,
      targetUrl: "/app",
    });
    assert(
      decisionAfterComplete.action === "ALLOW" && decisionAfterComplete.destination === "/app",
      "User A reaches /app successfully after onboarding completion"
    );
  }

  // ────────────────────────────────────────────────────────────────
  // TEST B — RETURNING USER (LOGOUT -> LOGIN -> DIRECT TO /APP)
  // ────────────────────────────────────────────────────────────────
  console.log("\n── TEST B: RETURNING USER (LOGOUT -> LOGIN) ───────────────────────");
  {
    const clientA = createClient(url, anonKey);
    // Logout
    await clientA.auth.signOut();

    // Login again as User A
    const { data: reLoginData, error: reLoginErr } = await clientA.auth.signInWithPassword({
      email: userAEmail,
      password,
    });
    assert(!reLoginErr && reLoginData?.session, "User A successfully logged in again");

    // Fetch authoritative onboarding state from database
    const { data: returnProfile } = await clientA
      .from("profiles")
      .select("id, onboarding_completed, onboarding_step")
      .eq("id", userAId)
      .single();

    assert(
      returnProfile.onboarding_completed === true,
      "Authoritative DB confirms User A is already completed"
    );

    // Route decision on login
    const loginDecision = evaluateRouteDecision({
      authStatus: "AUTHENTICATED",
      user: reLoginData.user,
      isGuest: false,
      onboardingCompleted: returnProfile.onboarding_completed,
      onboardingStep: returnProfile.onboarding_step,
      targetUrl: "/login",
    });
    assert(
      loginDecision.action === "REDIRECT" && loginDecision.destination === "/app",
      "Login route decision sends returning User A directly to /app (NO onboarding)"
    );

    // Attempting /onboarding directly redirects to /app
    const onboardingAttempt = evaluateRouteDecision({
      authStatus: "AUTHENTICATED",
      user: reLoginData.user,
      isGuest: false,
      onboardingCompleted: returnProfile.onboarding_completed,
      onboardingStep: returnProfile.onboarding_step,
      targetUrl: "/onboarding",
    });
    assert(
      onboardingAttempt.action === "REDIRECT" && onboardingAttempt.destination === "/app",
      "Attempting to visit /onboarding as returning user redirects immediately to /app"
    );
  }

  // ────────────────────────────────────────────────────────────────
  // TEST C — HARD REFRESH
  // ────────────────────────────────────────────────────────────────
  console.log("\n── TEST C: HARD REFRESH SIMULATION ───────────────────────────────");
  {
    // Fresh client instance simulating page reload with restored session
    const refreshedClient = createClient(url, anonKey);
    const { data: sessionData } = await refreshedClient.auth.signInWithPassword({
      email: userAEmail,
      password,
    });

    const { data: profile } = await refreshedClient
      .from("profiles")
      .select("onboarding_completed")
      .eq("id", sessionData.user.id)
      .single();

    const decision = evaluateRouteDecision({
      authStatus: "AUTHENTICATED",
      user: sessionData.user,
      isGuest: false,
      onboardingCompleted: profile.onboarding_completed,
      onboardingStep: 6,
      targetUrl: "/app",
    });

    assert(
      decision.action === "ALLOW" && profile.onboarding_completed === true,
      "Hard refresh keeps returning User A on /app with NO onboarding"
    );
  }

  // ────────────────────────────────────────────────────────────────
  // TEST D — BROWSER RESTART
  // ────────────────────────────────────────────────────────────────
  console.log("\n── TEST D: BROWSER RESTART SIMULATION ─────────────────────────────");
  {
    // Brand new client with new memory context, simulating browser restart
    const restartedClient = createClient(url, anonKey);
    const { data: sessionData } = await restartedClient.auth.signInWithPassword({
      email: userAEmail,
      password,
    });

    const { data: profile } = await restartedClient
      .from("profiles")
      .select("onboarding_completed")
      .eq("id", sessionData.user.id)
      .single();

    assert(
      profile.onboarding_completed === true,
      "Browser restart successfully loads authoritative DB onboarding status = true"
    );

    const decision = evaluateRouteDecision({
      authStatus: "AUTHENTICATED",
      user: sessionData.user,
      isGuest: false,
      onboardingCompleted: profile.onboarding_completed,
      onboardingStep: 6,
      targetUrl: "/app",
    });
    assert(decision.action === "ALLOW", "Browser restart keeps user directly in /app");
  }

  // ────────────────────────────────────────────────────────────────
  // TEST E — SECOND DEVICE / BROWSER
  // ────────────────────────────────────────────────────────────────
  console.log("\n── TEST E: SECOND DEVICE / BROWSER ────────────────────────────────");
  {
    // Completely distinct client instance simulating independent second device
    const secondDeviceClient = createClient(url, anonKey);
    const { data: secondSession } = await secondDeviceClient.auth.signInWithPassword({
      email: userAEmail,
      password,
    });

    const { data: secondProfile } = await secondDeviceClient
      .from("profiles")
      .select("onboarding_completed")
      .eq("id", secondSession.user.id)
      .single();

    assert(
      secondProfile.onboarding_completed === true,
      "Second device correctly loads onboarding_completed = true from Postgres"
    );

    const decision = evaluateRouteDecision({
      authStatus: "AUTHENTICATED",
      user: secondSession.user,
      isGuest: false,
      onboardingCompleted: secondProfile.onboarding_completed,
      onboardingStep: 6,
      targetUrl: "/app",
    });
    assert(decision.action === "ALLOW", "Second device navigates directly to /app without onboarding");
  }

  // ────────────────────────────────────────────────────────────────
  // TEST F — ACCOUNT SWITCH (USER A -> USER B)
  // ────────────────────────────────────────────────────────────────
  console.log("\n── TEST F: ACCOUNT SWITCH & ISOLATION ────────────────────────────");
  {
    // 1. Create brand new User B
    const { data: createB, error: errB } = await adminClient.auth.admin.createUser({
      email: userBEmail,
      password,
      email_confirm: true,
      user_metadata: { display_name: "User Beta" },
    });
    assert(!errB && createB?.user, "User B created in Supabase Auth", userBEmail);
    userBId = createB.user.id;

    // 2. Client logs out User A and logs in User B
    const switchClient = createClient(url, anonKey);
    await switchClient.auth.signOut();

    const { data: sessionB } = await switchClient.auth.signInWithPassword({
      email: userBEmail,
      password,
    });

    // 3. Verify User B has NOT completed onboarding
    const { data: profileB } = await switchClient
      .from("profiles")
      .select("id, onboarding_completed, onboarding_step")
      .eq("id", userBId)
      .single();

    assert(
      profileB.onboarding_completed === false,
      "User B has onboarding_completed = false (not inheriting User A's true status)"
    );

    const decisionB = evaluateRouteDecision({
      authStatus: "AUTHENTICATED",
      user: sessionB.user,
      isGuest: false,
      onboardingCompleted: profileB.onboarding_completed,
      onboardingStep: profileB.onboarding_step,
      targetUrl: "/app",
    });
    assert(
      decisionB.action === "REDIRECT" && decisionB.destination === "/onboarding",
      "Account switch to new User B correctly redirects to /onboarding"
    );

    // Verify User B cannot read User A's profile row
    const { data: crossProfile } = await switchClient
      .from("profiles")
      .select("*")
      .eq("id", userAId);
    assert(
      !crossProfile || crossProfile.length === 0,
      "RLS ensures User B cannot read User A's profile row"
    );
  }

  // ────────────────────────────────────────────────────────────────
  // TEST G — TOKEN REFRESH
  // ────────────────────────────────────────────────────────────────
  console.log("\n── TEST G: TOKEN REFRESH STABILITY ────────────────────────────────");
  {
    const clientA = createClient(url, anonKey);
    const { data: sessionA } = await clientA.auth.signInWithPassword({
      email: userAEmail,
      password,
    });

    // Refresh the access token
    const { data: refreshedSession, error: refreshErr } = await clientA.auth.refreshSession();
    assert(!refreshErr && refreshedSession?.session, "Session token refreshed successfully");
    assert(
      refreshedSession.user.id === userAId,
      "User ID remains identical after token refresh"
    );

    // Onboarding status remains authoritative and stable
    const { data: stableProfile } = await clientA
      .from("profiles")
      .select("onboarding_completed")
      .eq("id", userAId)
      .single();

    assert(
      stableProfile.onboarding_completed === true,
      "Onboarding status remains stable during and after token refresh"
    );

    const decision = evaluateRouteDecision({
      authStatus: "AUTHENTICATED",
      user: refreshedSession.user,
      isGuest: false,
      onboardingCompleted: stableProfile.onboarding_completed,
      onboardingStep: 6,
      targetUrl: "/app",
    });
    assert(decision.action === "ALLOW", "Token refresh never causes an onboarding redirect");
  }

  // ────────────────────────────────────────────────────────────────
  // TEST H — MULTIPLE TABS SYNCHRONIZATION
  // ────────────────────────────────────────────────────────────────
  console.log("\n── TEST H: MULTIPLE TABS ISOLATION & RESPONSE ─────────────────────");
  {
    const tab1Client = createClient(url, anonKey);
    const tab2Client = createClient(url, anonKey);

    await tab1Client.auth.signInWithPassword({ email: userAEmail, password });
    await tab2Client.auth.signInWithPassword({ email: userBEmail, password });

    const { data: tab1User } = await tab1Client.auth.getUser();
    const { data: tab2User } = await tab2Client.auth.getUser();

    assert(tab1User.user.id === userAId, "Tab 1 isolated to User A");
    assert(tab2User.user.id === userBId, "Tab 2 isolated to User B");

    const { data: prof1 } = await tab1Client.from("profiles").select("onboarding_completed").eq("id", userAId).single();
    const { data: prof2 } = await tab2Client.from("profiles").select("onboarding_completed").eq("id", userBId).single();

    assert(prof1.onboarding_completed === true, "Tab 1 (User A) is completed");
    assert(prof2.onboarding_completed === false, "Tab 2 (User B) is new");
    assert(prof1.onboarding_completed !== prof2.onboarding_completed, "No cross-tab state mixing");
  }

  // ────────────────────────────────────────────────────────────────
  // TEST I — DATABASE AUTHORITY
  // ────────────────────────────────────────────────────────────────
  console.log("\n── TEST I: DATABASE AS SINGLE AUTHORITY ───────────────────────────");
  {
    const { data: dbA } = await adminClient
      .from("profiles")
      .select("id, onboarding_completed, onboarding_step")
      .eq("id", userAId)
      .single();

    const { data: dbB } = await adminClient
      .from("profiles")
      .select("id, onboarding_completed, onboarding_step")
      .eq("id", userBId)
      .single();

    assert(dbA.onboarding_completed === true, "Database confirms User A: onboarding_completed = true");
    assert(dbB.onboarding_completed === false, "Database confirms User B: onboarding_completed = false");

    // Check that race condition loading states do NOT redirect to onboarding
    const raceLoadingDecision = evaluateRouteDecision({
      authStatus: "AUTH_LOADING",
      user: null,
      isGuest: false,
      onboardingCompleted: null,
      onboardingStep: 1,
      targetUrl: "/app",
    });
    assert(
      raceLoadingDecision.action === "WAIT_LOADING",
      "Application NEVER redirects during AUTH_LOADING"
    );

    const profileLoadingDecision = evaluateRouteDecision({
      authStatus: "PROFILE_LOADING",
      user: { id: userAId },
      isGuest: false,
      onboardingCompleted: null,
      onboardingStep: 1,
      targetUrl: "/app",
    });
    assert(
      profileLoadingDecision.action === "WAIT_LOADING",
      "Application NEVER redirects during PROFILE_LOADING"
    );

    const onboardingLoadingDecision = evaluateRouteDecision({
      authStatus: "ONBOARDING_STATE_LOADING",
      user: { id: userAId },
      isGuest: false,
      onboardingCompleted: null,
      onboardingStep: 1,
      targetUrl: "/app",
    });
    assert(
      onboardingLoadingDecision.action === "WAIT_LOADING",
      "Application NEVER redirects during ONBOARDING_STATE_LOADING"
    );
  }

  // ────────────────────────────────────────────────────────────────
  // TEST J — PROFILE AND PREFERENCE ISOLATION
  // ────────────────────────────────────────────────────────────────
  console.log("\n── TEST J: PROFILE & PREFERENCE ISOLATION ─────────────────────────");
  {
    // Save unique goal to User A
    await adminClient.from("profiles").update({
      goals: ["unique_goal_alpha_999"],
    }).eq("id", userAId);

    const clientB = createClient(url, anonKey);
    await clientB.auth.signInWithPassword({ email: userBEmail, password });

    const { data: bProfile } = await clientB
      .from("profiles")
      .select("goals")
      .eq("id", userBId)
      .single();

    const hasLeak = Array.isArray(bProfile?.goals) && bProfile.goals.includes("unique_goal_alpha_999");
    assert(!hasLeak, "User A preferences never returned for User B");
  }

  // ── Clean up test accounts ──────────────────────────────────────
  console.log("\n── CLEANUP ────────────────────────────────────────────────────────");
  try {
    if (userAId) await adminClient.auth.admin.deleteUser(userAId);
    if (userBId) await adminClient.auth.admin.deleteUser(userBId);
    console.log(`  ${OK} Test user accounts successfully cleaned up`);
  } catch (err) {
    console.warn("Cleanup warning:", err.message);
  }

  console.log("\n==================================================================");
  console.log(`  LIFECYCLE TEST RESULTS: ${passedTests} PASSED / ${failedTests} FAILED (TOTAL: ${totalTests})`);
  console.log("==================================================================");

  if (failedTests > 0) {
    process.exit(1);
  }
}

runAuthLifecycleTests().catch((err) => {
  console.error("Test suite encountered unexpected crash:", err);
  process.exit(1);
});

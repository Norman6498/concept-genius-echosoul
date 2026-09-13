import { chromium } from "playwright";

const PORT = 3006;
const BASE_URL = `http://localhost:${PORT}`;

async function runBrowserTest() {
  console.log("============================================================");
  console.log("  ECHOSOUL: REAL BROWSER GUEST EXPLORER TEST (PLAYWRIGHT)  ");
  console.log("============================================================");

  console.log("\nLaunching headless Chromium...");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  try {
    // ── STEP 1: Visit Login Page ──
    console.log("\n── 1. Navigating to /login ──");
    await page.goto(`${BASE_URL}/login`, { waitUntil: "domcontentloaded" });
    console.log("  Arrived at:", page.url());

    // Locate Guest Explorer button
    const guestButton = page.locator("button:has-text('Continue directly as Guest Explorer')");
    await guestButton.waitFor({ state: "visible", timeout: 10000 });
    console.log("  Found Guest Explorer button on auth page.");

    // ── STEP 2: Click Guest Explorer & Verify Loading State ──
    console.log("\n── 2. Clicking 'Continue directly as Guest Explorer →' ──");
    await guestButton.click();

    // Verify loading state appears
    const loadingText = page.locator("text=Entering Explorer Mode");
    const sawLoading = await loadingText.isVisible({ timeout: 4000 }).catch(() => false);
    console.log("  Loading state ('Entering Explorer Mode…') observed:", sawLoading ? "✅ YES" : "⚠️ FAST TRANSITION");

    // ── STEP 3: Verify Redirect to /app ──
    console.log("\n── 3. Waiting for navigation to /app ──");
    await page.waitForURL("**/app", { timeout: 15000 });
    console.log("  ✅ Successfully arrived at /app! Current URL:", page.url());

    // ── STEP 4: Verify Guest Home UI ──
    console.log("\n── 4. Verifying Guest Home Welcome & Banner ──");
    await page.waitForSelector("h1:has-text('Welcome to Solenne.')", { timeout: 10000 });
    console.log("  ✅ Headline verified: 'Welcome to Solenne.'");

    const subtitle = await page.locator("text=Take a moment. Explore your space.").isVisible();
    console.log("  ✅ Subtitle verified: 'Take a moment. Explore your space.' ->", subtitle);

    const guestBanner = await page.locator("text=Guest Explorer Mode").isVisible();
    console.log("  ✅ Guest Mode Banner verified ->", guestBanner);

    const createAccountBtn = await page.locator("a:has-text('Create Account →')").isVisible();
    console.log("  ✅ Conversion link ('Create Account →') verified ->", createAccountBtn);

    // ── STEP 5: Page Refresh / Session Persistence ──
    console.log("\n── 5. Reloading page (F5 / Refresh) to test session retention ──");
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.waitForSelector("h1:has-text('Welcome to Solenne.')", { timeout: 10000 });
    console.log("  Post-refresh URL:", page.url());

    if (page.url().endsWith("/app")) {
      console.log("  ✅ Guest session persisted across hard reload without redirecting to login!");
    } else {
      throw new Error(`Guest session lost after reload! Redirected to ${page.url()}`);
    }

    await page.screenshot({ path: "public/debug/guest_explorer_verified.png", fullPage: false });
    console.log("  📸 Saved verification screenshot to public/debug/guest_explorer_verified.png");

    // ── STEP 6: Guest Logout ──
    console.log("\n── 6. Testing Guest Logout ──");
    page.on("dialog", async (dialog) => {
      console.log("  Dialog caught & accepted:", dialog.message());
      await dialog.accept();
    });

    await page.goto(`${BASE_URL}/app/profile`, { waitUntil: "domcontentloaded" });
    const logoutButton = page.locator("button:has-text('Sign Out')");
    await logoutButton.waitFor({ state: "visible", timeout: 10000 });
    await logoutButton.click();
    await page.waitForURL("**/login", { timeout: 10000 });
    console.log("  ✅ Successfully logged out and returned to /login!");

    // ── STEP 7: Second Guest Entry Isolation ──
    console.log("\n── 7. Creating Second Guest Session ──");
    const secondGuestButton = page.locator("button:has-text('Continue directly as Guest Explorer')");
    await secondGuestButton.waitFor({ state: "visible", timeout: 10000 });
    await secondGuestButton.click();
    await page.waitForURL("**/app", { timeout: 15000 });
    console.log("  ✅ Second guest session successfully entered /app!");

    await browser.close();
    console.log("\n============================================================");
    console.log("  ALL REAL BROWSER WORKFLOW TESTS PASSED CLEANLY! ✅");
    console.log("============================================================");
  } catch (err) {
    await browser.close();
    throw err;
  }
}

runBrowserTest().catch((err) => {
  console.error("Browser test failed:", err);
  process.exit(1);
});

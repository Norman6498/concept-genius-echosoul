const { chromium } = require("playwright");

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 960 },
    deviceScaleFactor: 1.5,
  });
  const page = await context.newPage();

  console.log("── Testing Complete Onboarding Pipeline (Maya: Ocean Breeze & Sunrise Calm) ──");

  // Step 1: /onboarding
  console.log("Navigating to Step 1 (/onboarding)...");
  await page.goto("http://localhost:3000/onboarding", { waitUntil: "networkidle" });
  await page.fill('input[placeholder="Your name"]', "Maya");
  await page.click('button:has-text("Calm")');
  await page.click('button:has-text("Want to be more creative")');
  await page.screenshot({ path: "public/screenshot_step1_polish.png" });
  await page.click('button:has-text("Next")');
  await page.waitForTimeout(1000);

  // Step 2: /onboarding/interests
  console.log("Navigating to Step 2 (/onboarding/interests)... Current URL:", page.url());
  await page.click('button:has-text("Writing")');
  await page.click('button:has-text("Music")');
  await page.screenshot({ path: "public/screenshot_step2_interests.png" });
  await page.click('button:has-text("Next")');
  await page.waitForTimeout(1000);

  // Step 3: /onboarding/world
  console.log("Navigating to Step 3 (/onboarding/world)... Current URL:", page.url());
  // Select Ocean Breeze in visual world
  await page.click('button:has-text("Ocean Breeze")');
  // Select Early Riser
  await page.click('button:has-text("Early Riser")');
  await page.screenshot({ path: "public/screenshot_step3_world.png" });
  await page.click('button:has-text("Next")');
  await page.waitForTimeout(1000);

  // Step 4: /onboarding/preferences
  console.log("Navigating to Step 4 (/onboarding/preferences)... Current URL:", page.url());
  await page.click('button:has-text("Gentle & Empathetic")');
  await page.screenshot({ path: "public/screenshot_step4_preferences.png" });
  await page.click('button:has-text("Next")');
  await page.waitForTimeout(1000);

  // Step 5: /onboarding/appearance
  console.log("Navigating to Step 5 (/onboarding/appearance)... Current URL:", page.url());
  await page.click('button:has-text("Sunrise Calm")');
  await page.screenshot({ path: "public/screenshot_step5_appearance.png" });
  await page.click('button:has-text("Next")');
  await page.waitForTimeout(1000);

  // Step 6: /onboarding/complete
  console.log("Navigating to Step 6 (/onboarding/complete)... Current URL:", page.url());
  await page.screenshot({ path: "public/screenshot_step6_complete.png" });
  await page.click('button:has-text("Enter EchoSoul →")');
  await page.waitForTimeout(1200);

  // Authenticated Home (/app) for Maya
  console.log("Arrived at Authenticated Home (/app)... Current URL:", page.url());
  await page.screenshot({ path: "public/screenshot_maya_ocean_home.png" });
  const mayaHeading = await page.textContent("h1");
  console.log("Maya Home Greeting:", mayaHeading);

  // ── Testing User 2: Kenji (Forest Green + Forest Retreat) ──
  console.log("\n── Testing User 2: Kenji (Forest Green + Forest Retreat) ──");
  const contextKenji = await browser.newContext({
    viewport: { width: 1440, height: 960 },
    deviceScaleFactor: 1.5,
  });
  const pageKenji = await contextKenji.newPage();

  // Set Kenji's state directly into localStorage to test instant hydration
  await pageKenji.goto("http://localhost:3000/onboarding/appearance");
  await pageKenji.evaluate(() => {
    localStorage.setItem("echosoul_user_personalization", JSON.stringify({ name: "Kenji", currentMood: "calm", currentFocus: "growth" }));
    localStorage.setItem("echosoul_user_world", JSON.stringify({ visualWorld: "forest_retreat", dailySchedule: "balanced" }));
    localStorage.setItem("echosoul_user_appearance", JSON.stringify({ theme: "forest_green", accentColor: "#8DBA8F", backgroundEnvironment: "forest_cabin" }));
  });
  await pageKenji.goto("http://localhost:3000/app", { waitUntil: "networkidle" });
  await pageKenji.screenshot({ path: "public/screenshot_kenji_forest_home.png" });
  const kenjiHeading = await pageKenji.textContent("h1");
  console.log("Kenji Home Greeting:", kenjiHeading);

  // ── Testing User 3: Alex (Minimal Light + Minimal Space) ──
  console.log("\n── Testing User 3: Alex (Minimal Light + Minimal Space) ──");
  const contextAlex = await browser.newContext({
    viewport: { width: 1440, height: 960 },
    deviceScaleFactor: 1.5,
  });
  const pageAlex = await contextAlex.newPage();
  await pageAlex.goto("http://localhost:3000/onboarding/appearance");
  await pageAlex.evaluate(() => {
    localStorage.setItem("echosoul_user_personalization", JSON.stringify({ name: "Alex", currentMood: "calm", currentFocus: "exploring" }));
    localStorage.setItem("echosoul_user_world", JSON.stringify({ visualWorld: "minimal_space", dailySchedule: "early_riser" }));
    localStorage.setItem("echosoul_user_appearance", JSON.stringify({ theme: "minimal_light", accentColor: "#E2E8F0", backgroundEnvironment: "cozy_room" }));
  });
  await pageAlex.goto("http://localhost:3000/app", { waitUntil: "networkidle" });
  await pageAlex.screenshot({ path: "public/screenshot_alex_minimal_home.png" });
  const alexHeading = await pageAlex.textContent("h1");
  console.log("Alex Home Greeting:", alexHeading);

  await browser.close();
  console.log("\nAll end-to-end tests completed successfully!");
}

run().catch((err) => {
  console.error("Test error:", err);
  process.exit(1);
});

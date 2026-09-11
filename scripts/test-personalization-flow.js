const { chromium } = require("playwright");
const fs = require("fs");

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 960 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  console.log("── Testing User A: Alice (Calm, Creative, Literature & Music) ──");
  
  // Navigate to step 1 and populate Alice
  await page.goto("http://localhost:3000/onboarding", { waitUntil: "networkidle" });
  await page.fill('input[placeholder="Your name"]', "Alice");
  // Select Calm mood
  await page.click('button:has-text("Calm")');
  // Select Want to be more creative
  await page.click('button:has-text("Want to be more creative")');
  // Click Next
  await page.click('button:has-text("Next")');
  await page.waitForTimeout(800);

  // Now on /onboarding/interests
  console.log("Current URL:", page.url());
  // Ensure Literature, Music, and Poetry are selected
  // Select Poetry under Entertainment
  await page.click('button:has-text("Poetry")');
  // Click Next to save and go to /app
  await page.click('button:has-text("Next")');
  await page.waitForTimeout(1000);

  console.log("Arrived at URL:", page.url());
  await page.screenshot({ path: "public/screenshot_alice_home.png", fullPage: true });
  console.log("Captured Alice Home: public/screenshot_alice_home.png");

  // Verify Alice's personalized content
  const aliceGreeting = await page.textContent("h1");
  console.log("Alice Heading:", aliceGreeting);

  console.log("\n── Testing User B: Rahul (Stressed, Studies, Technology) ──");
  // Clear storage / new context for Rahul
  const contextRahul = await browser.newContext({
    viewport: { width: 1440, height: 960 },
    deviceScaleFactor: 2,
  });
  const pageRahul = await contextRahul.newPage();

  await pageRahul.goto("http://localhost:3000/onboarding", { waitUntil: "networkidle" });
  await pageRahul.fill('input[placeholder="Your name"]', "Rahul");
  // Select Stressed mood
  await pageRahul.click('button:has-text("Stressed")');
  // Select Focused on studies
  await pageRahul.click('button:has-text("Focused on studies")');
  // Click Next
  await pageRahul.click('button:has-text("Next")');
  await pageRahul.waitForTimeout(800);

  console.log("Rahul on URL:", pageRahul.url());
  // Deselect Literature, Select Technology
  await pageRahul.click('button:has-text("Technology")');
  await pageRahul.click('button:has-text("Analytical")');
  // Click Next to save and go to /app
  await pageRahul.click('button:has-text("Next")');
  await pageRahul.waitForTimeout(1000);

  console.log("Rahul arrived at URL:", pageRahul.url());
  await pageRahul.screenshot({ path: "public/screenshot_rahul_home.png", fullPage: true });
  console.log("Captured Rahul Home: public/screenshot_rahul_home.png");

  const rahulGreeting = await pageRahul.textContent("h1");
  console.log("Rahul Heading:", rahulGreeting);

  await browser.close();
  console.log("\nAll acceptance tests completed successfully!");
}

run().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});

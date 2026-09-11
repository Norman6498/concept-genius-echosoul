const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 960 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  // 1. Landing Page (Clean Hero, no about section)
  console.log("Navigating to / (Landing)...");
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  await page.screenshot({ path: "public/screenshot_landing_clean.png", fullPage: true });
  console.log("Saved screenshot_landing_clean.png");

  // 2. Real About Page (/about)
  console.log("Navigating to /about...");
  await page.goto("http://localhost:3000/about", { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  await page.screenshot({ path: "public/screenshot_real_about.png", fullPage: true });
  console.log("Saved screenshot_real_about.png");

  // 3. Step 1 Onboarding (/onboarding)
  console.log("Navigating to /onboarding...");
  await page.goto("http://localhost:3000/onboarding", { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  await page.screenshot({ path: "public/screenshot_step1_polish.png", fullPage: true });
  console.log("Saved screenshot_step1_polish.png");

  // 4. Step 2 Onboarding: Interests (/onboarding/interests)
  console.log("Navigating to /onboarding/interests...");
  await page.goto("http://localhost:3000/onboarding/interests", { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  await page.screenshot({ path: "public/screenshot_step2_interests.png", fullPage: true });
  console.log("Saved screenshot_step2_interests.png");

  // 5. Authenticated Home (/app)
  console.log("Navigating to /app (Authenticated Home)...");
  await page.goto("http://localhost:3000/app", { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  await page.screenshot({ path: "public/screenshot_authenticated_home.png", fullPage: true });
  console.log("Saved screenshot_authenticated_home.png");

  await browser.close();
  console.log("All screenshots captured successfully!");
}

main().catch(err => {
  console.error("Screenshot error:", err);
  process.exit(1);
});

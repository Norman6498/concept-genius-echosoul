import { chromium } from "playwright";
import fs from "fs";
import path from "path";

async function main() {
  const outputDir = path.resolve("public/debug/visual-qa");
  fs.mkdirSync(outputDir, { recursive: true });

  const browser = await chromium.launch();

  // Desktop context
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  console.log("Navigating to login...");
  await page.goto("http://localhost:3001/login", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1000);

  // Fill credentials for echosoul_user_a@test.local
  console.log("Signing in with verified account...");
  await page.fill('input[type="email"]', "echosoul_user_a@test.local");
  await page.fill('input[type="password"]', "EchoSoulSecurity2026!A");
  await page.click('button[type="submit"]');

  // Wait for redirect to /app
  console.log("Waiting for /app redirect and full mount...");
  await page.waitForURL("**/app**", { timeout: 15000 }).catch(() => {});
  // Wait for loading screen to complete and main sanctuary home to appear
  await page.waitForTimeout(4500);

  // Capture /app
  console.log("Capturing /app sanctuary home...");
  await page.screenshot({ path: path.join(outputDir, "sanctuary_home_desktop.png") });

  // Navigate to /app/visuals
  console.log("Navigating to /app/visuals...");
  await page.goto("http://localhost:3001/app/visuals", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: path.join(outputDir, "app_visuals_authenticated.png") });

  // Navigate to /app/words
  console.log("Navigating to /app/words...");
  await page.goto("http://localhost:3001/app/words", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: path.join(outputDir, "app_words_authenticated.png") });

  // Navigate to /app/music
  console.log("Navigating to /app/music...");
  await page.goto("http://localhost:3001/app/music", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: path.join(outputDir, "app_music_authenticated.png") });

  await browser.close();
  console.log("✅ All sanctuary screens captured successfully!");
}

main().catch(err => {
  console.error("QA Capture Error:", err);
  process.exit(1);
});

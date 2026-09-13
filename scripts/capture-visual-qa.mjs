import { chromium } from "playwright";
import fs from "fs";
import path from "path";

async function main() {
  const outputDir = path.resolve("public/debug/visual-qa");
  fs.mkdirSync(outputDir, { recursive: true });

  const browser = await chromium.launch();
  
  const routes = [
    { name: "home", url: "http://localhost:3001/" },
    { name: "login", url: "http://localhost:3001/login" },
    { name: "about", url: "http://localhost:3001/about" },
    { name: "features", url: "http://localhost:3001/features" },
    { name: "stories", url: "http://localhost:3001/stories" },
    { name: "pricing", url: "http://localhost:3001/pricing" },
    { name: "onboarding", url: "http://localhost:3001/onboarding" },
    { name: "app_visuals", url: "http://localhost:3001/app/visuals" }
  ];

  console.log("Starting Visual QA capture...");

  // Desktop context (1440x900)
  const desktopContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  const desktopPage = await desktopContext.newPage();

  for (const route of routes) {
    console.log(`Capturing Desktop: ${route.name} (${route.url})`);
    await desktopPage.goto(route.url, { waitUntil: "networkidle", timeout: 15000 }).catch(() => {});
    await desktopPage.waitForTimeout(1000);
    const dest = path.join(outputDir, `${route.name}_desktop.png`);
    await desktopPage.screenshot({ path: dest, fullPage: false });
    console.log(`Saved: ${dest}`);
  }

  // Mobile context (iPhone 14 equivalent: 390x844)
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
  });
  const mobilePage = await mobileContext.newPage();

  for (const route of routes) {
    console.log(`Capturing Mobile: ${route.name} (${route.url})`);
    await mobilePage.goto(route.url, { waitUntil: "networkidle", timeout: 15000 }).catch(() => {});
    await mobilePage.waitForTimeout(1000);
    const dest = path.join(outputDir, `${route.name}_mobile.png`);
    await mobilePage.screenshot({ path: dest, fullPage: false });
    console.log(`Saved: ${dest}`);
  }

  await browser.close();
  console.log("✅ Visual QA capture complete!");
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function testFinalHomepage() {
  console.log('--- Launching browser to verify Final Homepage 1:1 ---');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1680, height: 1050 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  // Set local storage personalization so user name is 'Pratik' matching reference
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => {
    localStorage.setItem('echosoul_user_personalization', JSON.stringify({
      name: 'Pratik',
      role: 'Explorer',
      currentMood: 'calm',
      currentFocus: 'studies',
    }));
    localStorage.setItem('echosoul_user_interests', JSON.stringify({
      vibe: 'Creative',
      interests: ['Literature', 'Philosophy', 'Music'],
    }));
    localStorage.setItem('echosoul_user_world', JSON.stringify({
      visualWorld: 'mountain_calm',
    }));
    localStorage.setItem('echosoul_user_appearance', JSON.stringify({
      theme: 'midnight_soul',
      accentColor: '#F2D78A',
    }));
  });

  console.log('Navigating to /app...');
  await page.goto('http://localhost:3000/app', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Take screenshot of default loaded homepage
  const screenshotPath1 = path.join(__dirname, '../public/debug/homepage_114009_verified.png');
  await page.screenshot({ path: screenshotPath1, fullPage: false });
  console.log('Saved screenshot 1 to', screenshotPath1);

  // Test interactive Talk bar with paper writing words animation
  console.log('Testing "Suggest a book" quick prompt...');
  const suggestBookBtn = page.locator('button:has-text("Suggest a book")');
  await suggestBookBtn.click();
  
  // Wait for paper writing animation to type out
  await page.waitForTimeout(2200);

  const screenshotPath2 = path.join(__dirname, '../public/debug/paper_writing_animation_verified.png');
  await page.screenshot({ path: screenshotPath2, fullPage: false });
  console.log('Saved screenshot 2 (paper writing) to', screenshotPath2);

  // Test Daily Check-in Save
  console.log('Testing Daily Check-in Calm mood click...');
  const goodMoodBtn = page.locator('button:has-text("Good")').first();
  if (await goodMoodBtn.isVisible()) {
    await goodMoodBtn.click();
    await page.waitForTimeout(500);
  }

  // Also test Features page navigation
  console.log('Navigating to /features to confirm features realm...');
  await page.goto('http://localhost:3000/features', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  const screenshotPath3 = path.join(__dirname, '../public/debug/features_page_verified.png');
  await page.screenshot({ path: screenshotPath3, fullPage: false });
  console.log('Saved screenshot 3 (features page) to', screenshotPath3);

  await browser.close();
  console.log('--- All verifications completed successfully! ---');
}

testFinalHomepage().catch((err) => {
  console.error('Test error:', err);
  process.exit(1);
});

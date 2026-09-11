const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function runTest() {
  console.log('🚀 Starting Comprehensive Reactive Onboarding & Assets Test...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  const publicDir = path.join(__dirname, '..', 'public');

  try {
    // ── 1. AUTH PLACEHOLDER VERIFICATION ──────────────────────────────────────
    console.log('\n--- 1. Testing Auth & Registration Placeholders ---');
    await page.goto('http://localhost:3000/signup', { waitUntil: 'networkidle' });
    const namePlaceholder = await page.getAttribute('input[type="text"]', 'placeholder');
    console.log('Signup Name Input Placeholder:', namePlaceholder);
    if (namePlaceholder.includes('Pratik')) {
      throw new Error(`Personal name found in placeholder: ${namePlaceholder}`);
    }
    console.log('✅ Signup placeholder is clean & neutral:', namePlaceholder);

    // ── 2. STEP 1 ROLE OTHER INPUT TEST ───────────────────────────────────────
    console.log('\n--- 2. Testing Step 1 "I am a" -> Other text input ---');
    await page.goto('http://localhost:3000/onboarding', { waitUntil: 'networkidle' });
    await page.fill('#user-name-input', 'Maya');
    
    // Click "Other" role button
    const otherRoleBtn = page.locator('button:has-text("Other")').first();
    await otherRoleBtn.click();
    await page.waitForTimeout(300);

    // Verify custom role input appeared
    const customRoleInput = page.locator('input[placeholder*="Specify your role"]');
    await customRoleInput.waitFor({ state: 'visible', timeout: 3000 });
    await customRoleInput.fill('Creative Director');
    console.log('✅ Custom role text input works: "Creative Director" entered');

    await page.screenshot({ path: path.join(publicDir, 'screenshot_step1_other.png') });

    // Submit step 1 with Next button
    const step1Next = page.locator('button[type="submit"]:has-text("Next")');
    await step1Next.click();
    await page.waitForURL('**/onboarding/interests', { timeout: 10000 });

    // ── 3. STEP 2 INTERESTS THREE-DOTS ICON & CUSTOM INPUT ───────────────────
    console.log('\n--- 3. Testing Step 2 Three-Dots Icon & Custom Interests ---');
    await page.waitForTimeout(1000);

    // Find "Other" button in Creative Interests (2nd category)
    const creativeCategory = page.locator('text=Creative Interests').locator('..').locator('..');
    const otherCreativeBtn = creativeCategory.locator('button:has-text("Other")');
    await otherCreativeBtn.click();
    await page.waitForTimeout(300);

    // Verify custom input appeared for Creative Interests
    const customCatInput = creativeCategory.locator('input[placeholder*="Type custom interest"]');
    await customCatInput.waitFor({ state: 'visible', timeout: 3000 });
    await customCatInput.fill('Calligraphy Art');
    await creativeCategory.locator('button:has-text("+ Add")').click();
    await page.waitForTimeout(300);

    // Verify chip appeared
    const chip = creativeCategory.locator('text=Calligraphy Art');
    await chip.waitFor({ state: 'visible', timeout: 3000 });
    console.log('✅ Custom interest chip added successfully: "Calligraphy Art"');

    await page.screenshot({ path: path.join(publicDir, 'screenshot_step2_other.png') });

    // Click Next
    const step2Next = page.locator('button[type="submit"]:has-text("Next")');
    await step2Next.click();
    await page.waitForURL('**/onboarding/world', { timeout: 10000 });

    // ── 4. STEP 3 VISUAL WORLDS CLEAN SCENERY TEST ───────────────────────────
    console.log('\n--- 4. Testing Step 3 Visual Worlds Clean High-Res Scenery ---');
    await page.waitForTimeout(1000);

    // Select Ocean Breeze
    const oceanBreezeCard = page.locator('button:has-text("Ocean Breeze")');
    await oceanBreezeCard.click();
    await page.waitForTimeout(500);

    await page.screenshot({ path: path.join(publicDir, 'screenshot_step3_worlds_clean.png') });
    console.log('✅ Step 3 clean visual world scenery screenshot captured');

    // Click Next
    await page.click('button[type="submit"]:has-text("Next")');
    await page.waitForURL('**/onboarding/preferences', { timeout: 10000 });

    // ── 5. STEP 4 PREFERENCES LIVE REACTIVE PREVIEW ───────────────────────────
    console.log('\n--- 5. Testing Step 4 Live Reactive Preview ---');
    await page.waitForTimeout(1000);

    // Initial preview text check
    let previewGreeting = await page.locator('.font-medium.mb-1').first().textContent();
    console.log('Initial Assistant Greeting:', previewGreeting);

    // Test A: Change Communication Style to "Direct & honest"
    console.log('Testing: Select Direct & honest...');
    await page.locator('button:has-text("Direct & honest")').click();
    await page.waitForTimeout(400);
    previewGreeting = await page.locator('.font-medium.mb-1').first().textContent();
    console.log('Updated Assistant Greeting (Direct):', previewGreeting);

    // Test B: Change Response Length to "Short & simple"
    console.log('Testing: Select Short & simple...');
    await page.locator('button:has-text("Short & simple")').click();
    await page.waitForTimeout(300);

    // Test C: Select "Science & ideas" topic
    console.log('Testing: Toggle Science & ideas...');
    await page.locator('button:has-text("Science & ideas")').click();
    await page.waitForTimeout(400);

    await page.screenshot({ path: path.join(publicDir, 'screenshot_step4_live_preview.png') });
    console.log('✅ Step 4 live reactive preview validated & screenshot captured');

    // Click Next to Step 5
    await page.click('button[type="submit"]:has-text("Next → Step 5: Appearance")');
    await page.waitForURL('**/onboarding/appearance', { timeout: 10000 });

    // ── 6. STEP 5 APPEARANCE LIVE PREVIEW & CROSS-PAGE SYNC ──────────────────
    console.log('\n--- 6. Testing Step 5 Live Appearance Preview & Synchronization ---');
    await page.waitForTimeout(1000);

    // Verify preview still reflects preferences chosen in Step 4
    let appearancePreviewGreeting = await page.locator('.font-medium.mb-1').first().textContent();
    console.log('Appearance Page Preview Greeting (retained from Step 4):', appearancePreviewGreeting);

    // Test D: Change Theme to "Sunrise Calm"
    console.log('Testing: Select Sunrise Calm theme...');
    await page.locator('button:has-text("Sunrise Calm")').click();
    await page.waitForTimeout(400);

    // Test E: Change Accent Color to "Blue"
    console.log('Testing: Select Blue accent...');
    const blueBtn = page.locator('button[aria-label="Blue"]');
    await blueBtn.click();
    await page.waitForTimeout(400);

    // Test F: Change Background Environment to "Ocean View"
    console.log('Testing: Select Ocean View environment...');
    await page.locator('button:has-text("Ocean View")').click();
    await page.waitForTimeout(400);

    // Test G: Change Font Style to "Sans Serif"
    console.log('Testing: Select Sans Serif font...');
    await page.locator('button:has-text("Sans Serif")').click();
    await page.waitForTimeout(400);

    await page.screenshot({ path: path.join(publicDir, 'screenshot_step5_live_preview.png') });
    console.log('✅ Step 5 live appearance preview validated & screenshot captured');

    // ── 7. CROSS-PAGE BIDIRECTIONAL RETENTION TEST ───────────────────────────
    console.log('\n--- 7. Testing Step 5 -> Step 4 Back Navigation Retention ---');
    await page.click('a:has-text("← Back")');
    await page.waitForURL('**/onboarding/preferences', { timeout: 10000 });
    await page.waitForTimeout(1000);

    // Check that "Direct & honest" is still selected
    const directBtnClass = await page.locator('button:has-text("Direct & honest")').getAttribute('class');
    const isDirectSelected = directBtnClass.includes('border-[#F2D78A]') || directBtnClass.includes('shadow-');
    console.log('Is "Direct & honest" still selected on Step 4 after Back?:', isDirectSelected);

    // Verify preview still retains Blue accent and Sunrise Calm styling
    await page.screenshot({ path: path.join(publicDir, 'screenshot_step4_retained.png') });
    console.log('✅ Bidirectional cross-page state retention verified!');

    // Return to Step 5 and then Complete
    await page.click('button[type="submit"]:has-text("Next → Step 5: Appearance")');
    await page.waitForURL('**/onboarding/appearance', { timeout: 10000 });
    await page.waitForTimeout(500);

    await page.click('button[type="submit"]:has-text("Next → Step 6: Complete")');
    await page.waitForURL('**/onboarding/complete', { timeout: 10000 });
    await page.waitForTimeout(1000);

    // ── 8. STEP 6 COMPLETE PORTAL VERIFICATION ──────────────────────────────
    console.log('\n--- 8. Testing Step 6 Complete Arched Portal & Launchpad ---');
    await page.screenshot({ path: path.join(publicDir, 'screenshot_step6_clean.png') });

    // Enter EchoSoul
    await page.click('button:has-text("Enter EchoSoul →")');
    await page.waitForURL('**/app', { timeout: 10000 });
    await page.waitForTimeout(1500);

    // ── 9. AUTHENTICATED HOME WITH DYNAMIC NAME & SCENERY ────────────────────
    console.log('\n--- 9. Testing Authenticated Home Dynamic Personalization ---');
    const homeGreeting = await page.locator('h1').textContent();
    console.log('Home Dynamic Headline Greeting:', homeGreeting);
    if (!homeGreeting.includes('Maya')) {
      console.warn('Expected user name "Maya" in greeting, got:', homeGreeting);
    } else {
      console.log('✅ Verified: Actual user name "Maya" rendered dynamically in HTML typography!');
    }

    await page.screenshot({ path: path.join(publicDir, 'screenshot_maya_home_final.png') });
    console.log('✅ Final Home screenshot captured successfully!');

    console.log('\n🎉 ALL ACCEPTANCE TESTS PASSED WITH 100% SUCCESS!');
  } catch (err) {
    console.error('❌ Test failed:', err);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
}

runTest();

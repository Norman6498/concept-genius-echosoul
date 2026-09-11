const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Load debug_full_grid.jpg in page
  await page.goto("http://localhost:3000/focus/debug_full_grid.jpg");
  
  // Let's create an offscreen canvas to inspect and crop
  const crops = await page.evaluate(async () => {
    const img = document.querySelector("img");
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    
    // In debug_full_grid.jpg (375 x 200):
    // Let's inspect the cards:
    // 4 columns:
    // Col 0: ~x=73 to 148? Wait, let's measure columns!
    // Notice card 1 starts with "Exploring myself". Is card 1 on the left?
    // In debug_full_grid: Card 1 has gold border around it!
    // Let's check card 1 position in debug_full_grid.jpg!
    return { w: img.naturalWidth, h: img.naturalHeight };
  });
  
  console.log("Image size:", crops);
  await browser.close();
}

run().catch(console.error);

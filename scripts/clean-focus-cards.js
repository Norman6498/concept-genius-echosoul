const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // We will process focus-1 to focus-4: crop out bottom 32% where text is, enhance
  // And focus-5 to focus-8: enhance contrast/vibrancy and ensure no borders
  for (let i = 1; i <= 8; i++) {
    const srcUrl = `http://localhost:3000/focus/focus-${i}.jpg`;
    await page.goto(srcUrl);

    const processedDataUrl = await page.evaluate((index) => {
      const img = document.querySelector("img");
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // For cards 1-4, the text occupies roughly the bottom 30% of the image.
      // We take the top 70% to completely eliminate any text.
      let srcY = 0;
      let srcH = img.naturalHeight;
      let srcX = 0;
      let srcW = img.naturalWidth;

      if (index <= 4) {
        srcX = 4;
        srcW = img.naturalWidth - 8;
        srcH = Math.floor(img.naturalHeight * 0.95);
      } else {
        // For cards 5-8, trim 3px borders if any
        srcX = 4;
        srcW = img.naturalWidth - 8;
        srcY = 2;
        srcH = img.naturalHeight - 4;
      }

      // Output crisp 360x240 image (3:2 ratio)
      canvas.width = 360;
      canvas.height = 240;

      // Draw with slight contrast & saturation boost
      ctx.filter = "contrast(1.1) saturate(1.15) brightness(1.02)";
      ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, canvas.width, canvas.height);

      return canvas.toDataURL("image/jpeg", 0.95);
    }, i);

    const base64Data = processedDataUrl.replace(/^data:image\/jpeg;base64,/, "");
    fs.writeFileSync(`public/focus/focus-${i}.jpg`, Buffer.from(base64Data, "base64"));
    console.log(`Updated focus-${i}.jpg (text-free, enhanced)`);
  }

  await browser.close();
}

run().catch(console.error);

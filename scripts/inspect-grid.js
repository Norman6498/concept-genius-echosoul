const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  const imgPath = path.resolve("public/focus/debug_full_grid.jpg").replace(/\\/g, "/");
  await page.setContent(`
    <html>
      <body style="margin:0; background:#000;">
        <img id="img" src="file:///${imgPath}" />
      </body>
    </html>
  `);
  
  const dim = await page.evaluate(() => {
    const img = document.getElementById("img");
    return { width: img.naturalWidth, height: img.naturalHeight };
  });
  console.log("debug_full_grid natural dimensions:", dim);
  
  await browser.close();
}

run().catch(console.error);

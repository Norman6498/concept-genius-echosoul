const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto("http://localhost:3000/focus/debug_full_grid.jpg");
  
  const rulerDataUrl = await page.evaluate(() => {
    const img = document.querySelector("img");
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    
    // Draw ruler grid every 20px
    ctx.strokeStyle = "rgba(255, 0, 0, 0.4)";
    ctx.lineWidth = 1;
    ctx.font = "8px sans-serif";
    ctx.fillStyle = "yellow";
    
    for (let x = 0; x < canvas.width; x += 20) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
      ctx.fillText(x.toString(), x + 1, 10);
    }
    for (let y = 0; y < canvas.height; y += 20) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
      ctx.fillText(y.toString(), 2, y + 8);
    }
    return canvas.toDataURL("image/png");
  });
  
  const base64Data = rulerDataUrl.replace(/^data:image\/png;base64,/, "");
  fs.writeFileSync("public/focus/debug_grid_ruler.png", Buffer.from(base64Data, "base64"));
  console.log("Saved debug_grid_ruler.png");
  
  await browser.close();
}

run().catch(console.error);

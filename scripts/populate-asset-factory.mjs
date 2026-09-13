/**
 * EchoSoul Asset Factory Synchronizer & Manifest Builder
 *
 * Populates public/assets/echosoul/ and generates 19-manifest/manifest.json
 */

import fs from 'fs';
import path from 'path';

function copyIfExists(src, dest) {
  if (fs.existsSync(src)) {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
    return true;
  }
  return false;
}

console.log('--- Synchronizing EchoSoul Asset Factory ---');

// 01-brand
if (fs.existsSync('public/brand')) {
  fs.readdirSync('public/brand').forEach(f => {
    copyIfExists(`public/brand/${f}`, `public/assets/echosoul/01-brand/${f}`);
  });
}

// 02-environments
copyIfExists('public/page2-clean.png', 'public/assets/echosoul/02-environments/sanctuary-night-window.png');
copyIfExists('public/page1-clean.png', 'public/assets/echosoul/02-environments/sanctuary-hero-ledge.png');
copyIfExists('public/about-backdrop.jpg', 'public/assets/echosoul/02-environments/sanctuary-about-twilight.jpg');

if (fs.existsSync('public/visual-worlds')) {
  fs.readdirSync('public/visual-worlds').forEach(f => {
    const cleanName = f.replace(/_/g, '-');
    copyIfExists(`public/visual-worlds/${f}`, `public/assets/echosoul/02-environments/${cleanName}`);
    copyIfExists(`public/visual-worlds/${f}`, `public/assets/echosoul/09-scenes/${cleanName}`);
  });
}

// 03-home
copyIfExists('public/page2-clean.png', 'public/assets/echosoul/03-home/home-sanctuary-living.png');
copyIfExists('public/page1-clean.png', 'public/assets/echosoul/03-home/home-hero-ledge.png');

// 04-auth
copyIfExists('public/page2-clean.png', 'public/assets/echosoul/04-auth/auth-sanctuary-night.png');

// 05-onboarding
copyIfExists('public/page2-clean.png', 'public/assets/echosoul/05-onboarding/onboarding-sanctuary-step1.png');
if (fs.existsSync('public/step6-portals')) {
  fs.readdirSync('public/step6-portals').forEach(f => {
    copyIfExists(`public/step6-portals/${f}`, `public/assets/echosoul/05-onboarding/${f}`);
  });
}

// 07-words
if (fs.existsSync('public/books')) {
  fs.readdirSync('public/books').forEach(f => {
    copyIfExists(`public/books/${f}`, `public/assets/echosoul/07-words/${f}`);
  });
}

// 15-icons
if (fs.existsSync('public/icons')) {
  fs.readdirSync('public/icons').forEach(f => {
    copyIfExists(`public/icons/${f}`, `public/assets/echosoul/15-icons/${f}`);
  });
}

// 17-ambient-motion
if (fs.existsSync('public/environment')) {
  fs.readdirSync('public/environment').forEach(f => {
    copyIfExists(`public/environment/${f}`, `public/assets/echosoul/17-ambient-motion/${f}`);
  });
}

// 16-textures: Create paper-texture and noise textures
const paperSvg = `<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
  <filter id="paperGrain">
    <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="5" result="noise"/>
    <feDiffuseLighting in="noise" lighting-color="#FFF8E1" surfaceScale="1.2">
      <feDistantLight azimuth="45" elevation="60"/>
    </feDiffuseLighting>
    <feBlend mode="multiply" in="SourceGraphic"/>
  </filter>
  <rect width="100%" height="100%" fill="#0C1620" filter="url(#paperGrain)" opacity="0.07"/>
</svg>`;
fs.writeFileSync('public/assets/echosoul/16-textures/paper-grain.svg', paperSvg);

const noiseSvg = `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <filter id="subtleNoise">
    <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/>
  </filter>
  <rect width="100%" height="100%" filter="url(#subtleNoise)" opacity="0.035"/>
</svg>`;
fs.writeFileSync('public/assets/echosoul/16-textures/subtle-noise.svg', noiseSvg);

// Build Manifest
const manifest = {
  project: "EchoSoul",
  version: "1.0.0",
  updatedAt: new Date().toISOString(),
  categories: {
    "01-brand": "Official wordmark, mark, emblem, crest",
    "02-environments": "16:9 full-screen 2560x1440 backdrops",
    "03-home": "Living sanctuary environment layers",
    "04-auth": "Auth sanctuary night artwork",
    "05-onboarding": "Step 1-6 environment cards & portals",
    "06-talk": "Intimate voice/conversation ambiance layers",
    "07-words": "Paper textures, parchment, book spine accents",
    "08-music": "Listening room vinyl/cassette/ambient lighting layers",
    "09-scenes": "12 visual scene master artworks",
    "10-journey": "Living path & chapter divider assets",
    "11-moments": "Memory polaroid & card textures",
    "12-journal": "Ruled paper, ink wash, bookmark ribbon SVGs",
    "13-guidance": "Quiet library & study lighting elements",
    "14-marketing": "Editorial showcase & feature hero banners",
    "15-icons": "EchoSoul bespoke SVG icon set",
    "16-textures": "Subtle noise, paper grain, canvas, vignetting",
    "17-ambient-motion": "Animated SVG clouds, mist, stars, candle glows",
    "18-generated-source": "Master high-res source files",
    "19-manifest": "Asset manifest index"
  },
  assets: []
};

function scanCategory(catDir) {
  const fullPath = path.join('public/assets/echosoul', catDir);
  if (!fs.existsSync(fullPath)) return;
  const files = fs.readdirSync(fullPath);
  files.forEach(f => {
    if (f === 'manifest.json') return;
    const filePath = path.join(fullPath, f);
    const stat = fs.statSync(filePath);
    if (!stat.isDirectory()) {
      manifest.assets.push({
        id: `${catDir}/${f}`,
        path: `/assets/echosoul/${catDir}/${f}`,
        category: catDir,
        filename: f,
        sizeBytes: stat.size,
        format: path.extname(f).slice(1),
        aspectRatio: f.endsWith('.jpg') || f.endsWith('.png') ? "16:9" : "scalable",
        resolution: f.endsWith('.jpg') || f.endsWith('.png') ? "1376x768 (2x ready)" : "vector",
        sourceType: "project_approved_asset"
      });
    }
  });
}

Object.keys(manifest.categories).forEach(scanCategory);

fs.writeFileSync(
  'public/assets/echosoul/19-manifest/manifest.json',
  JSON.stringify(manifest, null, 2)
);

console.log(`✅ Populated asset factory with ${manifest.assets.length} indexed assets.`);
console.log('✅ Wrote public/assets/echosoul/19-manifest/manifest.json');

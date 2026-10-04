const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const inputImg = 'C:/Users/win-10/.gemini/antigravity-ide/brain/cab32981-5497-4c7d-882d-6557cc8d8bd8/scratch/solid_transparent.png';
const outDir = 'c:/Users/win-10/Desktop/astroraj/public/images/logo';

async function buildSaffronLogo() {
  // 1. Extract emblem, then trim
  const emblemExtracted = await sharp(inputImg)
    .extract({ left: 390, top: 0, width: 300, height: 320 })
    .png()
    .toBuffer();
  const emblem = await sharp(emblemExtracted).trim().png().toBuffer();

  // 2. Extract text combined, then trim
  const textExtracted = await sharp(inputImg)
    .extract({ left: 90, top: 330, width: 890, height: 195 })
    .png()
    .toBuffer();
  const text = await sharp(textExtracted).trim().png().toBuffer();

  // Function to apply sacred saffron terracotta palette
  // Button: #d05e2d (R: 208, G: 94, B: 45)
  // Deep shadow: #99320e (R: 153, G: 50, B: 14)
  // Highlight: #e6682e (R: 230, G: 104, B: 46)
  async function applySaffronTone(buffer, shadowFactor = 1.0) {
    const { data, info } = await sharp(buffer).raw().toBuffer({ resolveWithObject: true });
    const w = info.width, h = info.height;
    const out = Buffer.alloc(w * h * 4);

    for (let i = 0; i < w * h; i++) {
      const r = data[i * 4];
      const g = data[i * 4 + 1];
      const b = data[i * 4 + 2];
      const a = data[i * 4 + 3];

      if (a === 0) continue;

      // Luminance
      const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

      // Map to rich saffron palette
      // High lum -> bright saffron #e6682e
      // Low lum -> deep burnt saffron #94300d
      const minR = 148 * shadowFactor;
      const maxR = 216;
      const minG = 48 * shadowFactor;
      const maxG = 96;
      const minB = 14 * shadowFactor;
      const maxB = 38;

      out[i * 4] = Math.min(255, Math.max(0, Math.round(minR + lum * (maxR - minR))));
      out[i * 4 + 1] = Math.min(255, Math.max(0, Math.round(minG + lum * (maxG - minG))));
      out[i * 4 + 2] = Math.min(255, Math.max(0, Math.round(minB + lum * (maxB - minB))));
      out[i * 4 + 3] = a;
    }

    return sharp(out, { raw: { width: w, height: h, channels: 4 } }).png().toBuffer();
  }

  const saffronEmblem = await applySaffronTone(emblem, 0.95);
  const saffronText = await applySaffronTone(text, 0.92);

  // Resize for composition
  const ePng = await sharp(saffronEmblem).resize({ height: 260 }).png().toBuffer();
  const eMeta = await sharp(ePng).metadata();

  const tPng = await sharp(saffronText).resize({ height: 165 }).png().toBuffer();
  const tMeta = await sharp(tPng).metadata();

  const gap = 34;
  const canvasW = eMeta.width + gap + tMeta.width + 24;
  const canvasH = Math.max(eMeta.height, tMeta.height) + 20;

  const eX = 12;
  const eY = Math.round((canvasH - eMeta.height) / 2);

  const tX = eX + eMeta.width + gap;
  const tY = Math.round((canvasH - tMeta.height) / 2);

  const finalSaffron = await sharp({
    create: {
      width: canvasW,
      height: canvasH,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  }).composite([
    { input: ePng, top: eY, left: eX },
    { input: tPng, top: tY, left: tX }
  ]).png().toBuffer();

  const trimmedFinal = await sharp(finalSaffron).trim().png().toBuffer();

  // Save to public/images/logo/logo-light.png and .webp
  await sharp(trimmedFinal).png().toFile(path.join(outDir, 'logo-light.png'));
  await sharp(trimmedFinal).webp({ quality: 95 }).toFile(path.join(outDir, 'logo-light.webp'));

  // Also save a preview next to the actual navbar button
  const scaledPreview = await sharp(trimmedFinal).resize({ height: 48 }).png().toBuffer();
  const btnBuffer = await sharp({
    create: {
      width: 170,
      height: 44,
      channels: 4,
      background: { r: 208, g: 94, b: 45, alpha: 1 } // #d05e2d
    }
  }).png().toBuffer();

  await sharp({
    create: {
      width: 640,
      height: 74,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    }
  }).composite([
    { input: scaledPreview, left: 16, top: 13 },
    { input: btnBuffer, left: 440, top: 15 }
  ]).png().toFile('C:/Users/win-10/.gemini/antigravity-ide/brain/cab32981-5497-4c7d-882d-6557cc8d8bd8/scratch/saffron_navbar_preview.png');

  console.log('Successfully built and saved saffron logo!');
}

buildSaffronLogo();

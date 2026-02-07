/**
 * Removes black border and dark background from moon image for dark-vibe blend.
 * Keeps the red moon, makes black ring and dark red bg transparent.
 * Usage: node scripts/process-moon.mjs
 */

import sharp from "sharp";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const assetsDir = path.join(__dirname, "..", "src", "assets");
const inputPath = path.join(assetsDir, "red-moon-source.png");
const outputPath = path.join(assetsDir, "red-moon.png");

// Black border: full transparent
const BLACK_THRESHOLD = 35;
// Dark area (dark red bg): start fading
const DARK_FADE_START = 80;
// Below this luminance, fully transparent
const DARK_FULL_TRANSPARENT = 55;

function luminance(r, g, b) {
  return (r + g + b) / 3;
}

async function main() {
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;

  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const L = luminance(r, g, b);

    if (L < DARK_FULL_TRANSPARENT || (r < BLACK_THRESHOLD && g < BLACK_THRESHOLD && b < BLACK_THRESHOLD)) {
      data[i + 3] = 0;
    } else if (L < DARK_FADE_START) {
      // Fade dark red background into transparent
      const t = (L - DARK_FULL_TRANSPARENT) / (DARK_FADE_START - DARK_FULL_TRANSPARENT);
      data[i + 3] = Math.round(255 * t * t);
    }
    // else keep existing alpha (moon stays opaque)
  }

  const tmpPath = outputPath + ".tmp.png";
  await sharp(data, { raw: { width, height, channels } })
    .png()
    .toFile(tmpPath);
  fs.renameSync(tmpPath, outputPath);
  console.log("Written:", outputPath);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

/**
 * Makes white / near-white background transparent in PNGs (sticker effect).
 * Usage: node scripts/remove-white-bg.mjs
 */

import sharp from "sharp";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const assetsDir = path.join(__dirname, "..", "src", "assets");

// Pixels with R,G,B all >= this value become transparent (0-255)
const WHITE_THRESHOLD = 248;

const files = ["character-left.png", "character-right.png"];

async function removeWhiteBg(inputPath, outputPath) {
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;

  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (r >= WHITE_THRESHOLD && g >= WHITE_THRESHOLD && b >= WHITE_THRESHOLD) {
      data[i + 3] = 0;
    }
  }

  const tmpPath = outputPath + ".tmp.png";
  await sharp(data, { raw: { width, height, channels } })
    .png()
    .toFile(tmpPath);
  fs.renameSync(tmpPath, outputPath);
  console.log("Written:", outputPath);
}

async function main() {
  for (const file of files) {
    const inputPath = path.join(assetsDir, file);
    await removeWhiteBg(inputPath, inputPath);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

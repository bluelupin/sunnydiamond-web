/**
 * One-off script: convert collection fallback PNGs to WebP.
 * Run: node scripts/convert-collection-images.mjs
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const dir = path.join(process.cwd(), "public/images/collection");
const files = [
  "hero-desktop.png",
  "hero-mobile.png",
  "product-showcase.png",
  "thumb-1.png",
  "thumb-2.png",
  "thumb-3.png",
  "thumb-4.png",
  "thumb-5.png",
];

for (const file of files) {
  const input = path.join(dir, file);
  if (!fs.existsSync(input)) {
    console.warn(`skip missing ${file}`);
    continue;
  }

  const output = input.replace(/\.png$/i, ".webp");
  await sharp(input)
    .webp({ quality: 90, effort: 4 })
    .toFile(output);

  const before = fs.statSync(input).size;
  const after = fs.statSync(output).size;
  console.log(`${file} → ${path.basename(output)} (${Math.round(before / 1024)}KB → ${Math.round(after / 1024)}KB)`);
}

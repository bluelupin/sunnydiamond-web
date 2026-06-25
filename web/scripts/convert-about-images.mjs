/**
 * One-off script: convert about page PNGs to WebP.
 * Run: node scripts/convert-about-images.mjs
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const dir = path.join(process.cwd(), "public/images/about");
const files = [
  "crafting-diamond.png",
  "handcrafted-bg.png",
  "craftsmanship-764d7a.png",
  "handcrafted-intersect.png",
];

for (const file of files) {
  const input = path.join(dir, file);
  if (!fs.existsSync(input)) {
    console.warn(`skip missing ${file}`);
    continue;
  }

  const output = input.replace(/\.png$/i, ".webp");
  await sharp(input)
    .webp({ quality: 82, effort: 4 })
    .toFile(output);

  const before = fs.statSync(input).size;
  const after = fs.statSync(output).size;
  console.log(
    `${file} → ${path.basename(output)} (${Math.round(before / 1024)}KB → ${Math.round(after / 1024)}KB)`,
  );
}

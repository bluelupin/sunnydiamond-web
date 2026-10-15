/**
 * Builds PWA / favicon PNGs from logo-mark.svg on a white rounded plate.
 * Run: node scripts/generate-brand-icons.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, "..", "public");
const markSvg = readFileSync(join(publicDir, "logo-mark.svg"), "utf8");
const markPaths = markSvg
  .replace(/fill="currentColor"/g, 'fill="#722257"')
  .replace(/fill="#0A0A0A"/g, 'fill="#722257"')
  .match(/<path[\s\S]*?\/>/g)
  ?.join("\n    ") ?? "";

function buildPwaIconSvg(size) {
  const pad = Math.round(size * 0.12);
  const plateSize = size - pad * 2;
  const radius = Math.round(plateSize * 0.22);
  const markScale = (plateSize * 0.72) / 62;
  const markOffset = pad + (plateSize - 62 * markScale) / 2;

  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect x="${pad}" y="${pad}" width="${plateSize}" height="${plateSize}" rx="${radius}" ry="${radius}" fill="#FFFFFF"/>
  <g transform="translate(${markOffset} ${markOffset}) scale(${markScale})">
    ${markPaths}
  </g>
</svg>`;
}

async function writePng(size, filename) {
  const svg = buildPwaIconSvg(size);
  const buffer = await sharp(Buffer.from(svg)).png().toBuffer();
  writeFileSync(join(publicDir, filename), buffer);
}

const outputs = [
  [512, "android-chrome-512x512.png"],
  [192, "android-chrome-192x192.png"],
  [180, "apple-touch-icon.png"],
  [32, "favicon-32x32.png"],
  [16, "favicon-16x16.png"],
];

for (const [size, name] of outputs) {
  await writePng(size, name);
  console.log("Wrote", name);
}

await writePng(32, "favicon.ico");
console.log("Wrote favicon.ico");
console.log("Done.");

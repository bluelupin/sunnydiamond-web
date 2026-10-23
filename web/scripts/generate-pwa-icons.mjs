/**
 * Regenerates PWA / favicon PNGs from public/pwa/sd-logo-mark.svg
 * (Figma: Logo_desktop 3 — Navigation header mark, Neutrals/600 #0A0A0A).
 * Run: npm run generate:pwa-icons
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.join(__dirname, "..");
const publicDir = path.join(webRoot, "public");
const pwaDir = path.join(publicDir, "pwa");
const markPath = path.join(pwaDir, "sd-logo-mark.svg");

/** Figma Neutrals/600 — black mark on white (Logo_desktop 3). */
const ICON_BLACK = "#0A0A0A";
const BACKGROUND = "#FFFFFF";

const LOGO_VIEW = 62;

/** Logo occupies this fraction of the canvas edge (512 baseline: 320px any, 256px maskable). */
const ANY_LOGO_FRACTION = 0.625;
const MASKABLE_LOGO_FRACTION = 0.5;

const MASTER_SIZE = 1024;

let logoPathsCache;

async function getLogoPaths() {
  if (logoPathsCache) return logoPathsCache;
  const svg = await fs.readFile(markPath, "utf8");
  const match = svg.match(/<g[^>]*>([\s\S]*)<\/g>/);
  if (!match) throw new Error("Could not parse logo paths from sd-logo-mark.svg");
  logoPathsCache = match[1];
  return logoPathsCache;
}

function buildIconSvg(canvasSize, logoFraction, fill) {
  const logoPx = Math.round(canvasSize * logoFraction);
  const scale = logoPx / LOGO_VIEW;
  const offset = (canvasSize - logoPx) / 2;
  const paths = logoPathsCache.replaceAll("#0A0A0A", fill).replaceAll("#0a0a0a", fill);
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${canvasSize}" height="${canvasSize}" viewBox="0 0 ${canvasSize} ${canvasSize}">
  <rect width="${canvasSize}" height="${canvasSize}" fill="${BACKGROUND}"/>
  <g transform="translate(${offset} ${offset}) scale(${scale})">${paths}</g>
</svg>`,
  );
}

async function writePng(canvasSize, logoFraction, fill, outPath, outputSize) {
  const svg = buildIconSvg(canvasSize, logoFraction, fill);
  await sharp(svg).resize(outputSize, outputSize).png().toFile(outPath);
  console.log(`Wrote ${path.relative(webRoot, outPath)}`);
}

await fs.access(markPath);
await getLogoPaths();

await writePng(
  MASTER_SIZE,
  ANY_LOGO_FRACTION,
  ICON_BLACK,
  path.join(pwaDir, "app-icon-master-1024x1024.png"),
  MASTER_SIZE,
);

await writePng(512, ANY_LOGO_FRACTION, ICON_BLACK, path.join(publicDir, "android-chrome-512x512.png"), 512);
await writePng(512, ANY_LOGO_FRACTION, ICON_BLACK, path.join(publicDir, "android-chrome-192x192.png"), 192);
await writePng(
  512,
  MASKABLE_LOGO_FRACTION,
  ICON_BLACK,
  path.join(pwaDir, "android-chrome-512x512-maskable.png"),
  512,
);
await writePng(
  512,
  MASKABLE_LOGO_FRACTION,
  ICON_BLACK,
  path.join(pwaDir, "android-chrome-192x192-maskable.png"),
  192,
);
await writePng(512, ANY_LOGO_FRACTION, ICON_BLACK, path.join(publicDir, "apple-touch-icon.png"), 180);
await writePng(512, ANY_LOGO_FRACTION, ICON_BLACK, path.join(publicDir, "favicon-32x32.png"), 32);
await writePng(512, ANY_LOGO_FRACTION, ICON_BLACK, path.join(publicDir, "favicon-16x16.png"), 16);

const faviconIco = await import("to-ico");
const favSvg = buildIconSvg(512, ANY_LOGO_FRACTION, ICON_BLACK);
const fav16 = await sharp(favSvg).resize(16, 16).png().toBuffer();
const fav32 = await sharp(favSvg).resize(32, 32).png().toBuffer();
await fs.writeFile(
  path.join(publicDir, "favicon.ico"),
  await faviconIco.default([fav16, fav32]),
);
console.log("Wrote public/favicon.ico");

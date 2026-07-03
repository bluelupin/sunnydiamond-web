/**
 * Extract Diamond Care icons from the icon-grid reference image.
 * Source: Figma export — 5 tips in 3+2 staggered layout (1024×568).
 */
import sharp from "sharp";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const source =
  process.argv[2] ??
  "C:/Users/Admin/.cursor/projects/d-bluelupin-sunnydiamond-web/assets/c__Users_Admin_AppData_Roaming_Cursor_User_workspaceStorage_4463874bbdddcf516a98d5809e4843ed_images_image-e6a963f9-027e-4724-98d7-93e3f3c648b9.png";
const outDir = path.join(root, "public/images/education");
const OUTPUT_SIZE = 160;

/** Icon-only search regions — labels excluded */
const icons = [
  ["care-icon-clean.png", { left: 40, top: 10, width: 300, height: 130 }],
  ["care-icon-gentle-solution.png", { left: 360, top: 10, width: 300, height: 130 }],
  ["care-icon-fine-detail.png", { left: 680, top: 10, width: 300, height: 130 }],
  ["care-icon-avoid-harsh.png", { left: 150, top: 250, width: 320, height: 130 }],
  ["care-icon-store.png", { left: 530, top: 250, width: 320, height: 130 }],
];

async function findDarkBBox(imagePath, region) {
  const { left, top, width, height } = region;
  const { data, info } = await sharp(imagePath)
    .extract({ left, top, width, height })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  let minX = width;
  let minY = height;
  let maxX = 0;
  let maxY = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * info.channels;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const a = data[idx + 3];

      if (a < 16) continue;
      if (r + g + b > 720) continue;

      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
  }

  if (minX > maxX) {
    throw new Error(`No dark pixels found in region ${JSON.stringify(region)}`);
  }

  return {
    left: left + minX,
    top: top + minY,
    width: maxX - minX + 1,
    height: maxY - minY + 1,
  };
}

function clampCrop(crop, imageWidth, imageHeight) {
  let { left, top, width, height } = crop;

  if (left < 0) left = 0;
  if (top < 0) top = 0;
  if (left + width > imageWidth) width = imageWidth - left;
  if (top + height > imageHeight) height = imageHeight - top;

  return { left, top, width, height };
}

function squareCropFromBBox(bbox, imageWidth, imageHeight, padding = 20) {
  const cx = bbox.left + bbox.width / 2;
  const cy = bbox.top + bbox.height / 2;
  const size = Math.max(bbox.width, bbox.height) + padding * 2;
  const half = Math.floor(size / 2);

  return clampCrop(
    {
      left: Math.round(cx - half),
      top: Math.round(cy - half),
      width: Math.round(size),
      height: Math.round(size),
    },
    imageWidth,
    imageHeight,
  );
}

const meta = await sharp(source).metadata();
const imageWidth = meta.width ?? 1024;
const imageHeight = meta.height ?? 568;

for (const [fileName, region] of icons) {
  const bbox = await findDarkBBox(source, region);
  const crop = squareCropFromBBox(bbox, imageWidth, imageHeight, 24);
  console.log(fileName, "bbox", bbox, "crop", crop);

  await sharp(source)
    .extract(crop)
    .resize(OUTPUT_SIZE, OUTPUT_SIZE, {
      fit: "contain",
      background: { r: 255, g: 255, b: 255, alpha: 0 },
    })
    .png()
    .toFile(path.join(outDir, fileName));
}

console.log("Done.");

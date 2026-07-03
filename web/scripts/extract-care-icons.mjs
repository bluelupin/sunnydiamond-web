/**
 * Extracts DIAMOND CARE tab icons from the Figma reference screenshot.
 * Source: user-provided care tab reference (1024×619).
 */
import sharp from "sharp";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const source =
  process.argv[2] ??
  "C:/Users/Admin/.cursor/projects/d-bluelupin-sunnydiamond-web/assets/c__Users_Admin_AppData_Roaming_Cursor_User_workspaceStorage_4463874bbdddcf516a98d5809e4843ed_images_image-1388115c-3511-44e2-9b63-b03fe80d6725.png";
const outDir = path.join(root, "public/images/education");

/** [left, top, width, height] tuned to 1024×619 care tab reference */
const crops = [
  ["care-icon-clean.png", 118, 248, 96, 96],
  ["care-icon-gentle-solution.png", 464, 248, 96, 96],
  ["care-icon-fine-detail.png", 810, 248, 96, 96],
  ["care-icon-avoid-harsh.png", 291, 430, 96, 96],
  ["care-icon-store.png", 637, 430, 96, 96],
];

for (const [fileName, left, top, width, height] of crops) {
  await sharp(source)
    .extract({ left, top, width, height })
    .trim({ threshold: 12 })
    .extend({
      top: 8,
      bottom: 8,
      left: 8,
      right: 8,
      background: { r: 255, g: 255, b: 255, alpha: 0 },
    })
    .png()
    .toFile(path.join(outDir, fileName));
  console.log("wrote", fileName);
}

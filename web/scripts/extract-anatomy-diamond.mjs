/**
 * Extracts face-up diamond from DIAMOND ANATOMY tab reference (1024×502).
 */
import sharp from "sharp";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const source =
  process.argv[2] ??
  "C:/Users/Admin/.cursor/projects/d-bluelupin-sunnydiamond-web/assets/c__Users_Admin_AppData_Roaming_Cursor_User_workspaceStorage_4463874bbdddcf516a98d5809e4843ed_images_image-fe7b9cdc-94ee-4cc3-822c-22f624258827.png";
const outPath = path.join(root, "public/images/education/anatomy-face-up.png");

await sharp(source)
  .extract({ left: 50, top: 170, width: 330, height: 290 })
  .trim({ threshold: 10 })
  .png()
  .toFile(outPath);

console.log("wrote anatomy-face-up.png");

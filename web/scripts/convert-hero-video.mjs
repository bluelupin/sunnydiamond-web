/**
 * One-off script: convert hero MP4 to WebM (VP9) for smaller desktop delivery.
 * Requires ffmpeg on PATH.
 *
 * Run: node scripts/convert-hero-video.mjs
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const input = path.join(process.cwd(), "public/videos/hero-banner-video.mp4");
const output = path.join(process.cwd(), "public/videos/hero-banner-video.webm");

if (!fs.existsSync(input)) {
  console.error(`Missing input: ${input}`);
  process.exit(1);
}

const ffmpeg = spawnSync(
  "ffmpeg",
  [
    "-y",
    "-i",
    input,
    "-c:v",
    "libvpx-vp9",
    "-crf",
    "35",
    "-b:v",
    "0",
    "-an",
    output,
  ],
  { stdio: "inherit" },
);

if (ffmpeg.error?.code === "ENOENT") {
  console.error("ffmpeg not found. Install ffmpeg, then re-run this script.");
  process.exit(1);
}

if (ffmpeg.status !== 0) {
  process.exit(ffmpeg.status ?? 1);
}

const before = fs.statSync(input).size;
const after = fs.statSync(output).size;
console.log(
  `hero-banner-video.webm created (${Math.round(before / 1024 / 1024)}MB → ${Math.round(after / 1024 / 1024)}MB)`,
);

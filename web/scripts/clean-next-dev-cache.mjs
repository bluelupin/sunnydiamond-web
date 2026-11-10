import { existsSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const webRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/** Remove entire dev output — Turbopack FS cache can panic until this is cleared. */
const targets = [
  path.join(webRoot, ".next", "dev"),
  path.join(webRoot, ".next", "cache"),
];

for (const target of targets) {
  if (!existsSync(target)) continue;

  try {
    rmSync(target, { recursive: true, force: true, maxRetries: 5, retryDelay: 250 });
    console.log(`[clean-next-dev-cache] removed ${path.relative(webRoot, target)}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[clean-next-dev-cache] Could not remove ${target}: ${message}`);
    console.warn("Stop `npm run dev`, close the browser tab, then delete .next\\dev manually.");
  }
}

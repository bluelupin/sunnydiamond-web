import { existsSync, rmSync } from "node:fs";

const targets = [".next/dev/node_modules", ".next/dev/types"];

for (const target of targets) {
  if (!existsSync(target)) continue;

  try {
    rmSync(target, { recursive: true, force: true, maxRetries: 3, retryDelay: 100 });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[clean-next-dev-cache] Could not remove ${target}: ${message}`);
  }
}

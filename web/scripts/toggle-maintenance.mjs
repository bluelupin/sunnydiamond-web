#!/usr/bin/env node
/**
 * Toggle runtime maintenance flag file on the server (see docs/deployment/forge-staging.md).
 *
 *   node scripts/toggle-maintenance.mjs on
 *   node scripts/toggle-maintenance.mjs off
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const FLAG = ".maintenance";
const webRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const flagPath = path.join(webRoot, FLAG);
const mode = (process.argv[2] ?? "").trim().toLowerCase();

if (mode !== "on" && mode !== "off") {
  console.error("Usage: node scripts/toggle-maintenance.mjs <on|off>");
  process.exit(1);
}

if (mode === "on") {
  await fs.writeFile(flagPath, `${new Date().toISOString()}\n`, "utf8");
  console.log(`Maintenance enabled (${FLAG} created).`);
  console.log("Reload the Node process (e.g. pm2 reload all --update-env) so traffic switches immediately.");
} else {
  try {
    await fs.unlink(flagPath);
      console.log(`Maintenance disabled (${FLAG} removed).`);
      console.log("Reload the Node process (e.g. pm2 reload all --update-env) when deploy is complete.");
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
      console.log(`Maintenance already off (${FLAG} not present).`);
    } else {
      throw error;
    }
  }
}

/**
 * Always start dev with Webpack. Next 16 defaults to Turbopack, which can panic
 * (turbo-tasks-backend cache) on this repo — especially after next.config hot restarts.
 */
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const webRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const nextBin = path.join(webRoot, "node_modules", "next", "dist", "bin", "next");

const nextArgs = ["dev", "--webpack", ...process.argv.slice(2)];

console.log("[dev] Using Webpack (not Turbopack). Stop the server before editing next.config.ts.\n");

const child = spawn(process.execPath, [nextBin, ...nextArgs], {
  cwd: webRoot,
  stdio: "inherit",
  env: process.env,
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 0);
});

import fs from "fs/promises";
import path from "path";
import { isMaintenanceModeEnabledByEnv } from "@/shared/lib/maintenanceModeEnv";

/** Runtime flag file — touch/remove on the server during deploy (see docs/deployment/forge-staging.md). */
export const MAINTENANCE_FLAG_FILE = ".maintenance";

export { isMaintenanceModeEnabledByEnv };

export async function isMaintenanceFlagFilePresent(
  cwd: string = process.cwd(),
): Promise<boolean> {
  try {
    await fs.access(path.join(cwd, MAINTENANCE_FLAG_FILE));
    return true;
  } catch {
    return false;
  }
}

export async function resolveMaintenanceModeEnabled(
  cwd: string = process.cwd(),
): Promise<boolean> {
  if (isMaintenanceModeEnabledByEnv()) {
    return true;
  }

  return isMaintenanceFlagFilePresent(cwd);
}

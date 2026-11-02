import type { NextRequest } from "next/server";

/** Set by Forge/Nginx when `web/.maintenance` exists (see forge-nginx-maintenance.conf.example). */
export function isMaintenanceModeEnabledByRequestHeader(request: NextRequest): boolean {
  const value = request.headers.get("x-sunny-maintenance")?.trim().toLowerCase();
  return value === "1" || value === "true" || value === "yes";
}

/** Staging/QA: prefer maintenance over a half-deployed UI when status cannot be read. */
export function shouldFailClosedOnMaintenanceStatusError(): boolean {
  if (process.env.MAINTENANCE_FAIL_CLOSED === "true") {
    return true;
  }

  const appEnv = process.env.NEXT_PUBLIC_APP_ENV?.trim().toLowerCase();
  return appEnv === "qa" || appEnv === "staging";
}

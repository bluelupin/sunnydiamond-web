import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isMaintenanceModeEnabledByEnv } from "@/shared/lib/maintenanceModeEnv";
import {
  isMaintenanceModeEnabledByRequestHeader,
  shouldFailClosedOnMaintenanceStatusError,
} from "@/shared/lib/maintenanceModeRequest";

const MAINTENANCE_STATUS_PATH = "/api/maintenance/status";
const MAINTENANCE_PAGE_PATH = "/maintenance.html";

const maintenanceStatusCache = {
  value: false,
  checkedAt: 0,
};

const MAINTENANCE_STATUS_CACHE_MS = 500;

function isMaintenanceBypassPath(pathname: string): boolean {
  return (
    pathname === MAINTENANCE_PAGE_PATH ||
    pathname.startsWith("/api/maintenance/")
  );
}

async function isMaintenanceActive(request: NextRequest): Promise<boolean> {
  if (isMaintenanceModeEnabledByRequestHeader(request)) {
    return true;
  }

  if (isMaintenanceModeEnabledByEnv()) {
    return true;
  }

  const now = Date.now();
  if (now - maintenanceStatusCache.checkedAt < MAINTENANCE_STATUS_CACHE_MS) {
    return maintenanceStatusCache.value;
  }

  try {
    const statusUrl = new URL(MAINTENANCE_STATUS_PATH, request.url);
    const response = await fetch(statusUrl, {
      cache: "no-store",
      headers: { accept: "application/json" },
    });

    if (!response.ok) {
      const failClosed = shouldFailClosedOnMaintenanceStatusError();
      maintenanceStatusCache.checkedAt = now;
      maintenanceStatusCache.value = failClosed;
      return failClosed;
    }

    const payload = (await response.json()) as { maintenance?: boolean };
    const active = Boolean(payload.maintenance);
    maintenanceStatusCache.value = active;
    maintenanceStatusCache.checkedAt = now;
    return active;
  } catch {
    const failClosed = shouldFailClosedOnMaintenanceStatusError();
    maintenanceStatusCache.checkedAt = now;
    maintenanceStatusCache.value = failClosed;
    return failClosed;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isMaintenanceBypassPath(pathname)) {
    return NextResponse.next();
  }

  if (!(await isMaintenanceActive(request))) {
    return NextResponse.next();
  }

  const rewriteUrl = request.nextUrl.clone();
  rewriteUrl.pathname = MAINTENANCE_PAGE_PATH;

  const response = NextResponse.rewrite(rewriteUrl);
  response.headers.set("Cache-Control", "no-store, max-age=0");
  response.headers.set("Retry-After", "30");
  return response;
}

export const config = {
  matcher: [
    /*
     * All routes including /_next/* so users never load a mix of old and new chunks mid-deploy.
     * Excludes maintenance.html and maintenance status API (see isMaintenanceBypassPath).
     */
    "/((?!maintenance\\.html|api/maintenance).*)",
  ],
};

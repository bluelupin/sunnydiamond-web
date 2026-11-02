import { NextResponse } from "next/server";
import { resolveMaintenanceModeEnabled } from "@/shared/lib/maintenanceMode";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** Used by maintenance.html polling and ops checks during deploy. */
export async function GET() {
  const maintenance = await resolveMaintenanceModeEnabled();

  return NextResponse.json(
    { maintenance },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    },
  );
}

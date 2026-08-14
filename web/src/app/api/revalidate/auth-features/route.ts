import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { AUTH_FEATURES_CACHE_TAG } from "@/features/auth/services/authFeatures.server";

export const runtime = "nodejs";

const bearerToken = (request: NextRequest) => {
  const authorization = request.headers.get("authorization") || "";
  const [scheme, token] = authorization.split(" ");

  return scheme?.toLowerCase() === "bearer" ? token : undefined;
};

const hasValidSecret = (request: NextRequest) => {
  const secret = process.env.REVALIDATE_SECRET || process.env.FRONTEND_REVALIDATE_SECRET;
  if (!secret) return false;

  // Header transports only — a ?secret= query param would land in access logs.
  return (
    bearerToken(request) === secret ||
    request.headers.get("x-revalidate-secret") === secret
  );
};

export async function POST(request: NextRequest) {
  if (!hasValidSecret(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Webhook caller needs the flag flip on the very next request, not stale-while-revalidate.
  revalidateTag(AUTH_FEATURES_CACHE_TAG, { expire: 0 });

  return NextResponse.json({ revalidated: true });
}

import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

type RevalidationPayload = {
  source?: unknown;
  uid?: unknown;
  action?: unknown;
  paths?: unknown;
  tags?: unknown;
};

const uniqueStrings = (value: unknown) => {
  if (!Array.isArray(value)) return [];

  return Array.from(
    new Set(value.filter((item): item is string => typeof item === "string" && item.trim().length > 0).map((item) => item.trim()))
  );
};

const bearerToken = (request: NextRequest) => {
  const authorization = request.headers.get("authorization") || "";
  const [scheme, token] = authorization.split(" ");

  return scheme?.toLowerCase() === "bearer" ? token : undefined;
};

const hasValidSecret = (request: NextRequest) => {
  const secret = process.env.REVALIDATE_SECRET || process.env.FRONTEND_REVALIDATE_SECRET;
  if (!secret) return false;

  return (
    bearerToken(request) === secret ||
    request.headers.get("x-revalidate-secret") === secret ||
    request.nextUrl.searchParams.get("secret") === secret
  );
};

export async function POST(request: NextRequest) {
  if (!hasValidSecret(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload: RevalidationPayload;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const paths = uniqueStrings(payload.paths).filter((path) => path.startsWith("/"));
  const tags = uniqueStrings(payload.tags);

  if (paths.length === 0 && tags.length === 0) {
    return NextResponse.json({ error: "No paths or tags provided" }, { status: 400 });
  }

  for (const tag of tags) {
    revalidateTag(tag, "max");
  }

  for (const path of paths) {
    revalidatePath(path);
  }

  return NextResponse.json({
    revalidated: true,
    uid: payload.uid,
    action: payload.action,
    paths,
    tags,
    now: new Date().toISOString(),
  });
}


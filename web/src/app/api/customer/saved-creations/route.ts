import { NextResponse } from "next/server";
import { getCustomerTokenFromRequest } from "@/services/auth/session";
import {
  CustomerSavedCreationsApiError,
  fetchCustomerSavedCreations,
  saveCustomerCreation,
} from "@/services/customer/customer-saved-creations.service";

function mapApiStatus(status: number): number {
  if (
    status === 401 ||
    status === 403 ||
    status === 404 ||
    status === 400 ||
    status === 503
  ) {
    return status;
  }
  if (status >= 500) return 502;
  return 500;
}

export async function GET(request: Request) {
  const token = await getCustomerTokenFromRequest(request);

  if (!token) {
    return NextResponse.json(
      { error: "Unauthorized", reason: "no_session" },
      { status: 401 },
    );
  }

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get("page") ?? "1") || 1);
  const pageSize = Math.min(100, Math.max(1, Number(searchParams.get("pageSize") ?? "20") || 20));

  try {
    const creations = await fetchCustomerSavedCreations(token, page, pageSize);
    return NextResponse.json(creations);
  } catch (error) {
    if (error instanceof CustomerSavedCreationsApiError) {
      return NextResponse.json(
        { error: error.message, reason: "upstream" },
        { status: mapApiStatus(error.status) },
      );
    }

    const message = error instanceof Error ? error.message : "Failed to load saved creations";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const token = await getCustomerTokenFromRequest(request);

  if (!token) {
    return NextResponse.json(
      { error: "Unauthorized", reason: "no_session" },
      { status: 401 },
    );
  }

  let body: { creationDocumentId?: unknown };

  try {
    body = (await request.json()) as { creationDocumentId?: unknown };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const creationDocumentId =
    typeof body.creationDocumentId === "string" ? body.creationDocumentId.trim() : "";

  if (!creationDocumentId) {
    return NextResponse.json({ error: "Missing creationDocumentId" }, { status: 400 });
  }

  try {
    const result = await saveCustomerCreation(token, creationDocumentId);
    return NextResponse.json(result, { status: result.alreadySaved ? 200 : 201 });
  } catch (error) {
    if (error instanceof CustomerSavedCreationsApiError) {
      return NextResponse.json(
        { error: error.message, reason: "upstream" },
        { status: mapApiStatus(error.status) },
      );
    }

    const message = error instanceof Error ? error.message : "Failed to save creation";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

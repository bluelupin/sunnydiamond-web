import { NextResponse } from "next/server";
import { getCustomerToken } from "@/services/auth/session";
import {
  CustomerSavedCreationsApiError,
  deleteCustomerSavedCreation,
} from "@/services/customer/customer-saved-creations.service";

type RouteContext = {
  params: Promise<{ documentId: string }>;
};

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

export async function DELETE(_request: Request, context: RouteContext) {
  const token = await getCustomerToken();

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { documentId } = await context.params;
  const id = documentId.trim();

  if (!id) {
    return NextResponse.json({ error: "Missing documentId" }, { status: 400 });
  }

  try {
    await deleteCustomerSavedCreation(token, id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof CustomerSavedCreationsApiError) {
      return NextResponse.json({ error: error.message }, { status: mapApiStatus(error.status) });
    }

    const message = error instanceof Error ? error.message : "Failed to remove saved inspiration";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

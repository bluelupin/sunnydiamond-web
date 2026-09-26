import { NextResponse } from "next/server";
import { getSessionMagentoCustomerId } from "@/services/auth/getSessionMagentoCustomerId";
import {
  CustomerAppointmentsApiError,
  addPieceToCustomerAppointment,
} from "@/services/customer/customer-appointments.service";
import type { AddPieceToCustomerAppointmentInput } from "@/services/customer/customer-appointments.types";

type RouteContext = {
  params: Promise<{ documentId: string }>;
};

type AddPieceBody = {
  productId?: unknown;
  productName?: unknown;
  productPath?: unknown;
};

const MAX_FIELD_LENGTH = 200;

function mapApiStatus(status: number): number {
  if (
    status === 401 ||
    status === 403 ||
    status === 404 ||
    status === 400 ||
    status === 409 ||
    status === 429 ||
    status === 503
  ) {
    return status;
  }
  if (status >= 500) return 502;
  return 500;
}

function cleanField(value: unknown): string {
  const text = typeof value === "string" ? value.trim() : "";
  return text.length <= MAX_FIELD_LENGTH ? text : "";
}

function toAddPieceInput(body: AddPieceBody): AddPieceToCustomerAppointmentInput | null {
  const productId = cleanField(body.productId);
  const productName = cleanField(body.productName);
  const productPath = cleanField(body.productPath);

  // Site-relative only: "//host" would be protocol-relative once the CMS prefixes the storefront URL.
  if (!productId || !productName || !productPath.startsWith("/") || productPath.startsWith("//")) {
    return null;
  }

  return { productId, productName, productPath };
}

/**
 * POST /api/customer/appointments/:documentId/pieces
 * Body: productId (SKU), productName, productPath. BFF injects trusted magentoCustomerId.
 */
export async function POST(request: Request, context: RouteContext) {
  const magentoCustomerId = await getSessionMagentoCustomerId(request);

  if (magentoCustomerId == null) {
    return NextResponse.json(
      { error: "Unauthorized", reason: "no_session" },
      { status: 401 },
    );
  }

  const { documentId } = await context.params;
  const id = documentId.trim();

  if (!id) {
    return NextResponse.json({ error: "Missing documentId" }, { status: 400 });
  }

  let body: AddPieceBody;

  try {
    body = (await request.json()) as AddPieceBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const input = body && typeof body === "object" ? toAddPieceInput(body) : null;
  if (!input) {
    return NextResponse.json({ error: "Invalid product details" }, { status: 400 });
  }

  try {
    const result = await addPieceToCustomerAppointment(magentoCustomerId, id, input);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof CustomerAppointmentsApiError) {
      return NextResponse.json(
        { error: error.message },
        { status: mapApiStatus(error.status) },
      );
    }

    const message =
      error instanceof Error ? error.message : "Failed to add piece to appointment";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

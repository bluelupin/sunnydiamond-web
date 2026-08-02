import { NextResponse } from "next/server";
import { getCustomerToken } from "@/services/auth/session";
import { cancelCustomerOrder } from "@/services/customer/order-actions.service";
import {
  OrderActionError,
  type OrderActionErrorCode,
  type OrderActionPayload,
} from "@/services/customer/order-actions.types";
import { fetchCustomerOrderByNumber } from "@/services/customer/order-tracking.service";

type RouteContext = {
  params: Promise<{ number: string }>;
};

/** Cancellation is already settled server-side — the client refreshes and moves on. */
const CONFLICT_CODES: OrderActionErrorCode[] = ["ALREADY_CANCELLED", "NOT_CANCELLABLE"];

export async function POST(request: Request, context: RouteContext) {
  const token = await getCustomerToken();

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { number } = await context.params;

  let payload: Partial<OrderActionPayload>;

  try {
    payload = (await request.json()) as Partial<OrderActionPayload>;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const orderId = payload.orderId?.trim();
  const reason = payload.reason?.trim();
  const comment = payload.comment?.trim();

  if (!orderId || !reason) {
    return NextResponse.json(
      { error: "Order and cancellation reason are required." },
      { status: 400 },
    );
  }

  try {
    const result = await cancelCustomerOrder(token, { orderId, reason, comment });
    return NextResponse.json({ order: result.order });
  } catch (error) {
    if (error instanceof OrderActionError) {
      if (error.code === "COMMENT_REQUIRED") {
        return NextResponse.json({ error: error.message, code: error.code }, { status: 400 });
      }

      if (CONFLICT_CODES.includes(error.code)) {
        const order = await fetchCustomerOrderByNumber(token, number).catch(() => null);
        return NextResponse.json(
          { error: error.message, code: error.code, order },
          { status: 409 },
        );
      }
    }

    const message = error instanceof Error ? error.message : "Failed to cancel order";
    return NextResponse.json({ error: message, code: "UNKNOWN" }, { status: 500 });
  }
}

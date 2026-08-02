import { NextResponse } from "next/server";
import { getCustomerToken } from "@/services/auth/session";
import { fetchOrderInvoiceUrl } from "@/services/customer/order-actions.service";
import { fetchCustomerOrderByNumber } from "@/services/customer/order-tracking.service";

type RouteContext = {
  params: Promise<{ number: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const token = await getCustomerToken();

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { number } = await context.params;

  try {
    // Resolves the order uid and proves ownership: the query only sees this customer's orders.
    const order = await fetchCustomerOrderByNumber(token, number);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const invoice = await fetchOrderInvoiceUrl(token, order.id);

    if (!invoice) {
      return NextResponse.json(
        { error: "Invoice is not available for this order yet." },
        { status: 404 },
      );
    }

    // Short-lived pre-signed S3 URL — never logged, never cached.
    return NextResponse.redirect(invoice.url, 302);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load invoice";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

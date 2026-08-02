import { NextResponse } from "next/server";
import { getCustomerToken } from "@/services/auth/session";
import {
  fetchCustomerOrderByNumber,
  fetchGuestOrder,
} from "@/services/customer/order-tracking.service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const number = searchParams.get("number")?.trim();

  if (!number) {
    return NextResponse.json({ error: "Order number is required" }, { status: 400 });
  }

  const token = await getCustomerToken();

  try {
    if (token) {
      const order = await fetchCustomerOrderByNumber(token, number);

      if (order) {
        return NextResponse.json({ order });
      }
    }

    const email = searchParams.get("email")?.trim();
    const lastname = searchParams.get("lastname")?.trim();

    if (!email || !lastname) {
      const message = token
        ? "Order not found in your account. Provide the email and last name used at checkout."
        : "Email and last name are required to track this order.";

      return NextResponse.json({ error: message }, { status: 404 });
    }

    const guestOrder = await fetchGuestOrder({ number, email, lastname });

    if (!guestOrder) {
      return NextResponse.json({ error: "No order found with those details." }, { status: 404 });
    }

    return NextResponse.json({ order: guestOrder });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to track order";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

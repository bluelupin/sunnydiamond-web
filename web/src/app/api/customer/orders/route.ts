import { NextResponse } from "next/server";
import { getCustomerToken } from "@/services/auth/session";
import { fetchCustomerOrders } from "@/services/customer/customer-account.service";

export async function GET(request: Request) {
  const token = await getCustomerToken();

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const currentPage = Math.max(1, Number(searchParams.get("page") ?? "1") || 1);
  const pageSize = Math.min(20, Math.max(1, Number(searchParams.get("pageSize") ?? "10") || 10));

  try {
    const orders = await fetchCustomerOrders(token, currentPage, pageSize);
    return NextResponse.json(orders);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load orders";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

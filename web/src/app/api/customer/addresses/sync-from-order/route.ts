import { NextResponse } from "next/server";
import { getCustomerToken } from "@/services/auth/session";
import { syncCustomerAddressFromLatestOrder } from "@/services/customer/customer-account.service";

export async function POST() {
  const token = await getCustomerToken();

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const addresses = await syncCustomerAddressFromLatestOrder(token);
    return NextResponse.json({ addresses });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to sync address from order";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

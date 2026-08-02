import { NextResponse } from "next/server";
import { fetchOrderActionReasons } from "@/services/customer/order-actions.service";

/** Reason lists come from admin config — hourly refresh is plenty. */
export const revalidate = 3600;

export async function GET() {
  try {
    return NextResponse.json(await fetchOrderActionReasons());
  } catch {
    // Module not deployed yet or Magento down — the client falls back to bundled copy.
    return NextResponse.json({ cancelReasons: [], returnReasons: [] });
  }
}

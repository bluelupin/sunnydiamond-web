import { NextResponse } from "next/server";
import { fetchOrderActionReasons } from "@/services/customer/order-actions.service";

/** Reason lists come from admin config. TEMP: caching off while reasons are updated in Magento — restore 3600 before go-live. */
export const revalidate = 0;

export async function GET() {
  try {
    return NextResponse.json(await fetchOrderActionReasons());
  } catch {
    // Module not deployed yet or Magento down — the client falls back to bundled copy.
    return NextResponse.json({ cancelReasons: [], returnReasons: [] });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getCustomerToken } from "@/services/auth/session";
import { syncCustomerWishlist } from "@/services/customer/customer-wishlist.service";

type SyncWishlistBody = {
  skus?: string[];
};

export async function POST(request: NextRequest) {
  const token = await getCustomerToken();

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: SyncWishlistBody;

  try {
    body = (await request.json()) as SyncWishlistBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const skus = Array.isArray(body.skus)
    ? body.skus.filter((sku): sku is string => typeof sku === "string")
    : [];

  try {
    const wishlist = await syncCustomerWishlist(token, skus);
    return NextResponse.json(wishlist);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to sync wishlist";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

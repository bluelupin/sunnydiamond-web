import { NextRequest, NextResponse } from "next/server";
import { getCustomerToken } from "@/services/auth/session";
import {
  addSkusToCustomerWishlist,
  fetchCustomerWishlist,
  removeSkuFromCustomerWishlist,
} from "@/services/customer/customer-wishlist.service";

export async function GET() {
  const token = await getCustomerToken();

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const wishlist = await fetchCustomerWishlist(token);
    return NextResponse.json(wishlist);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load wishlist";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

type WishlistSkuBody = {
  sku?: string;
};

export async function POST(request: NextRequest) {
  const token = await getCustomerToken();

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: WishlistSkuBody;

  try {
    body = (await request.json()) as WishlistSkuBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const sku = body.sku?.trim();
  if (!sku) {
    return NextResponse.json({ error: "SKU is required" }, { status: 400 });
  }

  try {
    const wishlist = await addSkusToCustomerWishlist(token, [sku]);
    return NextResponse.json(wishlist);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to add wishlist item";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const token = await getCustomerToken();

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: WishlistSkuBody;

  try {
    body = (await request.json()) as WishlistSkuBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const sku = body.sku?.trim();
  if (!sku) {
    return NextResponse.json({ error: "SKU is required" }, { status: 400 });
  }

  try {
    const wishlist = await removeSkuFromCustomerWishlist(token, sku);
    return NextResponse.json(wishlist);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to remove wishlist item";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

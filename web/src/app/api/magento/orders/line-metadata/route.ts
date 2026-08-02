import { NextRequest, NextResponse } from "next/server";
import type { CartLineItem } from "@/features/cart/types/cart.types";
import { attachLineMetadataToMagentoOrder } from "@/services/magento/orders/orderLineMetadata.service";

type AttachLineMetadataBody = {
  orderNumber?: string;
  items?: CartLineItem[];
};

export async function POST(request: NextRequest) {
  let body: AttachLineMetadataBody;

  try {
    body = (await request.json()) as AttachLineMetadataBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const orderNumber = body.orderNumber?.trim();
  const items = body.items ?? [];

  if (!orderNumber) {
    return NextResponse.json({ error: "Missing order number" }, { status: 400 });
  }

  if (items.length === 0) {
    return NextResponse.json({ attached: false, reason: "no_items" });
  }

  try {
    const attached = await attachLineMetadataToMagentoOrder(orderNumber, items);

    return NextResponse.json({
      attached,
      reason: attached ? "comment_added" : "integration_token_or_order_not_found",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to attach line metadata";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

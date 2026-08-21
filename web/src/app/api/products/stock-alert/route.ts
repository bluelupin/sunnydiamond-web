import { NextRequest, NextResponse } from "next/server";
import { getCustomerToken } from "@/services/auth/session";
import { subscribeCustomerToStockAlert } from "@/services/customer/stock-alert.service";
import { isMagentoStockAlertEnabled } from "@/services/magento/config";

type StockAlertBody = {
  sku?: string;
};

const UNAVAILABLE_MESSAGE = "Stock alerts are not available right now";

export async function POST(request: NextRequest) {
  // Deploy gate first: until SunnyDiamonds_TransactionalEmail is live in Magento
  // the mutation does not exist, so answer 503 without touching the backend.
  if (!isMagentoStockAlertEnabled()) {
    return NextResponse.json({ error: UNAVAILABLE_MESSAGE }, { status: 503 });
  }

  const token = await getCustomerToken();

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: StockAlertBody;

  try {
    body = (await request.json()) as StockAlertBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const sku = body.sku?.trim();
  if (!sku) {
    return NextResponse.json({ error: "SKU is required" }, { status: 400 });
  }

  const outcome = await subscribeCustomerToStockAlert(token, sku);

  switch (outcome.kind) {
    case "subscribed":
      // Already-subscribed is success to the shopper; the flag is only informational.
      return NextResponse.json({ success: true, alreadySubscribed: outcome.alreadySubscribed });
    case "unauthorized":
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    case "unavailable":
      return NextResponse.json({ error: UNAVAILABLE_MESSAGE }, { status: 503 });
    case "error":
      return NextResponse.json({ error: outcome.message }, { status: 500 });
  }
}

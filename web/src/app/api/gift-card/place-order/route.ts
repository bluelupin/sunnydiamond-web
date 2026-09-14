import { NextResponse } from "next/server";
import type { GiftCardOrderPayload } from "@/features/gift-card/services/giftCardOrder.types";
import { placeGiftCardMagentoOrder } from "@/services/gift-card/giftCardMagentoOrder.service";

export async function POST(request: Request) {
  let payload: GiftCardOrderPayload;

  try {
    payload = (await request.json()) as GiftCardOrderPayload;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!payload?.amount || payload.amount <= 0) {
    return NextResponse.json({ error: "Gift card amount is required" }, { status: 400 });
  }

  if (!payload.sender?.fullName?.trim() || !payload.sender.phone?.trim()) {
    return NextResponse.json({ error: "Sender details are required" }, { status: 400 });
  }

  const receiver = payload.receiverSameAsSender ? payload.sender : payload.receiver;
  if (!receiver?.fullName?.trim() || !receiver.phone?.trim()) {
    return NextResponse.json({ error: "Receiver details are required" }, { status: 400 });
  }

  if (payload.cardType === "physical") {
    const address = payload.deliveryAddress;
    if (
      !address?.addressLine1?.trim() ||
      !address.pincode?.trim() ||
      !address.city?.trim() ||
      !address.state?.trim()
    ) {
      return NextResponse.json({ error: "Delivery address is required" }, { status: 400 });
    }
  }

  try {
    const order = await placeGiftCardMagentoOrder(payload);
    return NextResponse.json(order);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to place the gift card order";

    return NextResponse.json({ error: message }, { status: 502 });
  }
}

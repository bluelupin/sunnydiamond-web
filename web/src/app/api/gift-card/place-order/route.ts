import { NextResponse } from "next/server";
import type { GiftCardOrderPayload } from "@/features/gift-card/services/giftCardOrder.types";
import { placeGiftCardMagentoOrder } from "@/services/gift-card/giftCardMagentoOrder.service";
import { giftCardFlowContent } from "@/features/gift-card/data/content";
import { MagentoGraphqlError } from "@/services/magento/magento.errors";

const { min: MIN_AMOUNT, max: MAX_AMOUNT } = giftCardFlowContent.amount;

export async function POST(request: Request) {
  let payload: GiftCardOrderPayload;

  try {
    payload = (await request.json()) as GiftCardOrderPayload;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  // Magento re-checks the amount and prices the card; this only saves a round trip.
  if (!Number.isInteger(payload?.amount) || payload.amount < MIN_AMOUNT || payload.amount > MAX_AMOUNT) {
    return NextResponse.json({ error: "Choose a gift card amount within the allowed range" }, { status: 400 });
  }

  if (!payload.sender?.fullName?.trim() || !payload.sender.phone?.trim()) {
    return NextResponse.json({ error: "Sender details are required" }, { status: 400 });
  }

  const receiver = payload.receiverSameAsSender ? payload.sender : payload.receiver;
  if (!receiver?.fullName?.trim() || !receiver.phone?.trim()) {
    return NextResponse.json({ error: "Receiver details are required" }, { status: 400 });
  }

  if (payload.cardType === "digital" && !payload.digitalDeliveryDate?.trim()) {
    return NextResponse.json({ error: "Delivery date is required for digital gift cards" }, { status: 400 });
  }

  // Digital cards need no address (gift card flow spec 6.2); Magento fills their billing from the sender.
  const address = payload.deliveryAddress;
  if (
    payload.cardType === "physical" &&
    (!address?.addressLine1?.trim() ||
      !address.pincode?.trim() ||
      !address.city?.trim() ||
      !address.state?.trim())
  ) {
    return NextResponse.json({ error: "Delivery address is required" }, { status: 400 });
  }

  try {
    const order = await placeGiftCardMagentoOrder(payload);
    return NextResponse.json(order);
  } catch (error) {
    // Magento's own refusals are written for shoppers; anything else stays in the server log.
    if (error instanceof MagentoGraphqlError) {
      return NextResponse.json({ error: error.message }, { status: 502 });
    }
    console.error("[gift-card] place order failed", error);
    return NextResponse.json(
      { error: "We could not place your gift card order. Please try again." },
      { status: 502 },
    );
  }
}

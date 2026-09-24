import type {
  GiftCardDeliveryAddress,
  GiftCardPartyDetails,
  GiftCardType,
} from "../context/GiftCardFlowContext";

export type GiftCardOrderPayload = {
  cardType: GiftCardType;
  amount: number;
  occasion: string;
  digitalDeliveryDate?: string;
  message: string;
  sender: GiftCardPartyDetails;
  receiverSameAsSender: boolean;
  receiver: GiftCardPartyDetails;
  deliveryAddress: GiftCardDeliveryAddress;
};

export type GiftCardPlacedOrder = {
  orderNumber: string;
  awaitingOnlinePayment: boolean;
};

"use client";

import { useCallback, useState } from "react";
import { useAppStatusToastController } from "@/shared/hooks/useAppStatusToastController";
import {
  collectRazorpayPayment,
  verifyRazorpayPayment,
} from "@/features/checkout/services/razorpayCheckout";
import { useGiftCardFlow } from "../context/GiftCardFlowContext";
import {
  GIFT_CARD_PREVIEW_ORDER_NUMBER,
  GIFT_CARD_SKIP_PAYMENT_FOR_PREVIEW,
} from "../config/giftCardPreviewConfig";
import { placeGiftCardOrder } from "../services/giftCardOrder.service";

export function useGiftCardPayment() {
  const { show: showStatusToast, node: statusToastNode } = useAppStatusToastController();
  const flow = useGiftCardFlow();
  const [isPaying, setIsPaying] = useState(false);

  const initiatePayment = useCallback(async () => {
    if (isPaying) return false;

    setIsPaying(true);
    try {
      if (GIFT_CARD_SKIP_PAYMENT_FOR_PREVIEW) {
        flow.markOrderComplete(GIFT_CARD_PREVIEW_ORDER_NUMBER);
        return true;
      }

      const placedOrder = await placeGiftCardOrder({
        cardType: flow.cardType,
        amount: flow.amount,
        occasion: flow.occasion,
        digitalDeliveryDate:
          flow.cardType === "digital" ? flow.digitalDeliveryDate.trim() : undefined,
        message: flow.message,
        sender: flow.sender,
        receiverSameAsSender: flow.receiverSameAsSender,
        receiver: flow.receiver,
        deliveryAddress: flow.deliveryAddress,
      });

      if (!placedOrder.awaitingOnlinePayment) {
        flow.markOrderComplete(placedOrder.orderNumber);
        return true;
      }

      const receiver = flow.receiverSameAsSender ? flow.sender : flow.receiver;
      const outcome = await collectRazorpayPayment({
        orderNumber: placedOrder.orderNumber,
        prefill: {
          name: flow.sender.fullName || receiver.fullName || undefined,
          email: flow.sender.email || receiver.email || undefined,
          contact: flow.sender.phone || receiver.phone || undefined,
        },
      });

      if (outcome.status === "paid") {
        await verifyRazorpayPayment({
          orderNumber: placedOrder.orderNumber,
          paymentId: outcome.paymentId,
          signature: outcome.signature,
        }).catch(() => {
          // Payment captured; Magento webhook can reconcile if verification fails.
        });
        flow.markOrderComplete(placedOrder.orderNumber);
        return true;
      }

      return false;
    } catch (error) {
      showStatusToast(
        error instanceof Error
          ? error.message
          : "Unable to process payment. Please try again in a moment.",
      );
      return false;
    } finally {
      setIsPaying(false);
    }
  }, [flow, isPaying, showStatusToast]);

  return { initiatePayment, isPaying, statusToastNode };
}

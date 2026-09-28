"use client";

import { useCallback, useState } from "react";
import { useAppStatusToastController } from "@/shared/hooks/useAppStatusToastController";
import { collectRazorpayPayment } from "@/features/checkout/services/razorpayCheckout";
import { useGiftCardFlow } from "../context/GiftCardFlowContext";
import { placeGiftCardOrder } from "../services/giftCardOrder.service";

export function useGiftCardPayment() {
  const { show: showStatusToast, node: statusToastNode } = useAppStatusToastController();
  const flow = useGiftCardFlow();
  const [isPaying, setIsPaying] = useState(false);

  const initiatePayment = useCallback(async () => {
    if (isPaying) return false;

    setIsPaying(true);
    try {
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
        // Magento confirm already started in the Razorpay handler. Waiting
        // here kept the payment step on screen after payment succeeded.
        flow.markOrderComplete(placedOrder.orderNumber);
        return true;
      }

      showStatusToast("Payment was not completed, so you have not been charged. Press PAY NOW to try again.");
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

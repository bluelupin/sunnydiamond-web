"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  CartOutlineButton,
  CartPrimaryLink,
  CartSuccessCheck,
} from "@/features/cart/components/CartFlowUi";
import { PanelFooter } from "@/shared/ui/PanelFooter";
import { useGiftCardFlow } from "../context/GiftCardFlowContext";
import { giftCardFlowContent } from "../data/content";

type GiftCardSuccessStepProps = {
  onClose: () => void;
};

const GiftCardSuccessStep = ({ onClose }: GiftCardSuccessStepProps) => {
  const router = useRouter();
  const { cardType, orderNumber, estimatedDeliveryDate } = useGiftCardFlow();
  const { success } = giftCardFlowContent;

  const trackingHref = orderNumber
    ? `/order-tracking?order=${encodeURIComponent(orderNumber)}`
    : "/order-tracking";

  const message =
    cardType === "physical"
      ? `${success.physicalMessage} ${estimatedDeliveryDate}.`
      : success.digitalMessage;

  const handleBackToShopping = () => {
    onClose();
    router.push(success.backToShoppingHref);
  };

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-white">
      <div className="flex shrink-0 justify-end px-6 pt-10">
        <button type="button" onClick={onClose} aria-label="Close gift card flow">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col items-center gap-6 overflow-y-auto overscroll-contain px-6 pb-6">
        <CartSuccessCheck />
        <div className="flex flex-col items-center gap-4 text-center">
          <h2 className="font-larken text-[32px] font-light leading-110 text-darkblack">
            {success.title}
          </h2>
          <p className="max-w-[360px] font-gill text-base font-light leading-110 text-darkblack">
            {message}
          </p>
        </div>

        <div className="relative h-[200px] w-full max-w-[320px] shrink-0">
          <Image
            src={success.image.src}
            alt={success.image.alt}
            fill
            className="object-contain object-center"
            sizes="320px"
          />
        </div>
      </div>

      <PanelFooter contentClassName="px-4 py-6">
        <div className="flex flex-col gap-4">
          <CartPrimaryLink href={trackingHref} className="w-full uppercase">
            {success.trackOrderLabel}
          </CartPrimaryLink>
          <CartOutlineButton type="button" className="w-full uppercase" onClick={handleBackToShopping}>
            {success.backToShoppingLabel}
          </CartOutlineButton>
        </div>
      </PanelFooter>
    </div>
  );
};

export default GiftCardSuccessStep;

"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  CartOutlineButton,
  CartPrimaryLink,
  CartSuccessCheck,
} from "@/features/cart/components/CartFlowUi";
import { RIGHT_PANEL_CONTENT_PADDING_CLASS } from "@/shared/ui/rightPanel";
import { RightPanelCloseButton } from "@/shared/ui/RightPanelCloseButton";
import { PanelFooter } from "@/shared/ui/PanelFooter";
import { RightPanelScrollLayout } from "@/shared/ui/RightPanelScrollLayout";
import { cn } from "@/shared/utils/cn";
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
    <RightPanelScrollLayout
      footer={
        <PanelFooter>
          <div className="flex flex-col gap-4">
            <CartPrimaryLink href={trackingHref} className="w-full uppercase">
              {success.trackOrderLabel}
            </CartPrimaryLink>
            <CartOutlineButton type="button" className="w-full uppercase" onClick={handleBackToShopping}>
              {success.backToShoppingLabel}
            </CartOutlineButton>
          </div>
        </PanelFooter>
      }
    >
      <div className={cn("flex justify-end md:pt-10 pt-6", RIGHT_PANEL_CONTENT_PADDING_CLASS)}>
        <RightPanelCloseButton onClick={onClose} aria-label="Close gift card flow" />
      </div>

      <div className={cn("flex flex-col items-center gap-6 pb-24 pt-6", RIGHT_PANEL_CONTENT_PADDING_CLASS)}>
        <CartSuccessCheck />
        <div className="flex flex-col items-center gap-4 text-center">
          <h2 className="font-larken text-2xl font-light leading-110 text-darkblack lg:text-32">
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
    </RightPanelScrollLayout>
  );
};

export default GiftCardSuccessStep;

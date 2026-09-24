"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  CartPrimaryLink,
  CartSuccessCheck,
  CartTextLink,
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

/** Figma 4903:106197 (desktop) / 4903:100405 (mobile) — gift card success panel */
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
        <PanelFooter contentClassName="flex flex-col items-center gap-4">
          <CartPrimaryLink href={trackingHref} className="w-full uppercase">
            {success.trackOrderLabel}
          </CartPrimaryLink>
          <CartTextLink
            href={success.backToShoppingHref}
            onClick={handleBackToShopping}
            className="uppercase"
          >
            {success.backToShoppingLabel}
          </CartTextLink>
        </PanelFooter>
      }
    >
      <div
        className={cn(
          "flex flex-col items-center gap-10 pb-24 pt-6 md:pt-10",
          RIGHT_PANEL_CONTENT_PADDING_CLASS,
        )}
      >
        <div className="flex w-full flex-col items-center gap-6">
          <div className="grid w-full [&>*]:col-start-1 [&>*]:row-start-1">
            <div className="flex justify-center">
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="md:size-16 size-10">
                <path d="M22 34L28 40L42 26" stroke="#47CB6C" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M32 56C45.2548 56 56 45.2548 56 32C56 18.7452 45.2548 8 32 8C18.7452 8 8 18.7452 8 32C8 45.2548 18.7452 56 32 56Z" stroke="#47CB6C" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <RightPanelCloseButton
              onClick={onClose}
              aria-label="Close gift card flow"
              className="justify-self-end"
            />
          </div>

          <div className="flex w-full flex-col items-center gap-3 text-center text-darkblack">
            <h2 className="font-larken text-2xl font-light leading-110 lg:text-32">
              {success.title}
            </h2>
            <p className="w-full font-gill text-sm font-light leading-110 lg:text-base">
              {message}
            </p>
          </div>
        </div>

        <div className="relative md:max-[424px] max-w[343px] aspect-[424/265] w-full shrink-0 overflow-hidden">
          <Image
            src="/images/gifting/gift-card-success.png"
            alt={success.image.alt}
            fill
            className="w-full h-full object-cover object-center"
          />
        </div>
      </div>
    </RightPanelScrollLayout>
  );
};

export default GiftCardSuccessStep;

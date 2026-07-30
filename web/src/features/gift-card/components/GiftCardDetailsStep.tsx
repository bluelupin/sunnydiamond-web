"use client";

import { useRouter } from "next/navigation";
import { CartPrimaryButton } from "@/features/cart/components/CartFlowUi";
import { PanelFooter } from "@/shared/ui/PanelFooter";
import { cn } from "@/shared/utils/cn";
import { useGiftCardFlow } from "../context/GiftCardFlowContext";
import { giftCardFlowContent } from "../data/content";
import {
  GiftCardCheckbox,
  GiftCardPhoneField,
  GiftCardTextField,
  giftCardSectionHeadingClass,
} from "./GiftCardFormUi";

const GiftCardDetailsStep = ({ onClose }: { onClose: () => void }) => {
  const router = useRouter();
  const {
    sender,
    receiver,
    receiverSameAsSender,
    setSender,
    setReceiver,
    setReceiverSameAsSender,
  } = useGiftCardFlow();

  const { details, cta } = giftCardFlowContent;

  const canContinue =
    sender.fullName.trim().length > 0 &&
    sender.phone.trim().length >= 10 &&
    (receiverSameAsSender ||
      (receiver.fullName.trim().length > 0 && receiver.phone.trim().length >= 10));

  const handleContinue = () => {
    if (!canContinue) return;
    onClose();
    router.push("/checkout");
  };

  return (
    <>
      <div className="flex min-h-0 flex-1 flex-col gap-10 overflow-y-auto overscroll-contain px-6 py-6">
        <div className="flex flex-col gap-4">
          <p className={giftCardSectionHeadingClass}>{details.senderHeading}</p>
          <GiftCardTextField
            id="gift-card-sender-name"
            label={details.fullNameLabel}
            value={sender.fullName}
            onChange={(value) => setSender({ fullName: value })}
            placeholder={details.placeholder}
          />
          <GiftCardPhoneField
            id="gift-card-sender-phone"
            label={details.phoneLabel}
            value={sender.phone}
            onChange={(value) => setSender({ phone: value })}
            focused={sender.phone.length > 0}
          />
          <GiftCardTextField
            id="gift-card-sender-email"
            label={details.emailLabel}
            value={sender.email}
            onChange={(value) => setSender({ email: value })}
            placeholder={details.placeholder}
            type="email"
          />
        </div>

        <div className="flex flex-col gap-4">
          <p className={giftCardSectionHeadingClass}>{details.receiverHeading}</p>
          <GiftCardCheckbox
            checked={receiverSameAsSender}
            onChange={setReceiverSameAsSender}
            label={details.sameAsSenderLabel}
          />
          {!receiverSameAsSender ? (
            <div className="flex flex-col gap-4">
              <GiftCardTextField
                id="gift-card-receiver-name"
                label={details.fullNameLabel}
                value={receiver.fullName}
                onChange={(value) => setReceiver({ fullName: value })}
                placeholder={details.placeholder}
              />
              <GiftCardPhoneField
                id="gift-card-receiver-phone"
                label={details.phoneLabel}
                value={receiver.phone}
                onChange={(value) => setReceiver({ phone: value })}
              />
              <GiftCardTextField
                id="gift-card-receiver-email"
                label={details.emailLabel}
                value={receiver.email}
                onChange={(value) => setReceiver({ email: value })}
                placeholder={details.placeholder}
                type="email"
              />
            </div>
          ) : null}
        </div>
      </div>

      <PanelFooter contentClassName="px-4 py-6">
        <CartPrimaryButton
          type="button"
          disabled={!canContinue}
          onClick={handleContinue}
          className={cn(!canContinue && "opacity-50")}
        >
          {cta.addDetails}
        </CartPrimaryButton>
      </PanelFooter>
    </>
  );
};

export default GiftCardDetailsStep;

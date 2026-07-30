"use client";

import { useGiftCardFlow } from "../context/GiftCardFlowContext";
import { giftCardFlowContent } from "../data/content";
import GiftCardAddressStep from "./GiftCardAddressStep";
import GiftCardConfigureStep from "./GiftCardConfigureStep";
import GiftCardDetailsStep from "./GiftCardDetailsStep";
import GiftCardSuccessStep from "./GiftCardSuccessStep";
import { GiftCardPanelHeader } from "./GiftCardFormUi";

type GiftCardFlowPanelProps = {
  onClose: () => void;
};

const GiftCardFlowPanel = ({ onClose }: GiftCardFlowPanelProps) => {
  const { step, goToDetails, goBack } = useGiftCardFlow();

  if (step === "success") {
    return <GiftCardSuccessStep onClose={onClose} />;
  }

  const showBack = step === "details" || step === "address";

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-white">
      <GiftCardPanelHeader
        title={giftCardFlowContent.title}
        onClose={onClose}
        onBack={showBack ? goBack : undefined}
      />

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        {step === "configure" ? (
          <GiftCardConfigureStep onContinue={goToDetails} />
        ) : step === "details" ? (
          <GiftCardDetailsStep />
        ) : (
          <GiftCardAddressStep />
        )}
      </div>
    </div>
  );
};

export default GiftCardFlowPanel;

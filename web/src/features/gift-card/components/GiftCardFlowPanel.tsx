"use client";

import { useGiftCardFlow } from "../context/GiftCardFlowContext";
import { giftCardFlowContent } from "../data/content";
import GiftCardConfigureStep from "./GiftCardConfigureStep";
import GiftCardDetailsStep from "./GiftCardDetailsStep";
import { GiftCardPanelHeader } from "./GiftCardFormUi";

type GiftCardFlowPanelProps = {
  onClose: () => void;
};

const GiftCardFlowPanel = ({ onClose }: GiftCardFlowPanelProps) => {
  const { step, goToDetails, goBack } = useGiftCardFlow();

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-white">
      <GiftCardPanelHeader
        title={giftCardFlowContent.title}
        onClose={onClose}
        onBack={step === "details" ? goBack : undefined}
      />

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        {step === "configure" ? (
          <GiftCardConfigureStep onContinue={goToDetails} />
        ) : (
          <GiftCardDetailsStep onClose={onClose} />
        )}
      </div>
    </div>
  );
};

export default GiftCardFlowPanel;

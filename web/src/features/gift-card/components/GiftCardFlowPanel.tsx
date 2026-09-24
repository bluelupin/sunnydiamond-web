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
  const { step, goBack } = useGiftCardFlow();

  if (step === "success") {
    return <GiftCardSuccessStep onClose={onClose} />;
  }

  const showBack = step === "details" || step === "address";
  const header = (
    <GiftCardPanelHeader
      title={giftCardFlowContent.title}
      onClose={onClose}
      onBack={showBack ? goBack : undefined}
    />
  );

  if (step === "configure") {
    return <GiftCardConfigureStep header={header} />;
  }

  if (step === "details") {
    return <GiftCardDetailsStep header={header} />;
  }

  return <GiftCardAddressStep header={header} />;
};

export default GiftCardFlowPanel;

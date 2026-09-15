"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useLoginModal } from "@/features/auth/context/LoginModalContext";
import { CartPrimaryButton } from "@/features/cart/components/CartFlowUi";
import { PanelFooter } from "@/shared/ui/PanelFooter";
import { RIGHT_PANEL_CONTENT_PADDING_CLASS } from "@/shared/ui/rightPanel";
import { RightPanelScrollLayout } from "@/shared/ui/RightPanelScrollLayout";
import { cn } from "@/shared/utils/cn";
import { useGiftCardFlow } from "../context/GiftCardFlowContext";
import { giftCardFlowContent } from "../data/content";
import {
  GiftCardSelectField,
  GiftCardTextAreaField,
  GiftCardToggleOption,
  giftCardFieldLabelClass,
} from "./GiftCardFormUi";

function formatGiftCardAmount(amount: number): string {
  return `₹ ${amount.toLocaleString("en-IN")}`;
}

const GiftCardConfigureStep = ({ header }: { header: ReactNode }) => {
  const pathname = usePathname() ?? "/";
  const { status } = useAuth();
  const { openLoginModal } = useLoginModal();
  const {
    cardType,
    amount,
    occasion,
    message,
    occasionOptions,
    setCardType,
    setAmount,
    setOccasion,
    setMessage,
    requestDetailsStep,
    beginGuestAuthForDetails,
    persistFlowState,
  } = useGiftCardFlow();

  const { amount: amountConfig, cardTypes, occasion: occasionConfig, message: messageConfig } =
    giftCardFlowContent;

  const clampAmount = (value: number) =>
    Math.min(amountConfig.max, Math.max(amountConfig.min, value));

  const hasOccasionOptions = occasionOptions.length > 0;
  const canContinue = hasOccasionOptions ? occasion.trim().length > 0 : true;

  const handleContinue = () => {
    if (!canContinue) return;

    persistFlowState();

    if (status === "authenticated") {
      requestDetailsStep();
      return;
    }

    beginGuestAuthForDetails();
    openLoginModal({ returnUrl: pathname });
  };

  return (
    <RightPanelScrollLayout
      footer={
        <PanelFooter>
          <CartPrimaryButton
            type="button"
            disabled={!canContinue}
            onClick={handleContinue}
          >
            {giftCardFlowContent.cta.addDetails}
          </CartPrimaryButton>
        </PanelFooter>
      }
    >
      {header}
      <div className={cn("flex flex-col gap-6 pt-6 pb-24", RIGHT_PANEL_CONTENT_PADDING_CLASS)}>
        <div className="flex flex-col gap-2">
          <p className={giftCardFieldLabelClass}>{cardTypes.label}</p>
          <div className="flex gap-2">
            <GiftCardToggleOption
              label={cardTypes.physical}
              selected={cardType === "physical"}
              onSelect={() => setCardType("physical")}
            />
            <GiftCardToggleOption
              label={cardTypes.digital}
              selected={cardType === "digital"}
              onSelect={() => setCardType("digital")}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <p className={giftCardFieldLabelClass}>{amountConfig.label}</p>
          <div className="flex flex-col gap-6 border border-neutral300 p-5">
            <div className="flex flex-col gap-4">
              <div className="relative h-1 w-full rounded-full bg-neutral300">
                <div
                  className="absolute left-0 top-0 h-[3px] bg-darkblack"
                  style={{ width: `${((amount - amountConfig.min) / (amountConfig.max - amountConfig.min)) * 100}%` }}
                  aria-hidden
                />
                <input
                  type="range"
                  min={amountConfig.min}
                  max={amountConfig.max}
                  step={amountConfig.step}
                  value={amount}
                  onChange={(event) => setAmount(Number(event.target.value))}
                  aria-label="Gift card amount"
                  className="absolute inset-0 size-full cursor-pointer opacity-0"
                />
                <div
                  className="pointer-events-none absolute top-1/2 size-3 -translate-y-1/2 rounded-full bg-darkblack shadow-[0_2px_4px_rgba(0,0,0,0.25)]"
                  style={{
                    left: `calc(${((amount - amountConfig.min) / (amountConfig.max - amountConfig.min)) * 100}% - 6px)`,
                  }}
                  aria-hidden
                />
              </div>
              <div className="flex h-14 items-center bg-[#F2F2F2] px-3">
                <input
                  type="text"
                  inputMode="numeric"
                  value={formatGiftCardAmount(amount)}
                  onChange={(event) => {
                    const digits = event.target.value.replace(/\D/g, "");
                    if (!digits) return;
                    setAmount(clampAmount(Number(digits)));
                  }}
                  aria-label="Gift card amount in rupees"
                  className="min-w-0 flex-1 bg-transparent font-gill text-xl font-normal leading-110 text-darkblack outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <p className={giftCardFieldLabelClass}>{amountConfig.presetLabel}</p>
              <div className="flex gap-2">
                {amountConfig.presets.map((preset) => (
                  <GiftCardToggleOption
                    key={preset}
                    label={preset.toLocaleString("en-IN")}
                    selected={amount === preset}
                    onSelect={() => setAmount(preset)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {hasOccasionOptions ? (
          <GiftCardSelectField
            id="gift-card-occasion"
            label={occasionConfig.label}
            value={occasion}
            onChange={setOccasion}
            placeholder={occasionConfig.placeholder}
            options={occasionOptions}
          />
        ) : null}

        <GiftCardTextAreaField
          id="gift-card-message"
          label={messageConfig.label}
          value={message}
          onChange={setMessage}
          placeholder={messageConfig.placeholder}
        />
      </div>
    </RightPanelScrollLayout>
  );
};

export default GiftCardConfigureStep;

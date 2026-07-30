"use client";

import { useMemo } from "react";
import { CartPrimaryButton } from "@/features/cart/components/CartFlowUi";
import { PanelFooter } from "@/shared/ui/PanelFooter";
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

const GiftCardConfigureStep = ({ onContinue }: { onContinue: () => void }) => {
  const {
    cardType,
    amount,
    occasion,
    message,
    setCardType,
    setAmount,
    setOccasion,
    setMessage,
  } = useGiftCardFlow();

  const { amount: amountConfig, cardTypes, occasion: occasionConfig, message: messageConfig } =
    giftCardFlowContent;

  const sliderFillPercent = useMemo(() => {
    const range = amountConfig.max - amountConfig.min;
    if (range <= 0) return 0;
    return ((amount - amountConfig.min) / range) * 100;
  }, [amount, amountConfig.max, amountConfig.min]);

  const clampAmount = (value: number) =>
    Math.min(amountConfig.max, Math.max(amountConfig.min, value));

  const canContinue = occasion.trim().length > 0;

  return (
    <>
      <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto overscroll-contain px-6 py-6">
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
                  style={{ width: `${sliderFillPercent}%` }}
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
                  style={{ left: `calc(${sliderFillPercent}% - 6px)` }}
                  aria-hidden
                />
              </div>
              <div className="flex h-14 items-center bg-gray200 p-3">
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

        <GiftCardSelectField
          id="gift-card-occasion"
          label={occasionConfig.label}
          value={occasion}
          onChange={setOccasion}
          placeholder={occasionConfig.placeholder}
          options={occasionConfig.options}
        />

        <GiftCardTextAreaField
          id="gift-card-message"
          label={messageConfig.label}
          value={message}
          onChange={setMessage}
          placeholder={messageConfig.placeholder}
        />
      </div>

      <PanelFooter contentClassName="px-4 py-6">
        <CartPrimaryButton
          type="button"
          disabled={!canContinue}
          onClick={onContinue}
          className={cn(!canContinue && "opacity-50")}
        >
          {giftCardFlowContent.cta.addDetails}
        </CartPrimaryButton>
      </PanelFooter>
    </>
  );
};

export default GiftCardConfigureStep;

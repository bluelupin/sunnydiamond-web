"use client";

import { useState } from "react";
import Image from "next/image";
import { DetailTextLink } from "@/features/products/components/detail/shared";
import { formatCartPrice } from "@/features/cart/utils/formatCartLine";
import { useCart } from "@/features/cart/context/CartContext";
import {
  findMockGiftCardByCode,
  mockAvailableOffers,
  type MockGiftCard,
  type MockOffer,
} from "@/shared/data/offersAndDealsMock";
import type { OffersAndDealsVariant } from "@/shared/data/offersAndDealsSpec";
import FormFieldError from "@/shared/ui/FormFieldError";
import { cn } from "@/shared/utils/cn";
import { invalidFieldContainerClassName } from "@/shared/utils/formValidation";

export const OFFERS_EMPTY_MESSAGE =
  "No offers applied yet. Check back for seasonal promotions.";

const couponFieldClassName =
  "h-14 min-w-0 flex-1 bg-aboutInactive px-3 font-gill text-base leading-110 text-darkblack outline-none placeholder:font-normal placeholder:text-gray600";

type OffersAndDealsExpandedContentProps = {
  variant?: OffersAndDealsVariant;
  className?: string;
};

type PromoFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onApply: () => void;
  placeholder?: string;
  applyLabel?: string;
  disabled?: boolean;
  hasError?: boolean;
};

const PromoField = ({
  id,
  label,
  value,
  onChange,
  onApply,
  placeholder = "Enter",
  applyLabel = "Apply",
  disabled = false,
  hasError = false,
}: PromoFieldProps) => (
  <div className="flex flex-col gap-2">
    <label htmlFor={id} className="font-gill text-base font-normal leading-110 text-darkblack">
      {label}
    </label>
    <div
      className={cn(
        "flex h-14 items-center gap-4 border border-transparent bg-white px-3 lg:bg-aboutInactive",
        hasError && invalidFieldContainerClassName,
      )}
    >
      <input
        id={id}
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(couponFieldClassName, "bg-transparent px-0")}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            onApply();
          }
        }}
      />
      <DetailTextLink
        onClick={onApply}
        className={cn("shrink-0 pb-0.5", disabled && "pointer-events-none opacity-40")}
      >
        {applyLabel}
      </DetailTextLink>
    </div>
  </div>
);

const OfferCard = ({ offer }: { offer: MockOffer }) => (
  <div className="flex min-h-[100px] w-[214px] min-w-[214px] flex-1 items-start gap-3 border border-gray300 bg-white px-3 py-4 lg:bg-white">
    <Image
      src="/icons/kotal-bank-icon.svg"
      alt=""
      width="28"
      height="24"
      aria-hidden
      className="h-6 w-7 shrink-0"
    />
    <div className="flex min-w-0 flex-col gap-4">
      <p className="line-clamp-2 font-gill text-sm font-light leading-110 text-darkblack">
        {offer.headline}
      </p>
      <p className="font-gill text-sm font-light leading-110 text-darkblack">{offer.categoryLabel}</p>
    </div>
  </div>
);

const AppliedGiftCardSummary = ({
  giftCard,
  onRemoveGiftCard,
}: {
  giftCard: MockGiftCard;
  onRemoveGiftCard: () => void;
}) => (
  <div className="flex flex-col gap-3 border border-neutral300 bg-white p-3">
    <div className="flex items-start justify-between gap-4">
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="font-gill text-base font-normal leading-110 text-darkblack">Gift card</p>
        <p className="font-gill text-sm font-light leading-110 text-neutral500">
          {giftCard.code} — {formatCartPrice(giftCard.balance)} balance applied
        </p>
      </div>
      <DetailTextLink onClick={onRemoveGiftCard} className="shrink-0 pb-0.5">
        Remove
      </DetailTextLink>
    </div>
  </div>
);

const expandedBackgroundByVariant: Record<OffersAndDealsVariant, string | null> = {
  "sticky-gray200": "bg-gray200",
  "sticky-gray300": "bg-gray300",
  "panel-gray300": null,
};

const OffersAndDealsExpandedContent = ({
  variant = "panel-gray300",
  className,
}: OffersAndDealsExpandedContentProps) => {
  const { applyLocalGiftCard, removeLocalGiftCard, appliedLocalGiftCardCode, localGiftCardDiscount } = useCart();
  const [giftCardCode, setGiftCardCode] = useState("");
  const [appliedGiftCard, setAppliedGiftCard] = useState<MockGiftCard | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const expandedBackground = expandedBackgroundByVariant[variant];

  const applyGiftCard = () => {
    const match = findMockGiftCardByCode(giftCardCode);
    if (!match) {
      setErrorMessage("Gift card not found. Try SUNNYGC1000 or GIFT500.");
      return;
    }

    setAppliedGiftCard(match);
    applyLocalGiftCard(match.code, match.balance);
    setErrorMessage(null);
    setGiftCardCode("");
  };

  const handleRemoveGiftCard = () => {
    setAppliedGiftCard(null);
    removeLocalGiftCard();
  };

  const body = (
    <div className="flex flex-col gap-6">
      <div className="h-px w-full shrink-0 bg-neutral300" aria-hidden />

      <div className="flex flex-col gap-3">
        <p className="font-gill text-base font-normal leading-110 text-darkblack">Bank Offers</p>
        <div className="horizontalScroll flex items-start gap-2 overflow-auto">
          {mockAvailableOffers.map((offer) => (
            <OfferCard key={offer.id} offer={offer} />
          ))}
        </div>
      </div>

      <div className="h-px w-full shrink-0 bg-neutral300 md:hidden" aria-hidden />

      <PromoField
        id="offers-gift-card"
        label="Have a gift card?"
        value={giftCardCode}
        onChange={(value) => {
          setGiftCardCode(value);
          if (errorMessage) setErrorMessage(null);
        }}
        onApply={applyGiftCard}
        placeholder="Enter code"
        disabled={Boolean(appliedGiftCard || appliedLocalGiftCardCode)}
        hasError={Boolean(errorMessage)}
      />

      <FormFieldError message={errorMessage ?? undefined} />

      {(appliedGiftCard || appliedLocalGiftCardCode) ? (
        <AppliedGiftCardSummary
          giftCard={
            appliedGiftCard ?? {
              code: appliedLocalGiftCardCode ?? "",
              balance: localGiftCardDiscount,
            }
          }
          onRemoveGiftCard={handleRemoveGiftCard}
        />
      ) : null}
    </div>
  );

  if (!expandedBackground) {
    return <div className={className}>{body}</div>;
  }

  return <div className={cn("bg-gray300 px-4 pb-4", className)}>{body}</div>;
};

export default OffersAndDealsExpandedContent;

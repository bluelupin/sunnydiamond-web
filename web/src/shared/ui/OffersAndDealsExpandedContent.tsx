"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { DetailTextLink } from "@/features/products/components/detail/shared";
import { formatCartPrice } from "@/features/cart/utils/formatCartLine";
import {
  findMockGiftCardByCode,
  findMockOfferByCode,
  mockAvailableOffers,
  type MockGiftCard,
  type MockOffer,
} from "@/shared/data/offersAndDealsMock";
import type { OffersAndDealsVariant } from "@/shared/data/offersAndDealsSpec";
import { cn } from "@/shared/utils/cn";
import Image from "next/image";

export const OFFERS_EMPTY_MESSAGE =
  "No offers applied yet. Check back for seasonal promotions.";

const couponFieldClassName =
  "h-14 min-w-0 flex-1 bg-aboutInactive px-3 font-gill text-base leading-110 text-darkblack outline-none placeholder:font-normal placeholder:text-gray600";

type AppliedGiftCard = MockGiftCard;

type OffersAndDealsExpandedContentProps = {
  variant?: OffersAndDealsVariant;
  className?: string;
};

const OffersAndDealsEmptyMessage = ({ className }: { className?: string }) => (
  <p
    className={cn(
      "text-center font-gill text-sm font-light leading-110 text-neutral500",
      className,
    )}
  >
    {OFFERS_EMPTY_MESSAGE}
  </p>
);

type PromoFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onApply: () => void;
  placeholder?: string;
  applyLabel?: string;
  disabled?: boolean;
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
}: PromoFieldProps) => (
  <div className="flex flex-col gap-2">
    <label htmlFor={id} className="font-gill text-base font-normal leading-110 text-darkblack">
      {label}
    </label>
    <div className="flex h-14 items-center gap-4 lg:bg-aboutInactive bg-white px-3">
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

type OfferCardProps = {
  offer: MockOffer;
  applied: boolean;
  onApply: () => void;
};

const OfferCard = ({ offer, applied, onApply }: OfferCardProps) => (
  <div className="flex min-w-0 flex-1 items-start gap-3 lg:bg-gray300 bg-white py-4 px-3 w-[214px] min-w-[214px] min-h-[100px] border border-gray300">
    <Image
      src="/icons/kotal-bank-icon.svg"
      alt="Kotak Icon"
      width="28"
      height="24"
      aria-hidden
      className="h-6 w-7 shrink-0"
    />
    <div className="flex min-w-0 flex-col gap-4">
      <p className="font-gill text-sm font-light leading-110 text-darkblack line-clamp-2">{offer.headline}</p>
      <p className="font-gill text-sm font-light leading-110 text-darkblack">{offer.categoryLabel}</p>
    </div>
  </div>
);

const AppliedSummary = ({
  offer,
  giftCard,
  onRemoveOffer,
  onRemoveGiftCard,
}: {
  offer: MockOffer | null;
  giftCard: AppliedGiftCard | null;
  onRemoveOffer: () => void;
  onRemoveGiftCard: () => void;
}) => {
  if (!offer && !giftCard) return null;

  return (
    <div className="flex flex-col gap-3 border border-neutral300 bg-white p-3">
      {offer ? (
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <p className="font-gill text-base font-normal leading-110 text-darkblack">
              {offer.headline}
            </p>
            <p className="font-gill text-sm font-light leading-110 text-neutral500">
              {offer.discountLabel} applied with code {offer.code}
            </p>
          </div>
          <DetailTextLink onClick={onRemoveOffer} className="shrink-0 pb-0.5">
            Remove
          </DetailTextLink>
        </div>
      ) : null}

      {offer && giftCard ? <div className="h-px w-full bg-neutral300" aria-hidden /> : null}

      {giftCard ? (
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
      ) : null}
    </div>
  );
};

const expandedBackgroundByVariant: Record<OffersAndDealsVariant, string | null> = {
  "sticky-gray200": "bg-gray200",
  "sticky-gray300": "bg-gray300",
  "panel-gray300": null,
};

/** Figma 2083:7653 — expanded offers panel (mock data, no API) */
const OffersAndDealsExpandedContent = ({
  variant = "panel-gray300",
  className,
}: OffersAndDealsExpandedContentProps) => {
  const [couponCode, setCouponCode] = useState("");
  const [giftCardCode, setGiftCardCode] = useState("");
  const [appliedOffer, setAppliedOffer] = useState<MockOffer | null>(null);
  const [appliedGiftCard, setAppliedGiftCard] = useState<AppliedGiftCard | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const hasApplied = Boolean(appliedOffer || appliedGiftCard);
  const expandedBackground = expandedBackgroundByVariant[variant];

  const applyCoupon = () => {
    const match = findMockOfferByCode(couponCode);
    if (!match) {
      setErrorMessage("This coupon code is not valid. Try KOTAK12, SUNNY10, WELCOME500, or FESTIVE15.");
      return;
    }

    setAppliedOffer(match);
    setErrorMessage(null);
    setCouponCode("");
  };

  const applyGiftCard = () => {
    const match = findMockGiftCardByCode(giftCardCode);
    if (!match) {
      setErrorMessage("Gift card not found. Try SUNNYGC1000 or GIFT500.");
      return;
    }

    setAppliedGiftCard(match);
    setErrorMessage(null);
    setGiftCardCode("");
  };

  const applyOfferFromList = (offer: MockOffer) => {
    setAppliedOffer(offer);
    setErrorMessage(null);
    setCouponCode("");
  };

  const body = (
    <div className="flex flex-col gap-6">
      <div className="w-full shrink-0 bg-neutral300 h-px" aria-hidden="true"></div>
      <div className="flex flex-col gap-3">
        <p className="font-gill text-base font-normal leading-110 text-darkblack">Bank Offers</p>
        <div className="flex items-start gap-2 overflow-auto horizontalScroll">
          {mockAvailableOffers.map((offer) => (
            <OfferCard
              key={offer.id}
              offer={offer}
              applied={appliedOffer?.id === offer.id}
              onApply={() => applyOfferFromList(offer)}
            />
          ))}
        </div>
      </div>
      <div className="w-full shrink-0 bg-neutral300 h-px" aria-hidden="true"></div>
      {/* {!hasApplied && <OffersAndDealsEmptyMessage />} */}
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
        disabled={Boolean(appliedGiftCard)}
      />
      {errorMessage &&
        <p className="font-gill text-sm font-light leading-110 text-[#B42318]" role="alert">
          {errorMessage}
        </p>
      }
      {hasApplied &&
        <AppliedSummary
          offer={appliedOffer}
          giftCard={appliedGiftCard}
          onRemoveOffer={() => setAppliedOffer(null)}
          onRemoveGiftCard={() => setAppliedGiftCard(null)}
        />
      }
    </div>
  );

  if (!expandedBackground) {
    return <div className={className}>{body}</div>;
  }

  return (
    <div className={cn("bg-gray300", "px-4 pb-4", className)}>
      {body}
    </div>
  );
};

export default OffersAndDealsExpandedContent;

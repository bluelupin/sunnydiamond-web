"use client";

import { useEffect, useState } from "react";
import { DetailTextLink } from "@/features/products/components/detail/shared";
import { useCart } from "@/features/cart/context/CartContext";
import { getRazorpayDisplayOffers, type RazorpayDisplayOffer } from "@/services/magento/offers/razorpayOffers.service";
import type { OffersAndDealsVariant } from "@/shared/data/offersAndDealsSpec";
import FormFieldError from "@/shared/ui/FormFieldError";
import { cn } from "@/shared/utils/cn";
import {
  inputAutofillResetClassName,
  inputAutofillSurfaceErrorClassName,
  invalidFieldContainerClassName,
} from "@/shared/utils/formValidation";
import { MagentoGraphqlError } from "@/services/magento/magento.errors";

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
  showInput?: boolean;
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
  showInput = true,
}: PromoFieldProps) => (
  <div className="flex flex-col gap-2">
    <label htmlFor={id} className="font-gill text-base font-normal leading-110 text-darkblack">
      {label}
    </label>
    {showInput ? (
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
          autoComplete="off"
          aria-invalid={hasError || undefined}
          className={cn(
            couponFieldClassName,
            "bg-transparent px-0",
            hasError
              ? inputAutofillSurfaceErrorClassName
              : cn(
                  inputAutofillResetClassName,
                  "[&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_#FFFFFF]",
                  "lg:[&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_#F2F2F2]",
                ),
          )}
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
    ) : null}
  </div>
);

const OfferCard = ({ offer }: { offer: RazorpayDisplayOffer }) => (
  <div className="flex min-h-[100px] w-[214px] min-w-[214px] shrink-0 flex-col gap-2 border border-white bg-white px-3 py-4 text-left">
    <p className="font-gill text-sm font-normal leading-110 text-darkblack">{offer.title}</p>
    {offer.description ? <p className="font-gill text-sm font-light leading-110 text-darkblack">{offer.description}</p> : null}
    {offer.min_amount != null ? <p className="font-gill text-xs text-gray600">Minimum order ₹{offer.min_amount.toLocaleString("en-IN")}</p> : null}
    {offer.payment_methods.length ? <p className="font-gill text-xs text-gray600">{offer.payment_methods.join(", ")}</p> : null}
    {offer.terms ? <p className="font-gill text-xs text-gray600">{offer.terms}</p> : null}
    {offer.terms_url ? <a href={offer.terms_url} target="_blank" rel="noopener noreferrer" className="font-gill text-xs underline">Terms</a> : null}
  </div>
);

const AppliedGiftCardSummary = ({
  code,
  hasProblem,
  onRemoveGiftCard,
  disabled,
}: {
  code: string;
  hasProblem: boolean;
  onRemoveGiftCard: () => void;
  disabled: boolean;
}) => (
  <div className="flex items-center justify-between gap-3 border border-white bg-white p-3 h-14">
    <p
      className={cn(
        "font-gill text-base font-normal leading-110",
        hasProblem ? "text-darkblack" : "text-green600",
      )}
    >
      {code} {hasProblem ? "not applied" : "applied"}
    </p>
    <DetailTextLink
      onClick={onRemoveGiftCard}
      className={cn("shrink-0 pb-0.5", disabled && "pointer-events-none opacity-40")}
    >
      Remove
    </DetailTextLink>
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
  const {
    applyGiftCard,
    removeGiftCard,
    appliedGiftCardCode,
    giftCardProblem,
  } = useCart();
  const [giftCardCode, setGiftCardCode] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [giftCardBusy, setGiftCardBusy] = useState(false);
  const [offers, setOffers] = useState<RazorpayDisplayOffer[]>([]);
  const [offersLoading, setOffersLoading] = useState(true);
  useEffect(() => {
    let active = true;
    getRazorpayDisplayOffers()
      .then((items) => { if (active) setOffers(items); })
      .catch(() => { if (active) setOffers([]); })
      .finally(() => { if (active) setOffersLoading(false); });
    return () => { active = false; };
  }, []);
  const expandedBackground = expandedBackgroundByVariant[variant];

  const runGiftCardAction = async (action: () => Promise<void>, fallbackMessage: string) => {
    if (giftCardBusy) return false;

    setGiftCardBusy(true);
    setErrorMessage(null);

    try {
      await action();
      return true;
    } catch (error) {
      // Only a real GraphQL error carries a shopper-facing message; network/HTTP failures do not.
      setErrorMessage(
        error instanceof MagentoGraphqlError && error.errors?.length ? error.message : fallbackMessage,
      );
      return false;
    } finally {
      setGiftCardBusy(false);
    }
  };

  const handleApplyGiftCard = async () => {
    const code = giftCardCode.trim();
    if (!code) return;

    const applied = await runGiftCardAction(
      () => applyGiftCard(code),
      "We could not apply this gift card. Please try again.",
    );
    if (applied) setGiftCardCode("");
  };

  const handleRemoveGiftCard = () => {
    void runGiftCardAction(removeGiftCard, "We could not remove this gift card. Please try again.");
  };

  const hasAppliedGiftCard = Boolean(appliedGiftCardCode);

  const body = (
    <div className="flex flex-col gap-6">
      <div className="h-px w-full shrink-0 bg-neutral300" aria-hidden />

      <div className="flex flex-col gap-3">
        <p className="font-gill text-base font-normal leading-110 text-darkblack">Payment Offers</p>
        {offersLoading ? <p className="font-gill text-sm text-gray600">Loading offers...</p> : offers.length ? (
          <>
            <div className="horizontalScroll flex items-start gap-2 overflow-auto">
              {offers.map((offer) => <OfferCard key={offer.id} offer={offer} />)}
            </div>
            <p className="font-gill text-xs text-gray600">Eligibility and final discount are confirmed in Razorpay Checkout.</p>
          </>
        ) : <p className="font-gill text-sm text-gray600">No payment offers available right now.</p>}
      </div>

      <div className="h-[0.5px] w-full shrink-0 bg-neutral300 md:hidden" aria-hidden />

      <div className="flex flex-col gap-2">
        <PromoField
          id="offers-gift-card"
          label="Have a gift card?"
          value={giftCardCode}
          onChange={(value) => {
            setGiftCardCode(value);
            if (errorMessage) setErrorMessage(null);
          }}
          onApply={() => void handleApplyGiftCard()}
          placeholder="Enter Code"
          applyLabel={giftCardBusy ? "Applying..." : "Apply"}
          disabled={giftCardBusy}
          hasError={Boolean(errorMessage)}
          showInput={!hasAppliedGiftCard}
        />

        {hasAppliedGiftCard ? (
          <AppliedGiftCardSummary
            code={appliedGiftCardCode ?? ""}
            hasProblem={Boolean(giftCardProblem)}
            onRemoveGiftCard={handleRemoveGiftCard}
            disabled={giftCardBusy}
          />
        ) : null}

        <FormFieldError
          message={errorMessage ?? (hasAppliedGiftCard ? giftCardProblem : null) ?? undefined}
        />
      </div>
    </div>
  );

  if (!expandedBackground) {
    return <div className={className}>{body}</div>;
  }

  return <div className={cn(expandedBackground, "px-4 pb-4", className)}>{body}</div>;
};

export default OffersAndDealsExpandedContent;

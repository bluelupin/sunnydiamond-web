"use client";

import { Fragment } from "react";
import ChevronDownIcon from "@/assets/Icons/ChevronDownIcon";
import type { OffersAndDealsVariant } from "@/shared/data/offersAndDealsSpec";
import { cn } from "@/shared/utils/cn";
import OffersAndDealsExpandedContent, {
  OFFERS_EMPTY_MESSAGE,
} from "./OffersAndDealsExpandedContent";

export { OFFERS_EMPTY_MESSAGE };

export type { OffersAndDealsVariant } from "@/shared/data/offersAndDealsSpec";

export type OffersAndDealsSectionProps = {
  open: boolean;
  onToggle: () => void;
  variant?: OffersAndDealsVariant;
  /** When false, only the toggle is rendered (expanded content handled separately). */
  showExpandedContent?: boolean;
  /** Adds font-normal to the label (CartPriceDetails omits this). */
  labelRegular?: boolean;
  className?: string;
  buttonClassName?: string;
};

const toggleClassesByVariant: Record<OffersAndDealsVariant, string> = {
  "sticky-gray200": "bg-gray200 px-4 py-3",
  "sticky-gray300": "bg-gray300 px-4 py-3",
  "panel-gray300": "bg-gray300 p-4",
};

export type OffersAndDealsExpandedContentProps = {
  variant?: OffersAndDealsVariant;
  className?: string;
};

export { default as OffersAndDealsExpandedContent } from "./OffersAndDealsExpandedContent";

export const OffersAndDealsEmptyMessage = ({ className }: { className?: string }) => (
  <p
    className={cn(
      "text-center font-gill text-sm font-light leading-110 text-neutral500",
      className,
    )}
  >
    {OFFERS_EMPTY_MESSAGE}
  </p>
);

const OffersAndDealsSection = ({
  open,
  onToggle,
  variant = "panel-gray300",
  showExpandedContent = true,
  labelRegular = true,
  className,
  buttonClassName,
}: OffersAndDealsSectionProps) => {
  const Wrapper = className ? "div" : Fragment;
  const wrapperProps = className ? { className } : {};

  return (
    <Wrapper {...wrapperProps}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className={cn(
          "flex w-full items-center justify-between text-left",
          toggleClassesByVariant[variant],
          buttonClassName,
        )}
      >
        <span
          className={cn(
            "font-gill text-base leading-110 text-darkblack",
            labelRegular && "font-normal",
          )}
        >
          Offers and Deals
        </span>
        <ChevronDownIcon
          aria-hidden
          className={cn(
            "size-6 shrink-0 text-darkblack transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {showExpandedContent && open ? (
        <OffersAndDealsExpandedContent variant={variant} />
      ) : null}
    </Wrapper>
  );
};

export default OffersAndDealsSection;

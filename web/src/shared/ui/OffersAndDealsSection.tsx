"use client";

import { Fragment } from "react";
import ChevronDownIcon from "@/assets/Icons/ChevronDownIcon";
import { cn } from "@/shared/utils/cn";

export const OFFERS_EMPTY_MESSAGE =
  "No offers applied yet. Check back for seasonal promotions.";

export type OffersAndDealsVariant =
  | "sticky-gray200"
  | "sticky-gray300"
  | "panel-gray300";

export type OffersAndDealsSectionProps = {
  open: boolean;
  onToggle: () => void;
  variant?: OffersAndDealsVariant;
  /** When false, only the toggle is rendered (expanded message handled separately). */
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

const expandedWrapperClassesByVariant: Record<OffersAndDealsVariant, string | null> = {
  "sticky-gray200": "bg-gray200 px-4 pb-3",
  "sticky-gray300": "bg-gray300 px-4 pb-3",
  "panel-gray300": null,
};

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
  const expandedWrapperClass = expandedWrapperClassesByVariant[variant];
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
          Offers and Deals test
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
        expandedWrapperClass ? (
          <div className={expandedWrapperClass}>
            <OffersAndDealsEmptyMessage />
          </div>
        ) : (
          <OffersAndDealsEmptyMessage />
        )
      ) : null}
    </Wrapper>
  );
};

export default OffersAndDealsSection;

"use client";

import { Fragment, type ReactNode } from "react";
import ChevronDownIcon from "@/assets/Icons/ChevronDownIcon";
import type { OffersAndDealsVariant } from "@/shared/data/offersAndDealsSpec";
import { cn } from "@/shared/utils/cn";
import OffersAndDealsExpandedContent, {
  OFFERS_EMPTY_MESSAGE,
} from "./OffersAndDealsExpandedContent";

export { OFFERS_EMPTY_MESSAGE };

export type { OffersAndDealsVariant } from "@/shared/data/offersAndDealsSpec";

const offersCollapseTransitionClassName =
  "grid min-h-0 overflow-hidden transition-[grid-template-rows] duration-500 ease-in-out motion-reduce:transition-none";

const collapsibleBackgroundByVariant: Record<OffersAndDealsVariant, string | null> = {
  "sticky-gray200": "bg-gray200",
  "sticky-gray300": "bg-gray300",
  "panel-gray300": "bg-gray300",
};

const sectionShellBackgroundByVariant: Record<OffersAndDealsVariant, string> = {
  "sticky-gray200": "bg-gray200",
  "sticky-gray300": "bg-gray300",
  "panel-gray300": "md:bg-gray300",
};

export type OffersAndDealsCollapsibleProps = {
  open: boolean;
  children: ReactNode;
  variant?: OffersAndDealsVariant;
  className?: string;
  contentClassName?: string;
};

/** Smooth height collapse wrapper shared by cart, checkout, and panel layouts. */
export const OffersAndDealsCollapsible = ({
  open,
  children,
  variant = "panel-gray300",
  className,
  contentClassName,
}: OffersAndDealsCollapsibleProps) => (
  <div
    aria-hidden={!open}
    className={cn(
      offersCollapseTransitionClassName,
      collapsibleBackgroundByVariant[variant],
      open ? "grid-rows-[1fr]" : "grid-rows-[0fr] pointer-events-none",
      className,
    )}
  >
    <div className={cn("min-h-0 overflow-hidden", contentClassName)}>{children}</div>
  </div>
);

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
  "sticky-gray200": "bg-gray300 px-4 py-3",
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
      <div className={cn("overflow-hidden", sectionShellBackgroundByVariant[variant])}>
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
              "size-6 shrink-0 text-darkblack transition-transform duration-500 ease-in-out motion-reduce:transition-none",
              open && "rotate-180",
            )}
          />
        </button>
        {showExpandedContent ? (
          <OffersAndDealsCollapsible open={open} variant={variant}>
            <OffersAndDealsExpandedContent variant={variant} className="md:px-4 md:pb-4" />
          </OffersAndDealsCollapsible>
        ) : null}
      </div>
    </Wrapper>
  );
};

export default OffersAndDealsSection;

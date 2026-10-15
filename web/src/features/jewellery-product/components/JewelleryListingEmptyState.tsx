"use client";

import FilterIcon from "@/assets/Icons/PLP/FilterIcon";
import { jewelleryListingEmptyStateContent } from "../data/content";
import { CartPrimaryButton, CartPrimaryLink } from "@/features/cart/components/CartFlowUi";
import { DetailTextLink } from "@/features/products/components/detail/shared";

type JewelleryListingEmptyStateProps = {
  onClearFilters?: () => void;
  title?: string;
  description?: string;
  clearFiltersLabel?: string;
  /** When set, clear action navigates (e.g. search empty → jewellery PLP). */
  clearFiltersHref?: string;
  /** Filter empty shows the icon by default; search empty passes false. */
  showFilterIcon?: boolean;
};

const JewelleryListingEmptyState = ({
  onClearFilters,
  title,
  description,
  clearFiltersLabel,
  clearFiltersHref,
  showFilterIcon = true,
}: JewelleryListingEmptyStateProps) => {
  const content = jewelleryListingEmptyStateContent;
  const resolvedTitle = title ?? content.filterTitle;
  const resolvedDescription = description ?? content.filterDescription;
  const resolvedClearLabel = clearFiltersLabel ?? content.clearFiltersLabel;

  return (
    <div className="flex w-full min-h-[min(400px,45vh)] items-center justify-center px-4 py-12 md:py-16">
      <div className="flex w-full max-w-[464px] flex-col items-center gap-6 text-center">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"
          className="flex size-10 items-center justify-center md:size-16" aria-hidden>
          <path d="M19.334 8H47.334L61.334 24L33.334 54L5.33398 24L19.334 8Z" stroke="#C5A156" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M33.334 8L33.334 52" stroke="#C5A156" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div className='flex w-full flex-col gap-3 lg:gap-4'>
          <h2 className="w-full font-larken text-2xl font-light leading-110 text-darkblack lg:text-[32px]">
            {resolvedTitle}
          </h2>
          <p className="w-full font-gill text-sm font-light leading-110 text-neutral500 lg:text-base">
            {resolvedDescription}
          </p>
        </div>
        {clearFiltersHref ? (
          <CartPrimaryLink
            href={clearFiltersHref}
            onClick={onClearFilters}
            className="w-full max-w-xs sm:w-auto"
          >
            {resolvedClearLabel}
          </CartPrimaryLink>
        ) : (
          <CartPrimaryButton
            type="button"
            onClick={onClearFilters}
            className="w-full max-w-xs sm:w-auto"
          >
            {resolvedClearLabel}
          </CartPrimaryButton>
        )}
      </div>
    </div>
  );
};

export default JewelleryListingEmptyState;

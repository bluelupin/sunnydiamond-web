"use client";

import PageContainer from "@/shared/ui/layout/PageContainer";
import {
  wishlistHeadingSpec,
  wishlistPageContent,
  type WishlistViewMode,
} from "@/features/wishlist/data/content";
import WishlistViewToggle from "./WishlistViewToggle";
import { cn } from "@/shared/utils/cn";

type WishlistHeadingProps = {
  productCount: number;
  viewMode: WishlistViewMode;
  onViewModeChange: (mode: WishlistViewMode) => void;
};

const WishlistHeading = ({ productCount, viewMode, onViewModeChange }: WishlistHeadingProps) => {
  const showCount = productCount > 0;
  const showViewToggle = showCount;

  return (
    <section
      aria-labelledby="wishlist-page-title"
      className="w-full border-b border-neutral300 bg-white"
    >
      <PageContainer
        className={cn(
          "flex min-h-[140px] flex-col items-center px-4 md:min-h-[95px] md:px-5",
          showViewToggle
            ? "justify-between py-6 md:justify-center md:gap-2 md:py-0"
            : "justify-center py-6 md:py-0",
        )}
      >
        <div
          className="flex flex-col items-center"
          style={{ gap: wishlistHeadingSpec.titleGap }}
        >
          <h1
            id="wishlist-page-title"
            className="text-center font-larken text-32 font-light leading-110 text-darkblack md:text-5xl"
          >
            {wishlistPageContent.title}
          </h1>

          {showCount ? (
            <p className="text-center font-gill text-base font-normal leading-110 text-neutral500 md:text-xl">
              {wishlistPageContent.productCountLabel(productCount)}
            </p>
          ) : null}
        </div>

        {showViewToggle ? (
          <WishlistViewToggle value={viewMode} onChange={onViewModeChange} />
        ) : null}
      </PageContainer>
    </section>
  );
};

export default WishlistHeading;

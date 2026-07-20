"use client";

import PageContainer from "@/shared/ui/layout/PageContainer";
import { wishlistPageContent, type WishlistViewMode } from "@/features/wishlist/data/content";
import WishlistViewToggle from "./WishlistViewToggle";
import { cn } from "@/shared/utils/cn";
import Link from "next/link";

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
      className="w-full bg-white"
    >
      <div className="flex sm:flex-row flex-col items-center justify-center sm:gap-2 bg-gray300 p-4 mt-6 sm:gap-2 gap-4">
        <Link href="" className="text-base font-gill tracking-[1.8%] uppercase font-gill font-normal text-darkblack border-b border-darkblack pb-1">LOGIN</Link>
        <p className="md:text-[18px] sm:text-base text-sm font-light leadiing-100 sm:tracking-[1%] tracking-[0%] text-darkblack">to save items and access them anytime in your wishlist</p>
      </div>
      <PageContainer
        className={cn(
          "flex flex-col items-center lg:gap-6 gap-2 justify-center gap-6 px-4 md:px-5 lg:mt-10 mt-6 mb-6",
        )}
      >
        <div className="flex flex-col items-center lg:gap-5 gap-2">
          <h1
            id="wishlist-page-title"
            className="text-center font-larken text-32 font-light leading-110 lg:text-neutral500 text-darkblack md:text-5xl"
          >
            {wishlistPageContent.title}
          </h1>
          {showCount &&
            <p className="text-center font-gill text-base font-normal leading-110 lg:text-neutral500 text-darkblack md:text-xl">
              {wishlistPageContent.productCountLabel(productCount)}
            </p>
          }
        </div>
        {showViewToggle &&
          <WishlistViewToggle value={viewMode} onChange={onViewModeChange} />
        }
      </PageContainer>
    </section>
  );
};

export default WishlistHeading;

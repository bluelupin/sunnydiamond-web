"use client";

import { useRequestAuth } from "@/features/auth/hooks/useRequestAuth";
import PageContainer from "@/shared/ui/layout/PageContainer";
import { useAuth } from "@/features/auth/context/AuthContext";
import { wishlistPageContent, type WishlistViewMode } from "@/features/wishlist/data/content";
import WishlistViewToggle from "./WishlistViewToggle";
import { cn } from "@/shared/utils/cn";

type WishlistHeadingProps = {
  productCount: number;
  viewMode: WishlistViewMode;
  onViewModeChange: (mode: WishlistViewMode) => void;
};

const WishlistHeading = ({ productCount, viewMode, onViewModeChange }: WishlistHeadingProps) => {
  const { status } = useAuth();
  const { requestAuth } = useRequestAuth();
  const showCount = productCount > 0;
  const showViewToggle = showCount;
  const isAuthenticated = status === "authenticated";

  return (
    <section
      aria-labelledby="wishlist-page-title"
      className="w-full bg-white"
    >
      {!isAuthenticated ? (
        <div className="mt-6 flex flex-col items-center justify-center gap-4 bg-gray300 p-4 sm:flex-row sm:gap-2">
          <button
            type="button"
            onClick={() => requestAuth({ returnUrl: "/wishlist" })}
            className="border-b border-darkblack pb-1 font-gill text-base font-normal uppercase tracking-[1.8%] text-darkblack"
          >
            LOGIN
          </button>
          <p className="text-sm font-light leading-100 tracking-[0%] text-darkblack sm:text-base sm:tracking-[1%] md:text-[18px]">
            to save items and access them anytime in your wishlist
          </p>
        </div>
      ) : null}
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

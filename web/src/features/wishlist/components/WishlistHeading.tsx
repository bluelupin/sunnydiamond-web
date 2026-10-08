"use client";

import { useRequestAuth } from "@/features/auth/hooks/useRequestAuth";
import { DetailTextLink } from "@/features/products/components/detail/shared";
import PageContainer from "@/shared/ui/layout/PageContainer";
import { useAuth } from "@/features/auth/context/AuthContext";
import { wishlistPageContent, type WishlistViewMode } from "@/features/wishlist/data/content";
import WishlistViewToggle from "./WishlistViewToggle";
import { cn } from "@/shared/utils/cn";

type WishlistHeadingProps = {
  productCount: number;
  viewMode: WishlistViewMode;
  onViewModeChange: (mode: WishlistViewMode) => void;
  hideTitle?: boolean;
};

const WishlistHeading = ({
  productCount,
  viewMode,
  onViewModeChange,
  hideTitle = false,
}: WishlistHeadingProps) => {
  const { status } = useAuth();
  const { requestAuth } = useRequestAuth();
  const showCount = productCount > 0;
  const showViewToggle = showCount;
  const showSignInPrompt = status === "guest";

  return (
    <section
      aria-labelledby={hideTitle ? undefined : "wishlist-page-title"}
      className="w-full bg-white"
    >
      {showSignInPrompt ? (
        <div className="mt-6 flex flex-col items-center justify-center gap-4 bg-gray300 md:p-[18px] p-4 sm:flex-row sm:gap-2">
          <DetailTextLink onClick={() => requestAuth({ returnUrl: "/wishlist" })} className="md:text-base text-sm">
            Sign in
          </DetailTextLink>
          <p className="text-sm font-light leading-100 tracking-[0%] text-darkblack sm:text-base sm:tracking-[1%] md:text-[18px]">
            To save your pieces and return to your Wishlist anytime.
          </p>
        </div>
      ) : null}
      {hideTitle ? null : (
        <PageContainer
          className={cn(
            "flex flex-col items-center lg:gap-6 gap-2 justify-center gap-6 px-4 md:px-5 mt-10 mb-6",
          )}
        >
          <div className="flex flex-col items-center gap-[21px] lg:gap-5">
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
      )}
    </section>
  );
};

export default WishlistHeading;

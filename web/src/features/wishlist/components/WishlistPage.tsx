"use client";

import { useState } from "react";
import JewelleryLoadMoreSection from "@/features/jewellery-product/components/JewelleryLoadMoreSection";
import { useWishlist } from "@/features/wishlist/context/WishlistContext";
import { WISHLIST_VISIBLE_CAP } from "@/features/wishlist/constants";
import { useAddToBagWithDrawer } from "@/features/cart/hooks/useAddToBagWithDrawer";
import { useMagentoWishlistProducts } from "@/hooks/magento/useMagentoWishlistProducts";
import { wishlistPageContent, type WishlistViewMode } from "@/features/wishlist/data/content";
import type { JewelleryListingProduct } from "@/features/jewellery-product/types";
import { cn } from "@/shared/utils/cn";
import WishlistEmptyState from "./WishlistEmptyState";
import WishlistGrid from "./WishlistGrid";
import WishlistList from "./WishlistList";
import WishlistHeading from "./WishlistHeading";
import WishlistAddToBagPanel from "./WishlistAddToBagPanel";
import { WishlistPageGridSkeleton } from "./skeletons/WishlistPageSkeleton";
import { prefetchWishlistProductDetail } from "@/features/wishlist/utils/wishlistProductDetailPrefetch";

const WishlistPage = () => {
  const { wishlistedIds, toggleWishlist } = useWishlist();
  const { addToBagAndOpenDrawer } = useAddToBagWithDrawer();
  const { products: wishlistProducts, isLoading, error } = useMagentoWishlistProducts(wishlistedIds);
  const [visibleCount, setVisibleCount] = useState(WISHLIST_VISIBLE_CAP);
  const [viewMode, setViewMode] = useState<WishlistViewMode>("grid");
  const [addToBagProduct, setAddToBagProduct] = useState<JewelleryListingProduct | null>(null);

  const visibleProducts = wishlistProducts.slice(0, visibleCount);
  const hasMore = visibleCount < wishlistProducts.length;
  const showPagination = wishlistProducts.length > WISHLIST_VISIBLE_CAP;
  const showEmptyState = !isLoading && !error && wishlistProducts.length === 0;
  const showLoadError = !isLoading && Boolean(error) && wishlistedIds.length > 0;
  const needsFooterMargin =
    wishlistProducts.length > 0 && !showPagination && !showEmptyState && !showLoadError;

  const handleOpenAddToBag = (product: JewelleryListingProduct) => {
    prefetchWishlistProductDetail(product.urlKey);
    setAddToBagProduct(product);
  };

  const handlePanelAddToBag = async (payload: Parameters<typeof addToBagAndOpenDrawer>[0]) => {
    setAddToBagProduct(null);
    await addToBagAndOpenDrawer(payload);
  };

  if (isLoading && wishlistedIds.length > 0) {
    const skeletonCardCount = Math.min(wishlistedIds.length, WISHLIST_VISIBLE_CAP);

    return (
      <section className="min-h-screen pb-[calc(64px+env(safe-area-inset-bottom,0px))] md:pb-0">
        <WishlistHeading
          productCount={wishlistedIds.length}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
        <div className="bg-gray200">
          <WishlistPageGridSkeleton cardCount={skeletonCardCount} />
        </div>
        <WishlistAddToBagPanel
          open={Boolean(addToBagProduct)}
          product={addToBagProduct}
          onClose={() => setAddToBagProduct(null)}
          onAddToBag={handlePanelAddToBag}
        />
      </section>
    );
  }

  return (
    <section className="min-h-screen pb-[calc(64px+env(safe-area-inset-bottom,0px))] md:pb-0">
      <WishlistHeading
        productCount={wishlistProducts.length}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <div
        className={cn(
          "bg-gray200",
          (showEmptyState || showLoadError || needsFooterMargin) && "md:mb-24 mb-6",
        )}
      >
        {showLoadError ? (
          <div className="mx-auto w-full max-w-1440 px-4 py-6 md:px-8 md:py-10 lg:px-10 2xl:max-w-1920 2xl:px-[60px]">
            <p className="text-center font-gill text-base font-light leading-110 text-neutral500" role="alert">
              {wishlistPageContent.loadErrorMessage}
            </p>
          </div>
        ) : showEmptyState ? (
          <div className="mx-auto w-full max-w-1440 px-4 py-6 md:px-8 md:py-10 lg:px-10 2xl:max-w-1920 2xl:px-[60px]">
            <WishlistEmptyState />
          </div>
        ) : wishlistProducts.length > 0 ? (
          <div
            className={cn(
              "mx-auto w-full max-w-1440 2xl:max-w-1920 px-0 md:px-8 lg:px-10 2xl:px-[60px]",
            )}
          >
            <div className={viewMode === "list" ? "hidden md:block" : "block"}>
              <WishlistGrid
                products={visibleProducts}
                onRemove={(product) => toggleWishlist(product.sku)}
                onAddToBag={handleOpenAddToBag}
              />
            </div>

            {viewMode === "list" ? (
              <div className="md:hidden">
                <WishlistList
                  products={visibleProducts}
                  onRemove={(product) => toggleWishlist(product.sku)}
                  onAddToBag={handleOpenAddToBag}
                />
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      {showPagination ? (
        <div className="bg-white">
          <JewelleryLoadMoreSection
            visibleCount={visibleProducts.length}
            totalCount={wishlistProducts.length}
            hasMore={hasMore}
            onLoadMore={() => setVisibleCount((count) => count + WISHLIST_VISIBLE_CAP)}
          />
        </div>
      ) : null}

      <WishlistAddToBagPanel
        open={Boolean(addToBagProduct)}
        product={addToBagProduct}
        onClose={() => setAddToBagProduct(null)}
        onAddToBag={handlePanelAddToBag}
      />
    </section>
  );
};

export default WishlistPage;

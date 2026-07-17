"use client";

import { useMemo, useState } from "react";
import PageContainer from "@/shared/ui/layout/PageContainer";
import ScrollReveal from "@/shared/ui/ScrollReveal";
import { PAGE_SIZE } from "@/features/jewellery-product/data/filters";
import JewelleryLoadMoreSection from "@/features/jewellery-product/components/JewelleryLoadMoreSection";
import { useWishlist } from "@/features/wishlist/context/WishlistContext";
import { useCart } from "@/features/cart/context/CartContext";
import { useToast } from "@/shared/hooks/use-toast";
import { getProductById } from "@/features/products/data/products";
import { resolveWishlistProducts, getWishlistRemovalId } from "@/features/wishlist/utils/resolveWishlistProducts";
import type { WishlistViewMode } from "@/features/wishlist/data/content";
import { cn } from "@/shared/utils/cn";
import WishlistEmptyState from "./WishlistEmptyState";
import WishlistGrid from "./WishlistGrid";
import WishlistList from "./WishlistList";
import WishlistHeading from "./WishlistHeading";

const WishlistPage = () => {
  const { wishlistedIds, toggleWishlist } = useWishlist();
  const { addItem } = useCart();
  const { toast } = useToast();
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [viewMode, setViewMode] = useState<WishlistViewMode>("grid");

  const wishlistProducts = useMemo(
    () => resolveWishlistProducts(wishlistedIds),
    [wishlistedIds],
  );

  const visibleProducts = wishlistProducts.slice(0, visibleCount);
  const hasMore = visibleCount < wishlistProducts.length;

  const handleAddToBag = (productId: string, productName: string) => {
    const baseId = productId.split("-")[0];
    const product = getProductById(baseId);

    if (!product) return;

    addItem(product);
    toast({
      title: "Added to bag",
      description: `${productName} has been added to your bag.`,
    });
  };

  return (
    <>
      <WishlistHeading
        productCount={wishlistProducts.length}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <div className="bg-gray200 mb-[110px]">
        {wishlistProducts.length === 0 ? (
          <PageContainer className="md:py-10 py-6">
            <WishlistEmptyState />
          </PageContainer>
        ) : (
          <>
            <div
              className={cn("mx-auto w-full 2xl:max-w-1920 max-w-1440 px-5 md:px-8 lg:px-10 2xl:px-[60px]",)}>
              <div className={viewMode === "list" ? "hidden md:block" : "block"}>
                <WishlistGrid
                  products={visibleProducts}
                  onRemove={(productId) =>
                    toggleWishlist(getWishlistRemovalId(productId, wishlistedIds))
                  }
                  onAddToBag={handleAddToBag}
                />
              </div>

              {viewMode === "list" ? (
                <div className="md:hidden">
                  <WishlistList
                    products={visibleProducts}
                    onRemove={(productId) =>
                      toggleWishlist(getWishlistRemovalId(productId, wishlistedIds))
                    }
                    onAddToBag={handleAddToBag}
                  />
                </div>
              ) : null}
            </div>

            {/* <ScrollReveal delayMs={40}>
              <div className="pb-20">
                <JewelleryLoadMoreSection
                  visibleCount={visibleProducts.length}
                  totalCount={wishlistProducts.length}
                  hasMore={hasMore}
                  onLoadMore={() => setVisibleCount((count) => count + PAGE_SIZE)}
                />
              </div>
            </ScrollReveal> */}
          </>
        )}
      </div>
    </>
  );
};

export default WishlistPage;

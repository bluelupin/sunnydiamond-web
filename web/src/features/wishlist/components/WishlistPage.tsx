"use client";

import { useMemo, useState } from "react";
import PageContainer from "@/shared/ui/layout/PageContainer";
import { PAGE_SIZE } from "@/features/jewellery-product/data/filters";
import { useWishlist } from "@/features/wishlist/context/WishlistContext";
import { useCart } from "@/features/cart/context/CartContext";
import { useCartUI } from "@/features/cart/context/CartUIContext";
import { resolveWishlistProducts, getWishlistRemovalId } from "@/features/wishlist/utils/resolveWishlistProducts";
import type { WishlistViewMode } from "@/features/wishlist/data/content";
import type { AddToBagPayload } from "@/features/cart/types/cart.types";
import { cn } from "@/shared/utils/cn";
import WishlistEmptyState from "./WishlistEmptyState";
import WishlistGrid from "./WishlistGrid";
import WishlistList from "./WishlistList";
import WishlistHeading from "./WishlistHeading";
import WishlistAddToBagPanel from "./WishlistAddToBagPanel";

const WishlistPage = () => {
  const { wishlistedIds, toggleWishlist } = useWishlist();
  const { addItem } = useCart();
  const { openBagDrawer } = useCartUI();
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [viewMode, setViewMode] = useState<WishlistViewMode>("grid");
  const [addToBagProductId, setAddToBagProductId] = useState<string | null>(null);

  const wishlistProducts = useMemo(
    () => resolveWishlistProducts(wishlistedIds),
    [wishlistedIds],
  );

  const visibleProducts = wishlistProducts.slice(0, visibleCount);

  const handleAddToBagClick = (productId: string) => {
    setAddToBagProductId(productId);
  };

  const handlePanelAddToBag = (payload: AddToBagPayload) => {
    const result = addItem(payload);
    setAddToBagProductId(null);
    openBagDrawer(result);
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
          <PageContainer className="py-6 md:py-10">
            <WishlistEmptyState />
          </PageContainer>
        ) : (
          <div
            className={cn(
              "mx-auto w-full max-w-1440 2xl:max-w-1920 px-0 md:px-8 lg:px-10 2xl:px-[60px]",
            )}
          >
            <div className={viewMode === "list" ? "hidden md:block" : "block"}>
              <WishlistGrid
                products={visibleProducts}
                onRemove={(productId) =>
                  toggleWishlist(getWishlistRemovalId(productId, wishlistedIds))
                }
                onAddToBag={handleAddToBagClick}
              />
            </div>

            {viewMode === "list" ? (
              <div className="md:hidden">
                <WishlistList
                  products={visibleProducts}
                  onRemove={(productId) =>
                    toggleWishlist(getWishlistRemovalId(productId, wishlistedIds))
                  }
                  onAddToBag={handleAddToBagClick}
                />
              </div>
            ) : null}
          </div>
        )}
      </div>

      <WishlistAddToBagPanel
        open={Boolean(addToBagProductId)}
        productId={addToBagProductId}
        onClose={() => setAddToBagProductId(null)}
        onAddToBag={handlePanelAddToBag}
      />
    </>
  );
};

export default WishlistPage;

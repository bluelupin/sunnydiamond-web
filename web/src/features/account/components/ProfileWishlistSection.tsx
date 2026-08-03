"use client";

import { useState } from "react";
import JewelleryLoadMoreSection from "@/features/jewellery-product/components/JewelleryLoadMoreSection";
import { PAGE_SIZE } from "@/features/jewellery-product/data/filters";
import { useCart } from "@/features/cart/context/CartContext";
import { useCartUI } from "@/features/cart/context/CartUIContext";
import { useWishlist } from "@/features/wishlist/context/WishlistContext";
import WishlistAddToBagPanel from "@/features/wishlist/components/WishlistAddToBagPanel";
import WishlistGrid from "@/features/wishlist/components/WishlistGrid";
import WishlistList from "@/features/wishlist/components/WishlistList";
import WishlistViewToggle from "@/features/wishlist/components/WishlistViewToggle";
import { wishlistPageContent, type WishlistViewMode } from "@/features/wishlist/data/content";
import { useMagentoWishlistProducts } from "@/hooks/magento/useMagentoWishlistProducts";
import type { AddToBagPayload } from "@/features/cart/types/cart.types";
import type { JewelleryListingProduct } from "@/features/jewellery-product/types";
import { cn } from "@/shared/utils/cn";
import { ProfileWishlistEmptyState } from "./ProfileWishlistEmptyState";

function WishlistSkeleton() {
  return (
    <div
      className="grid grid-cols-2 gap-1 md:grid-cols-2 md:gap-2 lg:grid-cols-3"
      aria-busy="true"
      aria-label="Loading wishlist"
    >
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="h-[280px] animate-pulse bg-gray300 md:h-[420px] lg:h-[496px]" />
      ))}
    </div>
  );
}

const ProfileWishlistSection = () => {
  const { wishlistedIds, toggleWishlist } = useWishlist();
  const { addItem } = useCart();
  const { openBagDrawer } = useCartUI();
  const { products: wishlistProducts, isLoading } = useMagentoWishlistProducts(wishlistedIds);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [viewMode, setViewMode] = useState<WishlistViewMode>("grid");
  const [addToBagProduct, setAddToBagProduct] = useState<JewelleryListingProduct | null>(null);

  const visibleProducts = wishlistProducts.slice(0, visibleCount);
  const hasMore = visibleCount < wishlistProducts.length;
  const showEmptyState = !isLoading && wishlistProducts.length === 0;

  const handlePanelAddToBag = async (payload: AddToBagPayload) => {
    const result = await addItem(payload);
    setAddToBagProduct(null);
    openBagDrawer(result);
  };

  if (isLoading && wishlistedIds.length > 0) {
    return (
      <div className="-mx-4 bg-gray200 py-6 md:mx-0">
        <WishlistSkeleton />
      </div>
    );
  }

  if (showEmptyState) {
    return <ProfileWishlistEmptyState />;
  }

  if (wishlistProducts.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-6">
        <p className="font-gill text-base font-normal leading-110 text-neutral500">
          {wishlistPageContent.productCountLabel(wishlistProducts.length)}
        </p>
        <WishlistViewToggle value={viewMode} onChange={setViewMode} />
      </div>

      <div className="-mx-4 bg-gray200 md:mx-0">
        <div className={cn(viewMode === "list" ? "hidden md:block" : "block")}>
          <WishlistGrid
            products={visibleProducts}
            onRemove={(product) => toggleWishlist(product.sku)}
            onAddToBag={setAddToBagProduct}
          />
        </div>

        {viewMode === "list" ? (
          <div className="md:hidden">
            <WishlistList
              products={visibleProducts}
              onRemove={(product) => toggleWishlist(product.sku)}
              onAddToBag={setAddToBagProduct}
            />
          </div>
        ) : null}
      </div>

      {hasMore ? (
        <JewelleryLoadMoreSection
          visibleCount={visibleProducts.length}
          totalCount={wishlistProducts.length}
          hasMore={hasMore}
          onLoadMore={() => setVisibleCount((count) => count + PAGE_SIZE)}
        />
      ) : null}

      <WishlistAddToBagPanel
        open={Boolean(addToBagProduct)}
        product={addToBagProduct}
        onClose={() => setAddToBagProduct(null)}
        onAddToBag={handlePanelAddToBag}
      />
    </div>
  );
};

export default ProfileWishlistSection;

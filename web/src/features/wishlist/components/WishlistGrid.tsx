"use client";

import ScrollReveal from "@/shared/ui/ScrollReveal";
import { cn } from "@/shared/utils/cn";
import type { JewelleryListingProduct } from "@/features/jewellery-product/types";
import WishlistCard from "./WishlistCard";

type WishlistGridVariant = "page" | "profile";

type WishlistGridProps = {
  products: JewelleryListingProduct[];
  onRemove: (product: JewelleryListingProduct) => void;
  onAddToBag: (product: JewelleryListingProduct) => void;
  /** Profile uses a narrower content column — 3-up grid from `lg` with compact cards. */
  variant?: WishlistGridVariant;
};

const WISHLIST_GRID_CLASS: Record<WishlistGridVariant, string> = {
  page: "grid w-full grid-cols-2 gap-1 md:grid-cols-2 md:gap-2 lg:grid-cols-3",
  profile: "grid w-full grid-cols-2 gap-1 md:grid-cols-2 md:gap-2 lg:grid-cols-2 lg:gap-6 lg:bg-transparent bg-gray200",
};

const WishlistGrid = ({
  products,
  onRemove,
  onAddToBag,
  variant = "page",
}: WishlistGridProps) => {
  const cardLayout = variant === "profile" ? "profile" : "default";

  return (
    <ScrollReveal threshold={0.06} rootMargin="0px 0px -4% 0px">
      <div className={cn(WISHLIST_GRID_CLASS[variant])}>
        {products.map((product) => (
          <WishlistCard
            key={product.sku}
            product={product}
            layout={cardLayout}
            onRemove={() => onRemove(product)}
            onAddToBag={() => onAddToBag(product)}
          />
        ))}
      </div>
    </ScrollReveal>
  );
};

export default WishlistGrid;

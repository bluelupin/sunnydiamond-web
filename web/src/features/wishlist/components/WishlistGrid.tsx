"use client";

import ScrollReveal from "@/shared/ui/ScrollReveal";
import type { JewelleryListingProduct } from "@/features/jewellery-product/types";
import WishlistCard from "./WishlistCard";

type WishlistGridProps = {
  products: JewelleryListingProduct[];
  onRemove: (product: JewelleryListingProduct) => void;
  onAddToBag: (product: JewelleryListingProduct) => void;
  variant?: "page" | "profile";
};

const WishlistGrid = ({ products, onRemove, onAddToBag, variant = "page" }: WishlistGridProps) => {
  const gridClassName =
    variant === "profile"
      ? "grid w-full grid-cols-2 gap-6"
      : "grid w-full grid-cols-2 gap-1 md:grid-cols-2 md:gap-2 lg:grid-cols-3";

  return (
    <ScrollReveal threshold={0.06} rootMargin="0px 0px -4% 0px">
      <div className={gridClassName}>
        {products.map((product) => (
          <WishlistCard
            key={product.sku}
            product={product}
            variant={variant}
            onRemove={() => onRemove(product)}
            onAddToBag={() => onAddToBag(product)}
          />
        ))}
      </div>
    </ScrollReveal>
  );
};

export default WishlistGrid;

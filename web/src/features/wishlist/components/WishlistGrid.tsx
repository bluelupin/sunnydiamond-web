"use client";

import ScrollReveal from "@/shared/ui/ScrollReveal";
import type { JewelleryListingProduct } from "@/features/jewellery-product/types";
import WishlistCard from "./WishlistCard";

type WishlistGridProps = {
  products: JewelleryListingProduct[];
  onRemove: (product: JewelleryListingProduct) => void;
  onAddToBag: (product: JewelleryListingProduct) => void;
};

const WishlistGrid = ({ products, onRemove, onAddToBag }: WishlistGridProps) => {
  return (
    <ScrollReveal threshold={0.06} rootMargin="0px 0px -4% 0px">
      <div className="grid w-full grid-cols-2 gap-1 md:grid-cols-2 md:gap-2 lg:grid-cols-3">
        {products.map((product) => (
          <WishlistCard
            key={product.sku}
            product={product}
            onRemove={() => onRemove(product)}
            onAddToBag={() => onAddToBag(product)}
          />
        ))}
      </div>
    </ScrollReveal>
  );
};

export default WishlistGrid;

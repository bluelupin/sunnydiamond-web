"use client";

import ScrollReveal from "@/shared/ui/ScrollReveal";
import type { JewelleryListingProduct } from "@/features/jewellery-product/types";
import WishlistCard from "./WishlistCard";

type WishlistGridProps = {
  products: JewelleryListingProduct[];
  onRemove: (productId: string) => void;
  onAddToBag: (productId: string) => void;
};

const WishlistGrid = ({ products, onRemove, onAddToBag }: WishlistGridProps) => {
  return (
    <ScrollReveal threshold={0.06} rootMargin="0px 0px -4% 0px">
      <div className="grid w-full grid-cols-2 md:grid-cols-2 lg:grid-cols-3 md:gap-2 gap-1">
        {products.map((product, index) => (
          <WishlistCard
            key={`${product.id}-${index}`}
            product={product}
            onRemove={() => onRemove(product.id)}
            onAddToBag={() => onAddToBag(product.id)}
          />
        ))}
      </div>
    </ScrollReveal>
  );
};

export default WishlistGrid;

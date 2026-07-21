"use client";

import JewelleryProductCard from "./JewelleryProductCard";
import ScrollReveal from "@/shared/ui/ScrollReveal";
import type { JewelleryListingProduct } from "../types";

interface JewelleryProductGridProps {
  products: JewelleryListingProduct[];
  isWishlisted: (productId: string) => boolean;
  onToggleWishlist?: (productId: string) => void;
}

const JewelleryProductGrid = ({
  products,
  isWishlisted,
  onToggleWishlist,
}: JewelleryProductGridProps) => {
  return (
    <ScrollReveal threshold={0.06} rootMargin="0px 0px -4% 0px">
      <div className="grid w-full grid-cols-2 md:grid-cols-3">
        {products.map((product) => (
          <JewelleryProductCard
            key={product.id}
            title={product.name}
            price={product.price}
            primaryImage={product.primaryImage}
            modalImage={product.modalImage}
            hoverImage={product.hoverImage}
            href={`/product/${product.urlKey}`}
            isBestseller={product.isBestseller}
            isWishlisted={isWishlisted(product.id)}
            onToggleWishlist={
              onToggleWishlist ? () => onToggleWishlist(product.id) : undefined
            }
          />
        ))}
      </div>
    </ScrollReveal>
  );
};

export default JewelleryProductGrid;

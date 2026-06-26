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
    <div className="grid w-full grid-cols-2 gap-[8px] md:grid-cols-3">
      {products.map((product, index) => {
        const productId = product.id.split("-")[0];
        const columnIndex = index % 2;
        const rowIndex = Math.floor(index / 2);

        return (
          <ScrollReveal
            key={product.id}
            delayMs={Math.min(rowIndex * 60 + columnIndex * 40, 360)}
            threshold={0.08}
            rootMargin="0px 0px -4% 0px"
          >
            <JewelleryProductCard
              title={product.name}
              price={product.price}
              primaryImage={product.primaryImage}
              modalImage={product.modalImage}
              hoverImage={product.hoverImage}
              href={`/product/${productId}`}
              isBestseller={product.isBestseller}
              isWishlisted={isWishlisted(product.id)}
              onToggleWishlist={
                onToggleWishlist ? () => onToggleWishlist(product.id) : undefined
              }
            />
          </ScrollReveal>
        );
      })}
    </div>
  );
};

export default JewelleryProductGrid;

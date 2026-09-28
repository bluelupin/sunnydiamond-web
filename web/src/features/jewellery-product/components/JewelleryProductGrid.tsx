"use client";

import { useCallback, useState } from "react";
import JewelleryProductCard from "./JewelleryProductCard";
import { PLP_PRIORITY_IMAGE_COUNT } from "../utils/jewelleryPlpImage";
import type { JewelleryListingProduct } from "../types";

interface JewelleryProductGridProps {
  products: JewelleryListingProduct[];
  isWishlisted: (productId: string) => boolean;
  onToggleWishlist?: (productId: string) => void;
  metalPurityQuery?: string;
}

const plpGridCellBorderClassName =
  "[&>*]:border-b [&>*]:border-solid [&>*]:border-neutral300 max-md:[&>*:not(:nth-child(2n))]:border-r md:[&>*:not(:nth-child(3n))]:border-r md:[&>*:nth-child(-n+3)]:border-t";

const JewelleryProductGrid = ({
  products,
  isWishlisted,
  onToggleWishlist,
  metalPurityQuery,
}: JewelleryProductGridProps) => {
  const [hoveredProductId, setHoveredProductId] = useState<string | null>(null);

  const handleHoverStart = useCallback((productId: string) => {
    setHoveredProductId(productId);
  }, []);

  const handleHoverEnd = useCallback((productId: string) => {
    setHoveredProductId((current) => (current === productId ? null : current));
  }, []);

  const handleGridPointerLeave = useCallback(() => {
    setHoveredProductId(null);
  }, []);

  return (
    <div
      className={`grid w-full min-w-0 grid-cols-2 items-stretch md:grid-cols-3 ${plpGridCellBorderClassName}`}
      onPointerLeave={handleGridPointerLeave}
    >
      {products.map((product, index) => (
        <JewelleryProductCard
          key={product.id}
          title={product.name}
          price={product.price}
          primaryImage={product.primaryImage}
          modalImage={product.modalImage}
          hoverImage={product.hoverImage}
          href={
            metalPurityQuery
              ? `/product/${product.urlKey}?purity=${encodeURIComponent(metalPurityQuery)}`
              : `/product/${product.urlKey}`
          }
          isBestseller={product.isBestseller}
          isWishlisted={isWishlisted(product.id)}
          isHoverActive={hoveredProductId === product.id}
          onHoverStart={() => handleHoverStart(product.id)}
          onHoverEnd={() => handleHoverEnd(product.id)}
          priorityImage={index < PLP_PRIORITY_IMAGE_COUNT}
          onToggleWishlist={
            onToggleWishlist ? () => onToggleWishlist(product.id) : undefined
          }
        />
      ))}
    </div>
  );
};

export default JewelleryProductGrid;

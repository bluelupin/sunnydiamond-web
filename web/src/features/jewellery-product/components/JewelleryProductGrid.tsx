"use client";

import { useCallback, useMemo, useState } from "react";
import JewelleryProductCard from "./JewelleryProductCard";
import JewelleryListingPromoCard from "./JewelleryListingPromoCard";
import { useJewelleryPlpViewport } from "../hooks/useJewelleryPlpViewport";
import { PLP_PRIORITY_IMAGE_COUNT } from "../utils/jewelleryPlpImage";
import { buildJewelleryPlpGridItems } from "../utils/plpListingCards";
import type { JewelleryListingProduct } from "../types";
import type { NormalizedProductListingCard } from "@/services/product-landing/product-landing-page.types";

interface JewelleryProductGridProps {
  products: JewelleryListingProduct[];
  listingCards?: readonly NormalizedProductListingCard[];
  isWishlisted: (productId: string) => boolean;
  onToggleWishlist?: (productId: string) => void;
  metalPurityQuery?: string;
}

const plpGridCellBorderClassName =
  "[&>*]:border-b [&>*]:border-solid [&>*]:border-neutral300 max-md:[&>*:not(:nth-child(2n))]:border-r md:[&>*:not(:nth-child(3n))]:border-r md:[&>*:nth-child(-n+3)]:border-t";

const JewelleryProductGrid = ({
  products,
  listingCards = [],
  isWishlisted,
  onToggleWishlist,
  metalPurityQuery,
}: JewelleryProductGridProps) => {
  const viewport = useJewelleryPlpViewport();
  const [hoveredProductId, setHoveredProductId] = useState<string | null>(null);

  const gridItems = useMemo(
    () => buildJewelleryPlpGridItems(products, listingCards, viewport),
    [listingCards, products, viewport],
  );

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
      {gridItems.map((item) => {
        if (item.kind === "listing-card") {
          return <JewelleryListingPromoCard key={`listing-card-${item.card.id}`} card={item.card} />;
        }

        const { product, productIndex } = item;
        return (
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
            priorityImage={productIndex < PLP_PRIORITY_IMAGE_COUNT}
            onToggleWishlist={
              onToggleWishlist ? () => onToggleWishlist(product.id) : undefined
            }
          />
        );
      })}
    </div>
  );
};

export default JewelleryProductGrid;

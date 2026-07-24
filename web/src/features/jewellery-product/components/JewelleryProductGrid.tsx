"use client";

import JewelleryProductCard from "./JewelleryProductCard";
import { PLP_PRIORITY_IMAGE_COUNT } from "../utils/jewelleryPlpImage";
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
    <div className="grid w-full grid-cols-2 md:grid-cols-3">
      {products.map((product, index) => (
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

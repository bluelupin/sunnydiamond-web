"use client";

import type { JewelleryListingProduct } from "@/features/jewellery-product/types";
import WishlistCard from "./WishlistCard";

type WishlistGridProps = {
  products: JewelleryListingProduct[];
  onRemove: (productId: string) => void;
  onAddToBag: (productId: string, productName: string) => void;
};

const WishlistGrid = ({ products, onRemove, onAddToBag }: WishlistGridProps) => {
  return (
    <div className="grid w-full grid-cols-2 md:grid-cols-3 md:gap-6">
      {products.map((product, index) => (
        <WishlistCard
          key={`${product.id}-${index}`}
          product={product}
          onRemove={() => onRemove(product.id)}
          onAddToBag={() => onAddToBag(product.id, product.name)}
        />
      ))}
    </div>
  );
};

export default WishlistGrid;

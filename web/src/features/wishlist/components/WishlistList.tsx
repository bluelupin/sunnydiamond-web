"use client";

import type { JewelleryListingProduct } from "@/features/jewellery-product/types";
import WishlistListItem from "./WishlistListItem";

type WishlistListProps = {
  products: JewelleryListingProduct[];
  onRemove: (productId: string) => void;
  onAddToBag: (productId: string) => void;
};

const WishlistList = ({ products, onRemove, onAddToBag }: WishlistListProps) => {
  return (
    <div className="flex w-full flex-col items-center justify-center md:hidden">
      {products.map((product, index) => (
        <WishlistListItem
          key={`${product.id}-${index}`}
          product={product}
          onRemove={() => onRemove(product.id)}
          onAddToBag={() => onAddToBag(product.id)}
        />
      ))}
    </div>
  );
};

export default WishlistList;

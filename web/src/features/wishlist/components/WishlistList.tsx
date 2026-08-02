"use client";

import type { JewelleryListingProduct } from "@/features/jewellery-product/types";
import WishlistListItem from "./WishlistListItem";

type WishlistListProps = {
  products: JewelleryListingProduct[];
  onRemove: (product: JewelleryListingProduct) => void;
  onAddToBag: (product: JewelleryListingProduct) => void;
};

const WishlistList = ({ products, onRemove, onAddToBag }: WishlistListProps) => {
  return (
    <div className="flex w-full flex-col items-center justify-center md:hidden">
      {products.map((product) => (
        <WishlistListItem
          key={product.sku}
          product={product}
          onRemove={() => onRemove(product)}
          onAddToBag={() => onAddToBag(product)}
        />
      ))}
    </div>
  );
};

export default WishlistList;

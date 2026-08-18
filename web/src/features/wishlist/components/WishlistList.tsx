"use client";

import type { JewelleryListingProduct } from "@/features/jewellery-product/types";
import WishlistListItem from "./WishlistListItem";

type WishlistListVariant = "page" | "profile";

type WishlistListProps = {
  products: JewelleryListingProduct[];
  onRemove: (product: JewelleryListingProduct) => void;
  onAddToBag: (product: JewelleryListingProduct) => void;
  variant?: WishlistListVariant;
};

const WishlistList = ({
  products,
  onRemove,
  onAddToBag,
  variant = "page",
}: WishlistListProps) => {
  const itemLayout = variant === "profile" ? "profile" : "default";

  return (
    <div className="flex w-full flex-col items-center justify-center md:hidden">
      {products.map((product) => (
        <WishlistListItem
          key={product.sku}
          product={product}
          layout={itemLayout}
          onRemove={() => onRemove(product)}
          onAddToBag={() => onAddToBag(product)}
        />
      ))}
    </div>
  );
};

export default WishlistList;

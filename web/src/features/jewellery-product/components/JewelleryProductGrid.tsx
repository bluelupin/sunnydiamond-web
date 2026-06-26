import JewelleryProductCard from "./JewelleryProductCard";
import type { JewelleryListingProduct } from "../types";

interface JewelleryProductGridProps {
  products: JewelleryListingProduct[];
  wishlistedIds?: string[];
  onToggleWishlist?: (productId: string) => void;
}

const JewelleryProductGrid = ({
  products,
  wishlistedIds = [],
  onToggleWishlist,
}: JewelleryProductGridProps) => {
  return (
    <div className="grid w-full grid-cols-2 gap-[8px] md:grid-cols-3">
      {products.map((product) => {
        const productId = product.id.split("-")[0];

        return (
          <JewelleryProductCard
            key={product.id}
            title={product.name}
            price={product.price}
            primaryImage={product.primaryImage}
            hoverImage={product.hoverImage}
            href={`/product/${productId}`}
            isBestseller={product.isBestseller}
            isWishlisted={wishlistedIds.includes(product.id)}
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

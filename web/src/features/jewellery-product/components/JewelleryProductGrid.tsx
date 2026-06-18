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
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
      {products.map((product) => {
        const productId = product.id.split("-")[0];

        return (
          <JewelleryProductCard
            key={product.id}
            title={product.name}
            category={product.category}
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

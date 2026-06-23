import JewelleryProductCard from "./JewelleryProductCard";
import JewelleryProductCardMobile from "./JewelleryProductCardMobile";
import { chunkProducts, getMobileCardVariant } from "../utils/mobileCardLayout";
import type { JewelleryListingProduct } from "../types";

interface JewelleryProductGridProps {
  products: JewelleryListingProduct[];
  wishlistedIds?: string[];
  onToggleWishlist?: (productId: string) => void;
}

const CENTER_BADGE_INDICES = new Set([3, 8]);

const JewelleryProductGrid = ({
  products,
  wishlistedIds = [],
  onToggleWishlist,
}: JewelleryProductGridProps) => {
  const mobileRows = chunkProducts(products, 2);

  return (
    <>
      <div className="flex flex-col gap-1 bg-gray200 md:hidden">
        {mobileRows.map((row, rowIndex) => (
          <div key={`mobile-row-${rowIndex}`} className="flex w-full items-stretch gap-1">
            {row.map((product, colIndex) => {
              const globalIndex = rowIndex * 2 + colIndex;
              const productId = product.id.split("-")[0];
              const variant = getMobileCardVariant(globalIndex);

              return (
                <JewelleryProductCardMobile
                  key={product.id}
                  title={product.name}
                  price={product.price}
                  primaryImage={product.primaryImage}
                  hoverImage={product.hoverImage}
                  href={`/product/${productId}`}
                  variant={variant}
                  isBestseller={product.isBestseller}
                  isWishlisted={wishlistedIds.includes(product.id)}
                  badgeStyle={CENTER_BADGE_INDICES.has(globalIndex) ? "center-white" : "top-gold"}
                  onToggleWishlist={
                    onToggleWishlist ? () => onToggleWishlist(product.id) : undefined
                  }
                />
              );
            })}
          </div>
        ))}
      </div>

      <div className="hidden md:grid md:grid-cols-3 md:gap-6 lg:gap-8">
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
    </>
  );
};

export default JewelleryProductGrid;

import JewelleryProductCard from "./JewelleryProductCard";
import {
  getDesktopCardVariant,
  getMobileBestsellerBadgeStyle,
  getMobileCardVariant,
} from "../utils/cardLayout";
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
    <div className="grid grid-cols-2 gap-1 bg-gray200 md:grid-cols-3 md:gap-2">
      {products.map((product, index) => {
        const productId = product.id.split("-")[0];
        const mobileVariant = getMobileCardVariant(index);
        const desktopVariant = getDesktopCardVariant(index);
        const sharedProps = {
          title: product.name,
          price: product.price,
          primaryImage: product.primaryImage,
          hoverImage: product.hoverImage,
          href: `/product/${productId}`,
          isBestseller: product.isBestseller,
          isWishlisted: wishlistedIds.includes(product.id),
          onToggleWishlist: onToggleWishlist ? () => onToggleWishlist(product.id) : undefined,
        };

        if (mobileVariant === desktopVariant) {
          return (
            <JewelleryProductCard
              key={product.id}
              {...sharedProps}
              variant={mobileVariant}
              viewport="responsive"
              badgeStyle={getMobileBestsellerBadgeStyle(index)}
            />
          );
        }

        return (
          <div key={product.id} className="contents">
            <div className="md:hidden">
              <JewelleryProductCard
                {...sharedProps}
                variant={mobileVariant}
                viewport="mobile"
                badgeStyle={getMobileBestsellerBadgeStyle(index)}
              />
            </div>
            <div className="hidden md:block">
              <JewelleryProductCard
                {...sharedProps}
                variant={desktopVariant}
                viewport="desktop"
                badgeStyle="center-white"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default JewelleryProductGrid;

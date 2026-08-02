import type { JewelleryListingProduct } from "@/features/jewellery-product/types";
import { getProductHref } from "@/features/products/utils/productRoutes";
import { getImageSrc } from "@/shared/utils/image";

export const MORE_FOR_YOU_PRODUCT_LIMIT = 8;

export type MoreForYouCarouselItem = {
  id: string;
  name: string;
  href: string;
  image: string;
};

export function mapJewelleryListingToMoreForYouItems(
  products: JewelleryListingProduct[],
  excludeSku: string,
  limit = MORE_FOR_YOU_PRODUCT_LIMIT,
): MoreForYouCarouselItem[] {
  const normalizedExcludeSku = excludeSku.trim();

  return products
    .filter((product) => product.sku !== normalizedExcludeSku)
    .slice(0, limit)
    .flatMap((product) => {
      const image = getImageSrc(product.primaryImage);
      if (!image) {
        return [];
      }

      return [
        {
          id: product.sku,
          name: product.name,
          href: getProductHref({ urlKey: product.urlKey, id: product.sku }),
          image,
        },
      ];
    });
}

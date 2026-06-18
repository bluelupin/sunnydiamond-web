import { jewelleryListingProducts } from "@/features/jewellery-product/data/products";
import { products } from "@/features/products/data/products";

export const moreForYouTransparentImages = [
  "/images/products/more-for-you/bracelet-left.png",
  "/images/products/more-for-you/ring-center.png",
  "/images/products/more-for-you/bracelet-right.png",
] as const;

export type MoreForYouCarouselItem = {
  id: string;
  name: string;
  href: string;
  image: string;
};

export function getMoreForYouCarouselItems(currentProductId: string): MoreForYouCarouselItem[] {
  const pool = products.filter((product) => product.id !== currentProductId);

  return pool.map((product, index) => {
    const listing = jewelleryListingProducts.find((item) => item.id.startsWith(`${product.id}-`));

    return {
      id: product.id,
      name: listing?.name ?? product.name,
      href: `/product/${product.id}`,
      image: moreForYouTransparentImages[index % moreForYouTransparentImages.length],
    };
  });
}

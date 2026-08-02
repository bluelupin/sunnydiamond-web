import type { Product } from "@/features/products/data/products";
import {
  PRODUCT_DETAIL_GALLERY_HERO_IMAGE,
  PRODUCT_DETAIL_GALLERY_LIFESTYLE_IMAGE,
  PRODUCT_DETAIL_GALLERY_SECOND_IMAGE,
  PRODUCT_DETAIL_GALLERY_THIRD_IMAGE,
} from "@/features/products/data/productGalleryContent";

export const PRODUCT_DETAIL_GALLERY_SLIDE_COUNT = 5;

export const getProductDetailCarouselImages = (product: Product) => {
  const [productHeroImage, productThumbOne, productThumbTwo] = product.images;
  const heroImage = productHeroImage ?? PRODUCT_DETAIL_GALLERY_HERO_IMAGE;
  const thumbOne = productThumbOne ?? PRODUCT_DETAIL_GALLERY_SECOND_IMAGE;
  const thumbTwo = productThumbTwo ?? PRODUCT_DETAIL_GALLERY_THIRD_IMAGE;
  const lifestyleImage =
    product.lifestyleImage ?? product.images[3] ?? PRODUCT_DETAIL_GALLERY_LIFESTYLE_IMAGE;

  return [
    heroImage ?? product.image,
    thumbOne ?? product.image,
    thumbTwo ?? product.image,
    lifestyleImage,
    product.image,
  ].slice(0, PRODUCT_DETAIL_GALLERY_SLIDE_COUNT);
};

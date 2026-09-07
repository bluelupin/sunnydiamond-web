import type { Product } from "@/features/products/data/products";

export const PRODUCT_DETAIL_GALLERY_SLIDE_COUNT = 5;

export type ProductDetailGallerySlots = {
  heroImage: Product["image"];
  thumbOne: Product["image"];
  thumbTwo: Product["image"];
  lifestyleImage: Product["image"];
};

export const getProductDetailGallerySlots = (product: Product): ProductDetailGallerySlots => {
  const primary = product.image;
  const [first, second, third, fourth] = product.images;

  return {
    heroImage: first ?? primary,
    thumbOne: second ?? primary,
    thumbTwo: third ?? primary,
    lifestyleImage: product.lifestyleImage ?? fourth ?? second ?? primary,
  };
};

export const getProductDetailCarouselImages = (product: Product) => {
  const { heroImage, thumbOne, thumbTwo, lifestyleImage } = getProductDetailGallerySlots(product);

  return [
    heroImage,
    thumbOne,
    thumbTwo,
    lifestyleImage,
    product.image,
  ].slice(0, PRODUCT_DETAIL_GALLERY_SLIDE_COUNT);
};

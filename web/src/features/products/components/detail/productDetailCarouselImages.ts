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

const lifestyleGalleryFrameClass =
  "relative flex w-full overflow-hidden bg-gray300 md:h-520 lg:h-680";

/** Desktop lifestyle column — one or more images, each in its own frame. */
export function getProductDetailLifestyleImages(product: Product): Product["image"][] {
  const { heroImage, thumbOne, thumbTwo, lifestyleImage } = getProductDetailGallerySlots(product);
  const heroKeys = new Set([String(heroImage), String(thumbOne), String(thumbTwo)]);
  const lifestyleStack = product.images.filter((image) => !heroKeys.has(String(image)));

  if (lifestyleStack.length > 0) {
    return lifestyleStack;
  }

  return [lifestyleImage];
}

export { lifestyleGalleryFrameClass };

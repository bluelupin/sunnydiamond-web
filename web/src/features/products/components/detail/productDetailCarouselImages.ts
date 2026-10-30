import type { Product } from "@/features/products/data/products";
import {
  isValidProductCatalogImage,
  resolveProductCatalogImageSrc,
} from "@/features/products/utils/productImagePlaceholder";

export type ProductDetailGallerySlots = {
  heroImage: Product["image"];
  thumbOne: Product["image"];
  thumbTwo: Product["image"];
  lifestyleImage: Product["image"];
};

const resolveGalleryImage = (src: Product["image"] | undefined): Product["image"] =>
  resolveProductCatalogImageSrc(src);

export const getProductDetailGallerySlots = (product: Product): ProductDetailGallerySlots => {
  const primary = resolveGalleryImage(product.image);
  const [first, second, third, fourth] = product.images.map((image) => resolveGalleryImage(image));

  const lifestyleCandidate =
    product.lifestyleImage ?? fourth ?? second ?? product.image;
  const lifestyleImage = isValidProductCatalogImage(lifestyleCandidate)
    ? resolveGalleryImage(lifestyleCandidate)
    : primary;

  return {
    heroImage: first ?? primary,
    thumbOne: second ?? primary,
    thumbTwo: third ?? primary,
    lifestyleImage,
  };
};

/** Mobile carousel — same order as desktop: hero, two thumbs, then lifestyle stack. */
export const getProductDetailCarouselImages = (product: Product): Product["image"][] => {
  const { heroImage, thumbOne, thumbTwo } = getProductDetailGallerySlots(product);
  const lifestyleImages = getProductDetailLifestyleImages(product);

  return [heroImage, thumbOne, thumbTwo, ...lifestyleImages];
};

const lifestyleGalleryFrameClass =
  "relative flex w-full overflow-hidden bg-gray300 md:h-520 lg:h-680";

/** Desktop lifestyle column — one or more images, each in its own frame. */
export function getProductDetailLifestyleImages(product: Product): Product["image"][] {
  const { heroImage, thumbOne, thumbTwo, lifestyleImage } = getProductDetailGallerySlots(product);
  const heroKeys = new Set([String(heroImage), String(thumbOne), String(thumbTwo)]);
  const lifestyleStack = product.images
    .map((image) => resolveGalleryImage(image))
    .filter((image) => !heroKeys.has(String(image)));

  if (lifestyleStack.length > 0) {
    return lifestyleStack;
  }

  return [lifestyleImage];
}

export { lifestyleGalleryFrameClass };

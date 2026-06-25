import type { StaticImageData } from "next/image";

export type AlankaraThumbnailCrop = {
  height: string;
  width: string;
  left: string;
  top: string;
};

export type AlankaraCollectionProduct = {
  id: string | number;
  name: string;
  image: string | StaticImageData;
  thumbnailImage?: string | StaticImageData;
  thumbnailCrop?: AlankaraThumbnailCrop;
  href: string;
  ctaLabel?: string;
};

export type AlankaraCollectionCta = {
  label: string;
  href: string;
};

export type AlankaraCollectionProps = {
  id?: string;
  title: string;
  description?: string;
  collectionImage: string | StaticImageData;
  collectionImageMobile?: string | StaticImageData;
  collectionCta?: AlankaraCollectionCta;
  products: AlankaraCollectionProduct[];
  defaultProductCtaLabel?: string;
  priority?: boolean;
  className?: string;
  "aria-label"?: string;
};

export const ALANKARA_THUMBNAIL_CROPS = {
  first: {
    height: "109.62%",
    width: "110%",
    left: "-5%",
    top: "-5.53%",
  },
  second: {
    height: "125.57%",
    width: "126%",
    left: "-13%",
    top: "-8.87%",
  },
} as const satisfies Record<string, AlankaraThumbnailCrop>;

/** Mobile carousel hero product image crop (Figma 684:3210). */
export const ALANKARA_MOBILE_PRODUCT_CROP = {
  height: "256.9%",
  width: "220.47%",
  left: "-60.29%",
  top: "-83.31%",
} as const satisfies AlankaraThumbnailCrop;

export const ALANKARA_FALLBACKS = {
  heroDesktop: "/images/collection/hero-desktop.png",
  heroMobile: "/images/collection/hero-mobile.png",
  product: "/images/collection/product-showcase.png",
  firstThumbnail: "/images/collection/thumb-1.png",
  secondThumbnail: "/images/collection/thumb-2.png",
} as const;

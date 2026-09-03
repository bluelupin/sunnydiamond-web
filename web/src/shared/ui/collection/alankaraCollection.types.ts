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
  desktopCrop?: AlankaraThumbnailCrop;
  href: string;
  ctaLabel?: string;
};

export type AlankaraCollectionCta = {
  label: string;
  href: string;
};

export type AlankaraCollectionProps = {
  id?: string;
  sectionHeading?: string;
  title: string;
  description?: string;
  collectionImage: string | StaticImageData;
  collectionImageMobile?: string | StaticImageData;
  collectionDesktopAlt?: string;
  collectionMobileAlt?: string;
  collectionCta?: AlankaraCollectionCta;
  products: AlankaraCollectionProduct[];
  /** Initial carousel index (e.g. featuredProductSku). */
  defaultActiveIndex?: number;
  defaultProductCtaLabel?: string;
  priority?: boolean;
  className?: string;
  "aria-label"?: string;
};

/** Thumbnail image crops from Figma 684:2867. */
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
  third: {
    height: "132.54%",
    width: "133%",
    left: "-16.5%",
    top: "-16.27%",
  },
  fourth: {
    height: "148.49%",
    width: "149%",
    left: "-24.5%",
    top: "-24.46%",
  },
  fifth: {
    height: "99.66%",
    width: "100%",
    left: "0",
    top: "3.75%",
  },
} as const satisfies Record<string, AlankaraThumbnailCrop>;

/** Desktop hero image crop (Figma 684:2071). */
export const ALANKARA_HERO_DESKTOP_CROP = {
  height: "127.71%",
  width: "100%",
  left: "0",
  top: "-27.75%",
} as const satisfies AlankaraThumbnailCrop;

export const ALANKARA_PRODUCT_COUNT = 5;

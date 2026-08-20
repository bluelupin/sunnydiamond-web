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

/** Desktop carousel main product image crop (Figma 684:2859). */
export const ALANKARA_DESKTOP_PRODUCT_CROP = {
  height: "100%",
  width: "111.11%",
  left: "-5.56%",
  top: "-12.71%",
} as const satisfies AlankaraThumbnailCrop;

/** Mobile carousel hero product image crop (Figma 684:3210). */
export const ALANKARA_MOBILE_PRODUCT_CROP = {
  height: "256.9%",
  width: "220.47%",
  left: "-60.29%",
  top: "-83.31%",
} as const satisfies AlankaraThumbnailCrop;

export const ALANKARA_FALLBACKS = {
  heroDesktop: "/images/collection/hero-desktop.webp",
  heroMobile: "/images/collection/hero-mobile.webp",
  thumbnails: [
    "/images/collection/thumb-1.webp",
    "/images/collection/thumb-2.webp",
    "/images/collection/product-showcase.webp",
    "/images/collection/thumb-4.webp",
    "/images/collection/thumb-5.webp",
  ],
  /** @deprecated Use ALANKARA_FALLBACKS.thumbnails */
  firstThumbnail: "/images/collection/thumb-1.webp",
  /** @deprecated Use ALANKARA_FALLBACKS.thumbnails */
  secondThumbnail: "/images/collection/thumb-2.webp",
  /** @deprecated Use ALANKARA_FALLBACKS.thumbnails */
  product: "/images/collection/product-showcase.webp",
} as const;

export const ALANKARA_DEFAULT_ACTIVE_INDEX = 2;

export const ALANKARA_PRODUCT_COUNT = 5;

export type AlankaraFallbackProduct = {
  name: string;
  image: string;
  thumbnailCrop: AlankaraThumbnailCrop;
  desktopCrop?: AlankaraThumbnailCrop;
};

/** Figma 684:2867 — five carousel products with integrated assets. */
export const ALANKARA_FALLBACK_PRODUCTS: readonly AlankaraFallbackProduct[] = [
  {
    name: "Petite Diamond Band",
    image: ALANKARA_FALLBACKS.thumbnails[0],
    thumbnailCrop: ALANKARA_THUMBNAIL_CROPS.first,
  },
  {
    name: "Cluster Diamond Stud",
    image: ALANKARA_FALLBACKS.thumbnails[1],
    thumbnailCrop: ALANKARA_THUMBNAIL_CROPS.second,
  },
  {
    name: "Saptam Diamond Ring",
    image: ALANKARA_FALLBACKS.thumbnails[2],
    thumbnailCrop: ALANKARA_THUMBNAIL_CROPS.third,
    desktopCrop: ALANKARA_DESKTOP_PRODUCT_CROP,
  },
  {
    name: "Arc Diamond Earrings",
    image: ALANKARA_FALLBACKS.thumbnails[3],
    thumbnailCrop: ALANKARA_THUMBNAIL_CROPS.fourth,
  },
  {
    name: "Heritage Diamond Pendant",
    image: ALANKARA_FALLBACKS.thumbnails[4],
    thumbnailCrop: ALANKARA_THUMBNAIL_CROPS.fifth,
  },
];

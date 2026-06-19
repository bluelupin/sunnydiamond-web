import type { StaticImageData } from "next/image";

export type AlankaraCollectionProduct = {
  id: string | number;
  name: string;
  image: string | StaticImageData;
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

export const ALANKARA_FALLBACKS = {
  heroDesktop: "/images/collection/hero-desktop.png",
  heroMobile: "/images/collection/hero-mobile.png",
  product: "/images/collection/product-showcase.png",
} as const;

export type FeaturedCarouselItem = {
  id: string | number;
  name: string;
  price: number | null;
  image: string;
  href: string;
  /** Optional per-slide CTA label (falls back to section `ctaLabel`). */
  ctaLabel?: string;
};

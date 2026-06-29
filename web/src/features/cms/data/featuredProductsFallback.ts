/** Figma 684:2920 — Your Diamond Awaits carousel (left / center / right peeks). */
export const featuredProductsCarouselFallbackImages = [
  "/images/home/featured-products/featured-product-left.png",
  "/images/home/featured-products/featured-product-center.png",
  "/images/home/featured-products/featured-product-right.png",
] as const;

export type FeaturedCarouselFallbackItem = {
  id: string;
  name: string;
  price: number | null;
  image: string;
  href: string;
};

/** Figma 684:2942 — center slide label and price. Side peeks use catalog-style labels. */
export const featuredProductsCarouselFallbackItems: FeaturedCarouselFallbackItem[] = [
  {
    id: "featured-fallback-left",
    name: "Cluster Diamond Stud",
    price: 2800,
    href: "/products",
    image: featuredProductsCarouselFallbackImages[0],
  },
  {
    id: "featured-fallback-center",
    name: "Saptam Diamond Ring",
    price: 8500,
    href: "/products",
    image: featuredProductsCarouselFallbackImages[1],
  },
  {
    id: "featured-fallback-right",
    name: "Petite Diamond Band",
    price: 4500,
    href: "/products",
    image: featuredProductsCarouselFallbackImages[2],
  },
];

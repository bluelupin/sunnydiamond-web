import { siteConfig } from "@/shared/lib/siteConfig";
import { getImageSrc } from "@/shared/utils/image";

interface ProductJsonLdSource {
  name: string;
  description: string;
  image: string | { src: string };
  price: number;
  inStock: boolean;
  rating: number;
  reviews: number;
}

export function buildProductJsonLd(product: ProductJsonLdSource) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: getImageSrc(product.image),
    brand: {
      "@type": "Brand",
      name: siteConfig.brand.name,
    },
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "USD",
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviews,
    },
  };
}

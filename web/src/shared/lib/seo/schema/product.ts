import { siteConfig } from "@/shared/lib/siteConfig";
import { resolveImageSrcString } from "@/shared/utils/image";
import { getAbsoluteUrl } from "@/shared/lib/seo/siteConfig";

interface ProductJsonLdSource {
  sku: string;
  urlKey: string;
  name: string;
  description: string;
  image: string | { src: string };
  price: number;
  inStock: boolean;
  rating: number;
  reviews: number;
}

export function buildProductJsonLd(product: ProductJsonLdSource) {
  const productUrl = getAbsoluteUrl(`/product/${product.urlKey}`);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: resolveImageSrcString(product.image),
    sku: product.sku,
    url: productUrl,
    brand: {
      "@type": "Brand",
      name: siteConfig.brand.name,
    },
    offers: {
      "@type": "Offer",
      url: productUrl,
      price: product.price,
      priceCurrency: "INR",
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
    ...(product.reviews > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: product.rating,
            reviewCount: product.reviews,
          },
        }
      : {}),
  };
}

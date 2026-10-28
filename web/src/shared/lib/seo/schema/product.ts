import { siteConfig } from "@/shared/lib/siteConfig";
import { resolveImageSrcString } from "@/shared/utils/image";
import { getAbsoluteUrl } from "@/shared/lib/seo/siteConfig";

type ImageInput = string | { src: string };

interface ProductJsonLdSource {
  sku: string;
  urlKey: string;
  name: string;
  description: string;
  image: ImageInput;
  images?: ImageInput[];
  /** Metal from Magento (e.g. "18K Rose Gold"); omit when Magento has none. */
  material?: string;
  price: number;
  inStock: boolean;
  rating: number;
  reviews: number;
}

// Free pan-India shipping (decision R-LG-5) and a 15-day return window (R-RM-2;
// Magento sunnydiamonds_orderflow/returns/window_days). Returns are collected by
// courier pickup (R-RM-8). returnFees is left out until the client confirms
// whether pickup is free.
export const OFFER_POLICIES = {
  shippingDetails: {
    "@type": "OfferShippingDetails",
    shippingRate: { "@type": "MonetaryAmount", value: 0, currency: "INR" },
    shippingDestination: { "@type": "DefinedRegion", addressCountry: "IN" },
  },
  hasMerchantReturnPolicy: {
    "@type": "MerchantReturnPolicy",
    applicableCountry: "IN",
    returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
    merchantReturnDays: 15,
    returnMethod: "https://schema.org/ReturnByMail",
  },
} as const;

export function buildProductJsonLd(product: ProductJsonLdSource) {
  const productUrl = getAbsoluteUrl(`/product/${product.urlKey}`);
  const images = product.images?.length ? product.images : [product.image];
  // Real Magento images are absolute CDN URLs; the bundled placeholder used for products
  // without photos is a relative /_next path and must not be published as the product image.
  const imageUrls = [
    ...new Set(images.map((image) => resolveImageSrcString(image)).filter((src) => /^https?:\/\//.test(src))),
  ];

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    ...(imageUrls.length ? { image: imageUrls } : {}),
    sku: product.sku,
    url: productUrl,
    ...(product.material ? { material: product.material } : {}),
    brand: {
      "@type": "Brand",
      name: siteConfig.brand.name,
    },
    offers: {
      "@type": "Offer",
      url: productUrl,
      price: product.price,
      priceCurrency: "INR",
      itemCondition: "https://schema.org/NewCondition",
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      ...OFFER_POLICIES,
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

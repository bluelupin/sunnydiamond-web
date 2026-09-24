import type { Product } from "@/features/products/data/products";
import type { ProductDetailContent, ProductDetailPricing } from "../types/productDetail";
import { getMetalColorOptions } from "@/features/products/utils/metalColorOptions.utils";

function buildAccordions(product: Product) {
  const sections = product.detailSections;
  const candidates = [
    {
      id: "specifications",
      title: "Specifications",
      content: sections?.specifications?.trim() ?? "",
    },
    {
      id: "quality",
      title: "Quality & Certifications",
      content: sections?.qualityCertifications?.trim() ?? "",
    },
    {
      id: "shipping",
      title: "Shipping & Policies",
      content: sections?.shippingPolicies?.trim() ?? "",
    },
    {
      id: "care",
      title: "Care & Maintenance",
      content: sections?.careMaintenance?.trim() ?? "",
    },
    {
      id: "manufacturer",
      title: "Manufactured By",
      content: sections?.manufacturedBy?.trim() ?? "",
    },
  ];

  // Only render accordions that have Magento content — same UI when shown.
  return candidates.filter((accordion) => accordion.content.length > 0);
}

export function getProductDetailPricing(product: Product): ProductDetailPricing {
  const pricing: ProductDetailPricing = {
    price: product.price,
    ...(product.priceBreakup ? { breakup: product.priceBreakup } : {}),
  };

  if (product.originalPrice != null && product.originalPrice > product.price) {
    pricing.originalPrice = product.originalPrice;
  }

  return pricing;
}

/** Canonical product amount — matches Price Breakup popup Total. */
export function getProductDisplayPrice(product: Product): number {
  return getProductDetailPricing(product).price;
}

export function getProductDetailContent(product: Product): ProductDetailContent {
  const metalShort = product.metal.includes("18K") ? "18K Metal" : product.metal;
  const attributes = product.detailAttributes ?? ["IF Grade", metalShort, `${product.carat}`];

  return {
    attributes,
    metalColors: getMetalColorOptions(product),
    accordions: buildAccordions(product),
    heroBannerImage: "/images/products/pdp/hero-banner-poster.png",
    ...(product.productVideoUrl ? { heroBannerVideo: product.productVideoUrl } : {}),
  };
}

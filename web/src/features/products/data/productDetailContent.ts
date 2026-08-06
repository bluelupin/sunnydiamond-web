import type { Product } from "@/features/products/data/products";
import type { ProductDetailContent, ProductDetailPricing } from "../types/productDetail";
import { getMetalColorOptions } from "@/features/products/utils/metalColorOptions.utils";

const benefits = [
  {
    label: "15 Days Return Policy",
    mobileLabel: "15 Days Return Policy",
    lines: ["15 Days", "Return Policy"] as [string, string],
    icon: "/images/products/pdp/benefit-return.svg",
  },
  {
    label: "Cash on Delivery",
    mobileLabel: "Cash on Delivery*",
    lines: ["Cash on", "Delivery"] as [string, string],
    icon: "/images/products/pdp/benefit-cod.svg",
  },
  {
    label: "Pan India Free Shipping",
    mobileLabel: "Pan India Free Shipping",
    lines: ["Pan India", "Free Shipping"] as [string, string],
    icon: "/images/products/pdp/delivery-truck.svg",
  },
];

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
  };

  if (product.originalPrice != null && product.originalPrice > product.price) {
    pricing.originalPrice = product.originalPrice;
  }

  return pricing;
}

export function getProductDetailContent(product: Product): ProductDetailContent {
  const metalShort = product.metal.includes("18K") ? "18K Metal" : product.metal;
  const attributes = product.detailAttributes ?? ["IF Grade", metalShort, `${product.carat}`];

  return {
    attributes,
    metalColors: getMetalColorOptions(product),
    benefits,
    accordions: buildAccordions(product),
    heroBannerImage: "/images/products/pdp/hero-banner-poster.png",
    ...(product.productVideoUrl ? { heroBannerVideo: product.productVideoUrl } : {}),
    visitUsImage: "/images/products/pdp/visit-us-hero.png",
    personaliseImage: "/images/products/pdp/personalise-support.png",
  };
}

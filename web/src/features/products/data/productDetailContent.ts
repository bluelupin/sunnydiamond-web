import type { StaticImageData } from "next/image";
import { jewelleryListingProducts } from "@/features/jewellery-product/data/products";
import type { Product } from "@/features/products/data/products";
import type { ProductDetailContent, ProductDetailPricing } from "../types/productDetail";

const ringSizes = ["4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18"];

const metalColors = [
  { id: "gold", label: "Gold", color: "#D1B57A" },
  { id: "rose", label: "Rose Gold", color: "#D9B0CB" },
  { id: "silver", label: "Silver", color: "#CCCCCC" },
] as const;

const engravingPreviewImage = "/images/about/crafting-diamond.png";

const benefits = [
  {
    label: "Cash on Delivery",
    mobileLabel: "Cash on Delivery*",
    lines: ["Cash on", "Delivery"] as [string, string],
    icon: "/images/products/pdp/benefit-cod.svg",
  },
  {
    label: "15 Days Return Policy",
    mobileLabel: "15 Days Return Policy",
    lines: ["15 Days", "Return Policy"] as [string, string],
    icon: "/images/products/pdp/benefit-return.svg",
  },
  {
    label: "Pan India Free Shipping",
    mobileLabel: "Pan India Free Shipping",
    lines: ["Pan India", "Free Shipping"] as [string, string],
    icon: "/images/products/pdp/delivery-truck.svg",
  },
];

function buildAccordions(product: Product) {
  return [
    {
      id: "specifications",
      title: "Specifications",
      content: `Metal: ${product.metal}. Diamond weight: ${product.carat}. Crafted with precision-set stones and a polished finish designed for everyday elegance.`,
    },
    {
      id: "quality",
      title: "Quality & Certifications",
      content:
        "Every Sunny diamond is independently certified for cut, colour, clarity, and carat. Each piece undergoes rigorous quality checks before it reaches you.",
    },
    {
      id: "shipping",
      title: "Shipping & Policies",
      content:
        "Pan India free shipping on all orders. Standard delivery in 5–7 business days. Express delivery available in select cities.",
    },
    {
      id: "care",
      title: "Care & Maintenance",
      content:
        "Clean gently with a soft cloth. Store separately to avoid scratches. Annual professional cleaning recommended to maintain brilliance.",
    },
    {
      id: "manufacturer",
      title: "Manufactured By",
      content: "Sunny Diamonds Pvt. Ltd., Kerala, India. BIS Hallmarked gold. IGI/GIA certified diamonds.",
    },
  ];
}

export function getProductDetailPricing(productId: string): ProductDetailPricing {
  const listing = jewelleryListingProducts.find((item) => item.id.startsWith(`${productId}-`));

  if (listing) {
    return {
      price: listing.price,
      originalPrice: listing.price + 1000,
    };
  }

  return { price: 9880, originalPrice: 10880 };
}

export function getProductDetailContent(product: Product): ProductDetailContent {
  const metalShort = product.metal.includes("18K") ? "18K Metal" : product.metal;

  return {
    attributes: ["IF Grade", metalShort, `${product.carat} Diamond`],
    metalColors: [...metalColors],
    ringSizes,
    engravingPreviewImage,
    benefits,
    accordions: buildAccordions(product),
    heroBannerImage: "/images/products/pdp/hero-banner-poster.png",
    heroBannerVideo: "/videos/pdp-lifestyle-banner.mp4",
    visitUsImage: "/images/products/pdp/visit-us-hero.png",
    personaliseImage: "/images/products/pdp/personalise-support.png",
  };
}

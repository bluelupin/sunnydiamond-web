import type { MetadataRoute } from "next";
import { products } from "@/features/products/data/products";
import { siteEnv } from "@/shared/lib/seo/siteConfig";

const staticRoutes = [
  { url: "/", changeFrequency: "weekly" as const, priority: 1 },
  { url: "/jewellery", changeFrequency: "weekly" as const, priority: 0.8 },
  { url: "/about", changeFrequency: "monthly" as const, priority: 0.6 },
  { url: "/contact", changeFrequency: "monthly" as const, priority: 0.6 },
  { url: "/education", changeFrequency: "monthly" as const, priority: 0.5 },
  { url: "/diamonds-for-everyone", changeFrequency: "monthly" as const, priority: 0.5 },
  { url: "/careers", changeFrequency: "monthly" as const, priority: 0.5 },
  { url: "/news", changeFrequency: "monthly" as const, priority: 0.5 },
  { url: "/store-locator", changeFrequency: "monthly" as const, priority: 0.5 },
  { url: "/faqs", changeFrequency: "monthly" as const, priority: 0.5 },
  { url: "/book-an-appointment", changeFrequency: "monthly" as const, priority: 0.5 },
  { url: "/bespoke-jewellery", changeFrequency: "monthly" as const, priority: 0.5 },
  { url: "/order-tracking", changeFrequency: "monthly" as const, priority: 0.5 },
  { url: "/returns-and-cancellations", changeFrequency: "monthly" as const, priority: 0.5 },
  { url: "/exchange-and-resizing", changeFrequency: "monthly" as const, priority: 0.5 },
  { url: "/shipping-delivery", changeFrequency: "monthly" as const, priority: 0.5 },
  { url: "/cash-on-delivery-policy", changeFrequency: "monthly" as const, priority: 0.5 },
  {
    url: "/old-gold-purchase-policy-kerala-only",
    changeFrequency: "monthly" as const,
    priority: 0.5,
  },
  { url: "/privacy-policy", changeFrequency: "monthly" as const, priority: 0.5 },
  { url: "/terms-and-conditions", changeFrequency: "monthly" as const, priority: 0.5 },
];

const productRoutes = products.map((product) => ({
  url: `/product/${product.urlKey}`,
  changeFrequency: "weekly" as const,
  priority: 0.7,
}));

export default function sitemap(): MetadataRoute.Sitemap {
  return [...staticRoutes, ...productRoutes].map((route) => ({
    url: new URL(route.url, siteEnv.baseUrl).toString(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
    lastModified: new Date(),
  }));
}

import type { MetadataRoute } from "next";
import { products } from "@/data/products";
import { siteEnv } from "@/lib/seo/siteConfig";

const staticRoutes = [
  { url: "/", changeFrequency: "weekly" as const, priority: 1 },
  { url: "/products", changeFrequency: "weekly" as const, priority: 0.8 },
  { url: "/about", changeFrequency: "monthly" as const, priority: 0.6 },
  { url: "/contact", changeFrequency: "monthly" as const, priority: 0.6 },
];

const productRoutes = products.map((product) => ({
  url: `/product/${product.id}`,
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

import type { MetadataRoute } from "next";
import { blogs } from "@/data/blogs";
import { products } from "@/data/products";
import { siteEnv } from "@/lib/seo/siteConfig";

const staticRoutes = [
  { url: "/", changeFrequency: "weekly" as const, priority: 1 },
  { url: "/products", changeFrequency: "weekly" as const, priority: 0.8 },
  { url: "/about", changeFrequency: "monthly" as const, priority: 0.6 },
  { url: "/contact", changeFrequency: "monthly" as const, priority: 0.6 },
  { url: "/education", changeFrequency: "monthly" as const, priority: 0.5 },
  { url: "/diamonds-for-everyone", changeFrequency: "monthly" as const, priority: 0.5 },
  { url: "/careers", changeFrequency: "monthly" as const, priority: 0.5 },
  { url: "/news", changeFrequency: "monthly" as const, priority: 0.5 },
  { url: "/blogs", changeFrequency: "monthly" as const, priority: 0.5 },
  { url: "/store-locator", changeFrequency: "monthly" as const, priority: 0.5 },
  { url: "/faqs", changeFrequency: "monthly" as const, priority: 0.5 },
  { url: "/book-an-appointment", changeFrequency: "monthly" as const, priority: 0.5 },
  { url: "/bespoke-jewellery", changeFrequency: "monthly" as const, priority: 0.5 },
  { url: "/order-tracking", changeFrequency: "monthly" as const, priority: 0.5 },
  { url: "/help-and-support", changeFrequency: "monthly" as const, priority: 0.5 },
  { url: "/monthly-plans", changeFrequency: "monthly" as const, priority: 0.5 },
  { url: "/gift-card", changeFrequency: "monthly" as const, priority: 0.5 },
  { url: "/finance-options", changeFrequency: "monthly" as const, priority: 0.5 },
  { url: "/policy-and-certification", changeFrequency: "monthly" as const, priority: 0.5 },
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
  url: `/product/${product.id}`,
  changeFrequency: "weekly" as const,
  priority: 0.7,
}));

const blogRoutes = blogs.map((post) => ({
  url: `/blogs/${post.slug}`,
  changeFrequency: "monthly" as const,
  priority: 0.4,
}));

export default function sitemap(): MetadataRoute.Sitemap {
  return [...staticRoutes, ...productRoutes, ...blogRoutes].map((route) => ({
    url: new URL(route.url, siteEnv.baseUrl).toString(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
    lastModified: new Date(),
  }));
}

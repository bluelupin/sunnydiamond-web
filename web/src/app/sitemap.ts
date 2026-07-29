import type { MetadataRoute } from "next";
import {
  buildJewelleryCategoryHref,
  MAGENTO_URL_KEY_TO_SLUG,
} from "@/features/jewellery-product/utils/jewelleryRoutes";
import { getAllBlogSlugs } from "@/features/blogs/data/getBlogDetail";
import { getMagentoProductSitemapEntries } from "@/services/magento/products/sitemapProducts.service";
import { siteEnv } from "@/shared/lib/seo/siteConfig";

export const revalidate = 3600;

const staticRoutes = [
  { url: "/", changeFrequency: "weekly" as const, priority: 1 },
  { url: "/jewellery", changeFrequency: "daily" as const, priority: 0.9 },
  { url: "/about", changeFrequency: "monthly" as const, priority: 0.6 },
  { url: "/contact", changeFrequency: "monthly" as const, priority: 0.6 },
  { url: "/education", changeFrequency: "monthly" as const, priority: 0.5 },
  { url: "/diamonds-for-everyone", changeFrequency: "monthly" as const, priority: 0.5 },
  { url: "/careers", changeFrequency: "monthly" as const, priority: 0.5 },
  { url: "/news", changeFrequency: "monthly" as const, priority: 0.5 },
  { url: "/blogs", changeFrequency: "weekly" as const, priority: 0.6 },
  { url: "/store-locator", changeFrequency: "monthly" as const, priority: 0.6 },
  { url: "/faqs", changeFrequency: "monthly" as const, priority: 0.5 },
  { url: "/book-an-appointment", changeFrequency: "monthly" as const, priority: 0.6 },
  { url: "/bespoke-jewellery", changeFrequency: "monthly" as const, priority: 0.7 },
  { url: "/gifting", changeFrequency: "weekly" as const, priority: 0.8 },
  { url: "/order-tracking", changeFrequency: "monthly" as const, priority: 0.4 },
  { url: "/returns-and-cancellations", changeFrequency: "monthly" as const, priority: 0.4 },
  { url: "/exchange-and-resizing", changeFrequency: "monthly" as const, priority: 0.4 },
  { url: "/shipping-delivery", changeFrequency: "monthly" as const, priority: 0.4 },
  { url: "/cash-on-delivery-policy", changeFrequency: "monthly" as const, priority: 0.4 },
  {
    url: "/old-gold-purchase-policy-kerala-only",
    changeFrequency: "monthly" as const,
    priority: 0.4,
  },
  { url: "/privacy-policy", changeFrequency: "monthly" as const, priority: 0.4 },
  { url: "/terms-and-conditions", changeFrequency: "monthly" as const, priority: 0.4 },
];

const categoryRoutes = Object.keys(MAGENTO_URL_KEY_TO_SLUG).map((urlKey) => ({
  url: buildJewelleryCategoryHref(urlKey),
  changeFrequency: "daily" as const,
  priority: 0.8,
}));

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let productRoutes: MetadataRoute.Sitemap = [];

  try {
    const products = await getMagentoProductSitemapEntries();
    productRoutes = products.map((product) => ({
      url: new URL(`/product/${product.urlKey}`, siteEnv.baseUrl).toString(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch {
    productRoutes = [];
  }

  return [...staticRoutes, ...categoryRoutes, ...productRoutes, ...getBlogSlugRoutes()].map(
    (route) => ({
      url: new URL(route.url, siteEnv.baseUrl).toString(),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    }),
  );
}

function getBlogSlugRoutes(): MetadataRoute.Sitemap {
  return getAllBlogSlugs().map((slug) => ({
    url: `/blogs/${slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.55,
  }));
}

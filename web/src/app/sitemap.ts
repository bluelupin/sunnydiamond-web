import type { MetadataRoute } from "next";
import {
  buildJewelleryCategoryHref,
  JEWELLERY_CATEGORY_URL_KEYS,
} from "@/features/jewellery-product/utils/jewelleryRoutes";
import { getAllBlogSlugsForStaticParams } from "@/services/blogs/blogs.service";
import { getMagentoProductSitemapEntries } from "@/services/magento/products/sitemapProducts.service";
import { siteEnv } from "@/shared/lib/seo/siteConfig";

export const revalidate = 3600;

const staticRoutes = [
  { url: "/", changeFrequency: "weekly" as const, priority: 1 },
  { url: "/jewellery", changeFrequency: "daily" as const, priority: 0.9 },
  { url: "/world-of-sunny", changeFrequency: "monthly" as const, priority: 0.6 },
  { url: "/contact", changeFrequency: "monthly" as const, priority: 0.6 },
  { url: "/learn-about-diamonds", changeFrequency: "monthly" as const, priority: 0.5 },
  { url: "/diamonds-for-everyone", changeFrequency: "monthly" as const, priority: 0.5 },
  { url: "/careers", changeFrequency: "monthly" as const, priority: 0.5 },
  { url: "/blogs", changeFrequency: "weekly" as const, priority: 0.6 },
  { url: "/store-locator", changeFrequency: "monthly" as const, priority: 0.6 },
  { url: "/faqs", changeFrequency: "monthly" as const, priority: 0.5 },
  { url: "/book-an-appointment", changeFrequency: "monthly" as const, priority: 0.6 },
  { url: "/bespoke-jewellery", changeFrequency: "monthly" as const, priority: 0.7 },
  { url: "/gifting", changeFrequency: "weekly" as const, priority: 0.8 },
  { url: "/order-tracking", changeFrequency: "monthly" as const, priority: 0.4 },
  { url: "/policy-and-certifications", changeFrequency: "monthly" as const, priority: 0.4 },
];

const categoryRoutes = JEWELLERY_CATEGORY_URL_KEYS.map((urlKey) => ({
  url: buildJewelleryCategoryHref(urlKey),
  changeFrequency: "daily" as const,
  priority: 0.8,
}));

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let productRoutes: Array<{
    url: string;
    changeFrequency: "weekly";
    priority: number;
  }> = [];
  let blogRoutes: Array<{
    url: string;
    changeFrequency: "weekly";
    priority: number;
  }> = [];

  try {
    const products = await getMagentoProductSitemapEntries();
    productRoutes = products.map((product) => ({
      url: `/product/${product.urlKey}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch {
    productRoutes = [];
  }

  try {
    const slugs = await getAllBlogSlugsForStaticParams();
    blogRoutes = slugs.map((slug) => ({
      url: `/blogs/${slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.55,
    }));
  } catch {
    blogRoutes = [];
  }

  return [...staticRoutes, ...categoryRoutes, ...productRoutes, ...blogRoutes].map(
    (route) => ({
      url: new URL(route.url, siteEnv.baseUrl).toString(),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    }),
  );
}

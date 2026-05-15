import type { MetadataRoute } from "next";
import { siteEnv } from "@/lib/seo/siteConfig";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      siteEnv.indexing
        ? { userAgent: "*", allow: "/" }
        : { userAgent: "*", disallow: "/" },
    ],
    sitemap: `${siteEnv.baseUrl}/sitemap.xml`,
    host: siteEnv.baseUrl,
  };
}

import { getAbsoluteUrl } from "@/shared/lib/seo/siteConfig";

export type CdnPurgeResult = "not_configured" | "purged" | "failed";

/** Purge the HTML URLs after Next's cache is invalidated. Only runs with zone-scoped credentials. */
export async function purgeTrendingPageCdn(): Promise<CdnPurgeResult> {
  const zoneId = process.env.CLOUDFLARE_ZONE_ID?.trim();
  const token = process.env.CLOUDFLARE_API_TOKEN?.trim();
  if (!zoneId || !token) return "not_configured";

  try {
    const response = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/purge_cache`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ files: [getAbsoluteUrl("/"), getAbsoluteUrl("/gifting")] }),
      cache: "no-store",
      signal: AbortSignal.timeout(5_000),
    });
    const result = (await response.json()) as { success?: boolean };
    if (!response.ok || result.success !== true) {
      console.error("Cloudflare trending page purge failed", { status: response.status });
      return "failed";
    }
    return "purged";
  } catch (error) {
    console.error("Cloudflare trending page purge failed", error);
    return "failed";
  }
}

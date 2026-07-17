/** Strip trailing slashes and accidental `/api` suffix from a base URL. */
function normalizeBaseUrl(url: string): string {
  return url.trim().replace(/\/api\/?$/, "").replace(/\/$/, "");
}

/**
 * Strapi CMS origin used for API requests and `/uploads` media resolution.
 *
 * Precedence (first defined wins):
 * 1. NEXT_PUBLIC_STRAPI_URL
 * 2. NEXT_PUBLIC_API_URL
 * 3. NEXT_PUBLIC_SITE_URL — legacy fallback when CMS and site shared one env var
 */
export function getStrapiBaseUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_STRAPI_URL?.trim() ||
    process.env.NEXT_PUBLIC_API_URL?.trim() ||
    process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (!raw) {
    throw new Error(
      "Missing CMS base URL. Set NEXT_PUBLIC_STRAPI_URL (recommended), NEXT_PUBLIC_API_URL, or NEXT_PUBLIC_SITE_URL.",
    );
  }

  return normalizeBaseUrl(raw);
}

/**
 * Public frontend origin for SEO canonical URLs and absolute links.
 * Prefer NEXT_PUBLIC_FRONTEND_URL when Strapi and the Next.js app use separate hosts.
 */
export function getPublicSiteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_FRONTEND_URL?.trim() ||
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    "https://sunnydiamonds.com";

  return normalizeBaseUrl(raw);
}

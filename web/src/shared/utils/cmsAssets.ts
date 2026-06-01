const CMS_BASE_URL: string =
  process.env.NEXT_PUBLIC_STRAPI_MEDIA_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  process.env.NEXT_PUBLIC_STRAPI_URL ??
  "";

/**
 * Normalizes Strapi media URLs.
 * - If `url` is already absolute, returns it as-is.
 * - If `url` is relative (e.g. `/uploads/...`), prefixes with the CMS base URL.
 */
export function getCmsAssetUrl(url?: string | null): string | undefined {
  const raw = typeof url === "string" ? url.trim() : "";
  if (!raw) return undefined;

  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
  if (!CMS_BASE_URL) return raw;

  const base = CMS_BASE_URL.endsWith("/") ? CMS_BASE_URL.slice(0, -1) : CMS_BASE_URL;
  const path = raw.startsWith("/") ? raw : `/${raw}`;
  return `${base}${path}`;
}


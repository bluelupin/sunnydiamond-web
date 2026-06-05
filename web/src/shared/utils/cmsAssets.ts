const CMS_BASE_URL: string = process.env.NEXT_PUBLIC_SITE_URL?.trim() ?? "";
const CMS_ROOT_URL = CMS_BASE_URL.replace(/\/api\/?$/, "");

/**
 * Normalizes Strapi media URLs.
 * - If `url` is already absolute, returns it as-is.
 * - If `url` is relative (e.g. `/uploads/...`), prefixes with the Strapi URL.
 */
export function getCmsAssetUrl(url?: string | null): string | undefined {
  const raw = typeof url === "string" ? url.trim() : "";
  if (!raw) return undefined;

  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
  if (!CMS_ROOT_URL) return raw;

  const base = CMS_ROOT_URL.endsWith("/") ? CMS_ROOT_URL.slice(0, -1) : CMS_ROOT_URL;
  const path = raw.startsWith("/") ? raw : `/${raw}`;
  return `${base}${path}`;
}

